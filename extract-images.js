#!/usr/bin/env node
/**
 * extract-images.js - 从 Excel 中提取产品图片并自动匹配型号
 *
 * 使用方法:
 *   node extract-images.js "C:\Users\Mario\Desktop\杰冠产品参数带的图 (1).xlsx"
 *
 * 图片会保存到 images/ 文件夹，文件名=型号.jpg
 */

var fs = require('fs');
var path = require('path');
var JSZip = require('jszip');
var XLSX = require('xlsx');

var excelPath = process.argv[2];
if (!excelPath) {
  console.log('用法: node extract-images.js <Excel文件路径>');
  console.log('示例: node extract-images.js "杰冠产品参数带的图 (1).xlsx"');
  process.exit(1);
}

if (!fs.existsSync(excelPath)) {
  console.log('文件不存在:', excelPath);
  process.exit(1);
}

var OUTPUT_DIR = path.join(__dirname, 'images');

async function main() {
  console.log('=== 杰冠产品图片提取工具 ===\n');

  // Step 1: Read model numbers from Excel
  console.log('1. 读取产品型号...');
  var workbook = XLSX.readFile(excelPath);
  var sheetName = workbook.SheetNames[0];
  var sheet = workbook.Sheets[sheetName];
  var range = XLSX.utils.decode_range(sheet['!ref']);

  var modelMap = {}; // Excel row (0-based) -> model number
  for (var r = range.s.r; r <= range.e.r; r++) {
    var cell = sheet[XLSX.utils.encode_cell({ r: r, c: 0 })]; // Column A
    if (cell && cell.v) {
      var model = String(cell.v).trim();
      if (model && model !== '型号' && /^[A-Za-z0-9]/.test(model)) {
        modelMap[r] = model;
      }
    }
  }
  // Also build reverse: model -> row
  var modelToRow = {};
  for (var r2 in modelMap) { modelToRow[modelMap[r2]] = parseInt(r2); }
  console.log('   找到 ' + Object.keys(modelMap).length + ' 个产品型号\n');

  // Step 2: Open Excel as ZIP and extract images + drawing info
  console.log('2. 解析 Excel 内部结构...');
  var zipData = fs.readFileSync(excelPath);
  var zip = await JSZip.loadAsync(zipData);

  // List all images in xl/media/
  var imageFiles = Object.keys(zip.files).filter(function(f) {
    return f.startsWith('xl/media/') && !zip.files[f].dir;
  });
  console.log('   找到 ' + imageFiles.length + ' 张图片\n');

  if (imageFiles.length === 0) {
    console.log('Excel 中没有嵌入图片。');
    process.exit(0);
  }

  // Step 3: Try to read drawing XML to map images to rows
  console.log('3. 分析图片位置...');
  var imageToRow = {}; // image filename -> row number

  // Find drawing XML files
  var drawingFiles = Object.keys(zip.files).filter(function(f) {
    return f.match(/xl\/drawings\/drawing\d+\.xml/) && !zip.files[f].dir;
  });

  for (var di = 0; di < drawingFiles.length; di++) {
    var drawingXml = await zip.files[drawingFiles[di]].async('string');
    // Parse xdr:twoCellAnchor elements to find image positions
    var anchorRegex = /<xdr:twoCellAnchor[^>]*>([\s\S]*?)<\/xdr:twoCellAnchor>/g;
    var anchorMatch;
    while ((anchorMatch = anchorRegex.exec(drawingXml)) !== null) {
      var anchorContent = anchorMatch[1];
      // Get row from from element: <xdr:from><xdr:row>N</xdr:row>
      var rowMatch = anchorContent.match(/<xdr:from>\s*<xdr:col>(\d+)<\/xdr:col>\s*<xdr:row>(\d+)<\/xdr:row>/);
      // Get image reference: <a:blip r:embed="rIdN"/>
      var blipMatch = anchorContent.match(/r:embed="(rId\d+)"/);

      if (rowMatch && blipMatch) {
        var row = parseInt(rowMatch[1]); // row index (0-based)
        var rId = blipMatch[1];
        imageToRow[rId] = row;
      }
    }
  }

  // Step 4: Read relationship XML to map rId to image filename
  var relFiles = Object.keys(zip.files).filter(function(f) {
    return f.match(/xl\/drawings\/_rels\/drawing\d+\.xml\.rels/) && !zip.files[f].dir;
  });

  var rIdToFile = {}; // rId -> media/filename
  for (var ri = 0; ri < relFiles.length; ri++) {
    var relXml = await zip.files[relFiles[ri]].async('string');
    var relRegex = /Id="(rId\d+)"[^>]*Target="([^"]+)"/g;
    var relMatch;
    while ((relMatch = relRegex.exec(relXml)) !== null) {
      rIdToFile[relMatch[1]] = relMatch[2];
    }
  }

  // Step 5: Build final mapping: model -> image data
  console.log('4. 匹配图片到产品型号...');
  var modelToImage = {}; // model -> { data, ext }
  var matchedCount = 0;
  var unmatchedImages = [];

  // Try XML-based matching first
  for (var rId in imageToRow) {
    var rowNum = imageToRow[rId];
    var fileRef = rIdToFile[rId];
    if (fileRef && modelMap[rowNum]) {
      var model = modelMap[rowNum];
      var mediaFile = 'xl/' + fileRef.replace('../', '');
      if (zip.files[mediaFile]) {
        var ext = path.extname(mediaFile).toLowerCase() || '.jpg';
        var data = await zip.files[mediaFile].async('nodebuffer');
        modelToImage[model] = { data: data, ext: ext };
        matchedCount++;
      }
    }
  }

  console.log('   XML匹配成功: ' + matchedCount + ' 张');

  // For unmatched images, try sequential matching
  if (matchedCount < imageFiles.length) {
    var sortedModels = Object.keys(modelMap).sort(function(a, b) { return a - b; });
    var sortedImages = imageFiles.sort();

    for (var ii = 0; ii < sortedImages.length; ii++) {
      var imgFile = sortedImages[ii];
      // Skip if already matched
      var alreadyMatched = false;
      for (var m in modelToImage) {
        if (modelToImage[m]) alreadyMatched = true;
      }
      if (alreadyMatched && matchedCount >= imageFiles.length) break;

      var imgData = await zip.files[imgFile].async('nodebuffer');
      var imgExt = path.extname(imgFile).toLowerCase() || '.jpg';

      // Check if image isn't already assigned
      var imgAssigned = false;
      for (var m2 in modelToImage) {
        if (modelToImage[m2] && modelToImage[m2].data.equals(imgData)) {
          imgAssigned = true;
          break;
        }
      }
      if (imgAssigned) continue;

      // Try to match by position (image index to row order)
      if (ii < sortedModels.length && !modelToImage[sortedModels[ii]]) {
        modelToImage[sortedModels[ii]] = { data: imgData, ext: imgExt };
        matchedCount++;
      }
    }
  }

  // Step 6: Save images
  console.log('5. 保存图片...');
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  var savedCount = 0;
  var totalSize = 0;
  for (var model in modelToImage) {
    var img = modelToImage[model];
    // Find or create series directory (use 'default' for now, user can reorganize)
    var targetDir = OUTPUT_DIR;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    var fileName = model + img.ext;
    var filePath = path.join(targetDir, fileName);
    fs.writeFileSync(filePath, img.data);
    savedCount++;
    totalSize += img.data.length;
    console.log('   [OK] ' + fileName + ' (' + (img.data.length / 1024).toFixed(1) + 'KB)');
  }

  console.log('\n=== 完成 ===');
  console.log('共提取 ' + savedCount + ' 张图片 (' + (totalSize / 1024 / 1024).toFixed(1) + 'MB)');
  console.log('图片保存在: ' + OUTPUT_DIR);
  console.log('\n下一步: 运行 node update-data.js 生成 data.js');
}

main().catch(function(err) {
  console.error('错误:', err.message);
  process.exit(1);
});
