#!/usr/bin/env node
/**
 * update-data.js - 批量导入产品图片
 *
 * 使用方法:
 *   1. 将产品图片放入 images/ 对应系列文件夹中
 *      文件名用产品型号命名，如: images/combi-steamer/EOA-101-CMP.jpg
 *   2. 运行: node update-data.js
 *   3. 生成 data/images-data.js
 *   4. 在 index.html 的 <head> 中加入: <script src="data/images-data.js"></script>
 */

var fs = require('fs');
var path = require('path');

var IMAGES_DIR = path.join(__dirname, 'images');
var OUTPUT_FILE = path.join(__dirname, 'data', 'images-data.js');

var imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function scanImages() {
  var result = {};
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('images/ 目录不存在，正在创建...');
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    return result;
  }

  var seriesDirs = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(function(d) { return d.isDirectory(); });

  var totalSize = 0;

  for (var si = 0; si < seriesDirs.length; si++) {
    var dir = seriesDirs[si];
    var seriesPath = path.join(IMAGES_DIR, dir.name);
    var files = fs.readdirSync(seriesPath);

    for (var fi = 0; fi < files.length; fi++) {
      var file = files[fi];
      var ext = path.extname(file).toLowerCase();
      if (imageExtensions.indexOf(ext) === -1) continue;

      var filePath = path.join(seriesPath, file);
      var data = fs.readFileSync(filePath);
      var base64 = data.toString('base64');
      var mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
               : ext === '.png' ? 'image/png'
               : ext === '.gif' ? 'image/gif'
               : ext === '.webp' ? 'image/webp'
               : 'image/bmp';

      // Key: model name from filename (without extension)
      var model = path.basename(file, ext);
      result[model] = 'data:' + mime + ';base64,' + base64;
      totalSize += data.length;

      console.log('  [OK] ' + dir.name + '/' + file + ' (' + (data.length / 1024).toFixed(1) + 'KB)');
    }
  }

  console.log('\n总计: ' + Object.keys(result).length + ' 张图片, ' + (totalSize / 1024).toFixed(1) + 'KB');
  return result;
}

console.log('=== 杰冠产品图片批量导入工具 ===\n');
console.log('扫描 images/ 文件夹...');
var images = scanImages();
var count = Object.keys(images).length;

if (count === 0) {
  console.log('\n未找到图片。请将图片放入 images/<系列>/ 文件夹中。');
  console.log('示例: images/combi-steamer/EOA-101-CMP.jpg');
  console.log('\n可用的系列文件夹:');
  var series = ['combi-steamer', 'combination-oven', 'chicken-rotisserie', 'electric-fryer',
    'gas-fryer', 'griddle', 'pasta-cooker', 'western-fastfood', 'coffee-machine',
    'oven', 'supermarket', 'snack', 'induction'];
  for (var i = 0; i < series.length; i++) {
    console.log('  - images/' + series[i] + '/');
  }
  process.exit(0);
}

// Generate output
var output = '// 自动生成文件 - 请勿手动修改\n'
  + '// 生成时间: ' + new Date().toISOString() + '\n'
  + '// 包含 ' + count + ' 张产品图片\n'
  + 'var IMAGE_DATA = ' + JSON.stringify(images, null, 2) + ';\n';

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

console.log('\n已生成: ' + OUTPUT_FILE + ' (' + (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1) + 'KB)');
console.log('\n下一步:');
console.log('  在 index.html 的 <head> 中添加:');
console.log('  <script src="data/images-data.js"></script>');
console.log('\n完成！图片将自动匹配到对应产品。');
