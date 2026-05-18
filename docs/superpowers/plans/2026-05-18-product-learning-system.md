# Product Learning & Exam System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [`) syntax for tracking.

**Goal:** Build a local HTML-based product learning & exam system for 杰冠 kitchen equipment, with learning center, practice quizzes, mock exams, wrong answer collection, and admin panel.

**Architecture:** Single `index.html` file containing all HTML/CSS/JS. Product data embedded as defaults, extended via localStorage. Images stored as base64. Helper script `update-data.js` for batch image import.

**Tech Stack:** Vanilla HTML/CSS/JavaScript (no frameworks), localStorage, Node.js helper script

---

## File Structure

```
product-learning-system/
├── index.html                  ← Main application (all-in-one)
├── update-data.js              ← Node.js helper for batch image import
├── data/
│   └── images-data.js          ← Generated base64 image data (from update-data.js)
└── images/                     ← Source images for batch import
    ├── combi-steamer/
    ├── combination-oven/
    ├── chicken-rotisserie/
    ├── electric-fryer/
    ├── gas-fryer/
    ├── griddle/
    ├── pasta-cooker/
    ├── western-fastfood/
    ├── coffee-machine/
    ├── oven/
    ├── supermarket/
    ├── snack/
    └── induction/
```

---

## Task 1: Project Scaffolding & Navigation Shell

**Files:**
- Create: `product-learning-system/index.html`
- Create: `product-learning-system/images/` (all 13 series subdirectories)
- Create: `product-learning-system/data/`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "C:/Users/Mario/product-learning-system/images"/{combi-steamer,combination-oven,chicken-rotisserie,electric-fryer,gas-fryer,griddle,pasta-cooker,western-fastfood,coffee-machine,oven,supermarket,snack,induction}
mkdir -p "C:/Users/Mario/product-learning-system/data"
```

- [ ] **Step 2: Create index.html with page shell, CSS reset, and navigation**

Create `C:/Users/Mario/product-learning-system/index.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>杰冠产品学习考试系统</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, 'Microsoft YaHei', sans-serif; background: #f5f7fa; color: #333; }
  .navbar { background: #1a2332; color: #fff; padding: 0 24px; display: flex; align-items: center; height: 56px; position: sticky; top: 0; z-index: 100; }
  .navbar .logo { font-size: 18px; font-weight: 700; margin-right: 40px; }
  .navbar .nav-links { display: flex; gap: 4px; }
  .navbar .nav-links a { color: #b0bec5; text-decoration: none; padding: 16px 18px; font-size: 14px; border-radius: 6px 6px 0 0; transition: all .2s; cursor: pointer; }
  .navbar .nav-links a:hover, .navbar .nav-links a.active { color: #fff; background: rgba(255,255,255,.1); }
  .navbar .admin-btn { margin-left: auto; color: #607d8b; font-size: 12px; cursor: pointer; padding: 6px 12px; border-radius: 4px; }
  .navbar .admin-btn:hover { color: #b0bec5; background: rgba(255,255,255,.05); }
  .page { display: none; max-width: 1200px; margin: 0 auto; padding: 24px; }
  .page.active { display: block; }
  .page-title { font-size: 22px; font-weight: 600; margin-bottom: 20px; }
</style>
</head>
<body>

<nav class="navbar">
  <div class="logo">杰冠产品学习系统</div>
  <div class="nav-links">
    <a class="active" onclick="showPage('learn')">学习中心</a>
    <a onclick="showPage('practice')">刷题练习</a>
    <a onclick="showPage('exam')">模拟考试</a>
    <a onclick="showPage('wrong')">错题集</a>
  </div>
  <span class="admin-btn" onclick="showAdminLogin()">管理</span>
</nav>

<div id="page-learn" class="page active">
  <h2 class="page-title">学习中心</h2>
</div>
<div id="page-practice" class="page">
  <h2 class="page-title">刷题练习</h2>
</div>
<div id="page-exam" class="page">
  <h2 class="page-title">模拟考试</h2>
</div>
<div id="page-wrong" class="page">
  <h2 class="page-title">错题集</h2>
</div>
<div id="page-admin" class="page">
  <h2 class="page-title">后台管理</h2>
</div>

<script>
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  event.target.classList.add('active');
}
function showAdminLogin() {
  // TODO: next task
}
</script>
</body>
</html>
```

- [ ] **Step 3: Verify shell works**

Open `C:/Users/Mario/product-learning-system/index.html` in a browser. Click each nav link and verify the page switches. All pages should show only their title.

---

## Task 2: Product Data Layer & Embedded Defaults

**Files:**
- Modify: `product-learning-system/index.html` (add data section)

- [ ] **Step 1: Define the 14 product series constants**

Add at the top of the `<script>` section in `index.html`:

```javascript
const SERIES = [
  { id: 'combi-steamer',      label: '万能蒸烤箱系列 Combi-steamer Series' },
  { id: 'combination-oven',   label: '组合炉系列 Combination Oven Series' },
  { id: 'chicken-rotisserie', label: '超市烤鸡炉系列 Supermarket Chicken Rotisserie Series' },
  { id: 'electric-fryer',     label: '电炸炉系列 Electric Fryer Series' },
  { id: 'gas-fryer',          label: '燃气炸炉系列 Gas Fryer Series' },
  { id: 'griddle',            label: '扒炉系列 Griddle Series' },
  { id: 'pasta-cooker',       label: '煮面炉系列 Pasta Cooker Series' },
  { id: 'western-fastfood',   label: '西式快餐系列 Western Fast Food Series' },
  { id: 'coffee-machine',     label: '咖啡机/茶咖机系列 Coffee/Tea Machine Series' },
  { id: 'oven',               label: '烤箱系列 Oven Series' },
  { id: 'supermarket',        label: '超市连锁便利速食系列 Supermarket Chain Store Fast Food Series' },
  { id: 'snack',              label: '小吃系列 Snack Series' },
  { id: 'induction',          label: '电磁炉系列 Induction Cooker Series' }
];
```

- [ ] **Step 2: Add embedded sample product data (2 per series = ~26 products)**

Add default products array with realistic examples:

```javascript
const DEFAULT_PRODUCTS = [
  // 万能蒸烤箱系列
  { id: 'p001', model: 'EOA-101-CMP', name: '10盘万能蒸烤箱', nameEn: '10-Pan Combi Oven', series: 'combi-steamer', image: '', parameters: '10×1/1GN / 18kW / 380V / 848×771×1068mm', parametersEn: '10x 1/1 GN / 18kW / 380V / 848×771×1068mm', functions: '热风烘烤、蒸煮、组合烹饪、低温慢煮、解冻、自动清洗' },
  { id: 'p002', model: 'EOA-051-CMP', name: '5盘万能蒸烤箱', nameEn: '5-Pan Combi Oven', series: 'combi-steamer', image: '', parameters: '5×1/1GN / 9.8kW / 380V / 505×771×782mm', parametersEn: '5x 1/1 GN / 9.8kW / 380V / 505×771×782mm', functions: '热风烘烤、蒸煮、组合烹饪、低温慢煮、解冻、自动清洗' },
  // 组合炉系列
  { id: 'p003', model: 'COA-061', name: '6盘组合炉', nameEn: '6-Pan Combination Oven', series: 'combination-oven', image: '', parameters: '6×1/1GN / 10.8kW / 380V / 840×771×850mm', parametersEn: '6x 1/1 GN / 10.8kW / 380V / 840×771×850mm', functions: '对流烘烤、蒸汽烹饪、组合模式、发酵、解冻' },
  { id: 'p004', model: 'COA-101', name: '10盘组合炉', nameEn: '10-Pan Combination Oven', series: 'combination-oven', image: '', parameters: '10×1/1GN / 18kW / 380V / 840×771×1068mm', parametersEn: '10x 1/1 GN / 18kW / 380V / 840×771×1068mm', functions: '对流烘烤、蒸汽烹饪、组合模式、发酵、解冻' },
  // 超市烤鸡炉系列
  { id: 'p005', model: 'RCA-8P', name: '8叉超市烤鸡炉', nameEn: '8-Spit Chicken Rotisserie', series: 'chicken-rotisserie', image: '', parameters: '8叉 / 9.5kW / 380V / 600×650×1400mm', parametersEn: '8 Spits / 9.5kW / 380V / 600×650×1400mm', functions: '360°旋转烘烤、独立温控、玻璃展示、自动计时' },
  { id: 'p006', model: 'RCA-12P', name: '12叉超市烤鸡炉', nameEn: '12-Spit Chicken Rotisserie', series: 'chicken-rotisserie', image: '', parameters: '12叉 / 14kW / 380V / 850×650×1400mm', parametersEn: '12 Spits / 14kW / 380V / 850×650×1400mm', functions: '360°旋转烘烤、独立温控、玻璃展示、自动计时' },
  // 电炸炉系列
  { id: 'p007', model: 'EFA-201', name: '单缸电炸炉', nameEn: 'Single Tank Electric Fryer', series: 'electric-fryer', image: '', parameters: '单缸 9L / 6kW / 380V / 270×450×380mm', parametersEn: 'Single Tank 9L / 6kW / 380V / 270×450×380mm', functions: '精准温控、油温快速恢复、安全断电保护、可拆卸清洗' },
  { id: 'p008', model: 'EFA-401', name: '双缸电炸炉', nameEn: 'Double Tank Electric Fryer', series: 'electric-fryer', image: '', parameters: '双缸 2×9L / 2×6kW / 380V / 540×450×380mm', parametersEn: 'Double Tank 2x9L / 2x6kW / 380V / 540×450×380mm', functions: '独立双缸温控、油温快速恢复、安全断电保护、可拆卸清洗' },
  // 燃气炸炉系列
  { id: 'p009', model: 'GFA-201', name: '单缸燃气炸炉', nameEn: 'Single Tank Gas Fryer', series: 'gas-fryer', image: '', parameters: '单缸 9L / 18kW / NG/LPG / 270×450×380mm', parametersEn: 'Single Tank 9L / 18kW / NG/LPG / 270×450×380mm', functions: '大火力快速升温、电子点火、熄火保护、油温恒定' },
  { id: 'p010', model: 'GFA-401', name: '双缸燃气炸炉', nameEn: 'Double Tank Gas Fryer', series: 'gas-fryer', image: '', parameters: '双缸 2×9L / 2×18kW / NG/LPG / 540×450×380mm', parametersEn: 'Double Tank 2x9L / 2x18kW / NG/LPG / 540×450×380mm', functions: '大火力快速升温、独立双缸控温、电子点火、熄火保护' },
  // 扒炉系列
  { id: 'p011', model: 'GDA-600', name: '600mm平面扒炉', nameEn: '600mm Flat Griddle', series: 'griddle', image: '', parameters: '600×400mm / 5kW / 380V / 600×600×380mm', parametersEn: '600x400mm / 5kW / 380V / 600x600x380mm', functions: '均匀加热面板、独立温区、油脂收集槽、不锈钢台面' },
  { id: 'p012', model: 'GDA-900', name: '900mm平面扒炉', nameEn: '900mm Flat Griddle', series: 'griddle', image: '', parameters: '900×400mm / 7.5kW / 380V / 900×600×380mm', parametersEn: '900x400mm / 7.5kW / 380V / 900x600x380mm', functions: '均匀加热面板、独立温区、油脂收集槽、不锈钢台面' },
  // 煮面炉系列
  { id: 'p013', model: 'PCA-2B', name: '双缸煮面炉', nameEn: '2-Well Pasta Cooker', series: 'pasta-cooker', image: '', parameters: '双缸 2×6L / 2×3kW / 380V / 400×600×380mm', parametersEn: '2 Well 2x6L / 2x3kW / 380V / 400x600x380mm', functions: '快速沸腾、独立定时、水位自动控制、不锈钢内胆' },
  { id: 'p014', model: 'PCA-4B', name: '四缸煮面炉', nameEn: '4-Well Pasta Cooker', series: 'pasta-cooker', image: '', parameters: '四缸 4×6L / 4×3kW / 380V / 800×600×380mm', parametersEn: '4 Well 4x6L / 4x3kW / 380V / 800x600x380mm', functions: '快速沸腾、独立定时、水位自动控制、不锈钢内胆' },
  // 西式快餐系列
  { id: 'p015', model: 'WFA-301', name: '西式快餐工作台', nameEn: 'Western Fast Food Station', series: 'western-fastfood', image: '', parameters: '三格保温 / 1.5kW / 220V / 900×400×350mm', parametersEn: '3-Section Warming / 1.5kW / 220V / 900x400x350mm', functions: '多格独立保温、不锈钢台面、温度可调、易清洁' },
  { id: 'p016', model: 'WFA-501', name: '汉堡机', nameEn: 'Burger Grill Press', series: 'western-fastfood', image: '', parameters: '双面加热 / 2.2kW / 220V / 400×350×250mm', parametersEn: 'Double-Side Heating / 2.2kW / 220V / 400x350x250mm', functions: '上下同时加热、定时控制、不粘涂层、自动弹起' },
  // 咖啡机/茶咖机系列
  { id: 'p017', model: 'CMA-1G', name: '单头半自动咖啡机', nameEn: '1-Group Semi-Auto Coffee Machine', series: 'coffee-machine', image: '', parameters: '1组冲泡头 / 1.5kW / 220V / 300×400×450mm', parametersEn: '1 Group / 1.5kW / 220V / 300x400x450mm', functions: '意式萃取、蒸汽打奶泡、预浸泡、PID温控' },
  { id: 'p018', model: 'CMA-2G', name: '双头半自动咖啡机', nameEn: '2-Group Semi-Auto Coffee Machine', series: 'coffee-machine', image: '', parameters: '2组冲泡头 / 3kW / 220V / 700×500×500mm', parametersEn: '2 Group / 3kW / 220V / 700x500x500mm', functions: '意式萃取、蒸汽打奶泡、预浸泡、PID温控、双杯同时出' },
  // 烤箱系列
  { id: 'p019', model: 'OVA-3D', name: '三层六盘电烤箱', nameEn: '3-Deck 6-Tray Oven', series: 'oven', image: '', parameters: '3层6盘 / 21kW / 380V / 1240×850×1580mm', parametersEn: '3-Deck 6-Tray / 21kW / 380V / 1240x850x1580mm', functions: '独立层控温、热风循环、石板底火、蒸汽喷雾' },
  { id: 'p020', model: 'OVA-1D', name: '单层两盘电烤箱', nameEn: '1-Deck 2-Tray Oven', series: 'oven', image: '', parameters: '单层2盘 / 7kW / 380V / 1240×850×580mm', parametersEn: '1-Deck 2-Tray / 7kW / 380V / 1240x850x580mm', functions: '精准温控、热风循环、石板底火、蒸汽喷雾' },
  // 超市连锁便利速食系列
  { id: 'p021', model: 'SFA-H1', name: '便利店热风烤箱', nameEn: 'Convenience Store Convection Oven', series: 'supermarket', image: '', parameters: '4盘 1/2GN / 3.2kW / 220V / 450×550×580mm', parametersEn: '4x 1/2 GN / 3.2kW / 220V / 450x550x580mm', functions: '快速加热、多段编程、自动除霜烘烤、紧凑设计' },
  { id: 'p022', model: 'SFA-D1', name: '便利店展示热柜', nameEn: 'Display Warmer Cabinet', series: 'supermarket', image: '', parameters: '4层展示 / 1kW / 220V / 450×400×1300mm', parametersEn: '4-Layer Display / 1kW / 220V / 450x400x1300mm', functions: '恒温保温、玻璃展示、湿度控制、照明灯' },
  // 小吃系列
  { id: 'p023', model: 'SNA-C1', name: '章鱼丸子机', nameEn: 'Takoyaki Maker', series: 'snack', image: '', parameters: '24孔 / 2kW / 220V / 400×300×200mm', parametersEn: '24-Hole / 2kW / 220V / 400x300x200mm', functions: '半球形模具、均匀加热、不粘涂层、独立温控' },
  { id: 'p024', model: 'SNA-H1', name: '电热华夫饼机', nameEn: 'Electric Waffle Maker', series: 'snack', image: '', parameters: '双盘 / 1.5kW / 220V / 300×350×250mm', parametersEn: 'Double Plate / 1.5kW / 220V / 300x350x250mm', functions: '上下双面加热、定时蜂鸣、不粘涂层、可翻转' },
  // 电磁炉系列
  { id: 'p025', model: 'ICA-3500', name: '3500W台式电磁炉', nameEn: '3500W Tabletop Induction Cooker', series: 'induction', image: '', parameters: '3500W / 220V / 350×430×120mm', parametersEn: '3500W / 220V / 350x430x120mm', functions: '精准火力调节、定时功能、过热保护、防水面板' },
  { id: 'p026', model: 'ICA-5000', name: '5000W大功率电磁炉', nameEn: '5000W High-Power Induction Cooker', series: 'induction', image: '', parameters: '5000W / 380V / 400×500×130mm', parametersEn: '5000W / 380V / 400x500x130mm', functions: '大火力爆炒、10档火力调节、定时功能、过热保护' }
];
```

- [ ] **Step 3: Add data management functions (load, save, merge)**

```javascript
// Data management
function getProducts() {
  const custom = JSON.parse(localStorage.getItem('products') || 'null');
  if (custom) return custom;
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}

function resetProducts() {
  localStorage.removeItem('products');
}

function addProduct(product) {
  const products = getProducts();
  product.id = 'p' + Date.now();
  products.push(product);
  saveProducts(products);
  return product;
}

function updateProduct(id, data) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...data };
    saveProducts(products);
  }
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}
```

- [ ] **Step 4: Verify data layer works**

Open browser console on index.html, run `console.log(getProducts())` — should return 26 sample products.

---

## Task 3: Learning Center UI

**Files:**
- Modify: `product-learning-system/index.html` (learning center section + styles + JS)

- [ ] **Step 1: Add learning center CSS styles**

Add to `<style>`:

```css
  /* Filter bar */
  .filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .filter-btn { padding: 8px 16px; border: 1px solid #ddd; border-radius: 20px; background: #fff; cursor: pointer; font-size: 13px; transition: all .2s; }
  .filter-btn:hover { border-color: #1a73e8; color: #1a73e8; }
  .filter-btn.active { background: #1a73e8; color: #fff; border-color: #1a73e8; }

  /* Product grid */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
  .product-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); transition: transform .2s, box-shadow .2s; }
  .product-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.12); }
  .product-card .card-img { width: 100%; height: 220px; object-fit: contain; background: #f8f9fa; padding: 16px; }
  .product-card .card-body { padding: 16px; }
  .product-card .card-model { font-size: 16px; font-weight: 700; color: #1a2332; margin-bottom: 4px; }
  .product-card .card-name { font-size: 13px; color: #666; margin-bottom: 12px; }
  .product-card .card-params { font-size: 12px; color: #555; line-height: 1.8; border-top: 1px solid #f0f0f0; padding-top: 12px; }
  .product-card .card-params .label { color: #999; font-size: 11px; }
  .product-card .card-func { font-size: 12px; color: #1a73e8; margin-top: 10px; line-height: 1.6; }
  .no-image { width: 100%; height: 220px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 14px; }
```

- [ ] **Step 2: Build learning center HTML structure**

Replace the learning center page content:

```html
<div id="page-learn" class="page active">
  <div class="filter-bar" id="filterBar"></div>
  <div class="product-grid" id="productGrid"></div>
</div>
```

- [ ] **Step 3: Add learning center render logic**

```javascript
let currentFilter = 'all';

function renderFilterBar() {
  const bar = document.getElementById('filterBar');
  let html = '<button class="filter-btn active" onclick="filterBySeries(\'all\', this)">全部</button>';
  SERIES.forEach(s => {
    html += `<button class="filter-btn" onclick="filterBySeries('${s.id}', this)">${s.label.split(' ')[0]}</button>`;
  });
  bar.innerHTML = html;
}

function filterBySeries(seriesId, btn) {
  currentFilter = seriesId;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProductGrid();
}

function renderProductGrid() {
  const grid = document.getElementById('productGrid');
  const products = getProducts().filter(p => currentFilter === 'all' || p.series === currentFilter);
  if (products.length === 0) {
    grid.innerHTML = '<div style="text-align:center;color:#999;padding:60px;">暂无产品数据</div>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      ${p.image ? `<img class="card-img" src="${p.image}" alt="${p.model}">` : '<div class="no-image">暂无图片</div>'}
      <div class="card-body">
        <div class="card-model">${p.model}</div>
        <div class="card-name">${p.nameEn || p.name}</div>
        <div class="card-params">
          <div class="label">Product Parameters / 产品参数</div>
          <div>${p.parameters}</div>
          ${p.parametersEn ? `<div style="color:#999;margin-top:4px;">${p.parametersEn}</div>` : ''}
        </div>
        ${p.functions ? `<div class="card-func"> ${p.functions}</div>` : ''}
      </div>
    </div>
  `).join('');
}
```

- [ ] **Step 4: Initialize learning center on page load**

Add to the script, after the functions:

```javascript
renderFilterBar();
renderProductGrid();
```

- [ ] **Step 5: Verify learning center**

Open index.html. All 26 products should appear in a grid. Click "电炸炉" filter — only the 2 electric fryer products should show. Click "全部" to reset.

---

## Task 4: Practice Mode (刷题练习)

**Files:**
- Modify: `product-learning-system/index.html` (practice section + styles + JS)

- [ ] **Step 1: Add practice mode CSS styles**

```css
  /* Practice mode */
  .practice-setup { text-align: center; padding: 40px; }
  .practice-setup select { padding: 10px 20px; font-size: 15px; border: 1px solid #ddd; border-radius: 8px; margin-right: 12px; }
  .practice-setup .start-btn { padding: 10px 30px; font-size: 15px; background: #1a73e8; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .practice-setup .start-btn:hover { background: #1557b0; }
  .question-area { display: flex; gap: 30px; align-items: flex-start; padding: 20px 0; }
  .question-left { flex: 1; text-align: center; }
  .question-left img { max-width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; background: #f8f9fa; padding: 16px; }
  .question-left .model-display { font-size: 28px; font-weight: 700; color: #1a2332; padding: 40px; background: #f8f9fa; border-radius: 12px; }
  .question-right { flex: 1; }
  .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .option-item { padding: 16px; border: 2px solid #e0e0e0; border-radius: 10px; cursor: pointer; text-align: center; transition: all .2s; }
  .option-item:hover { border-color: #1a73e8; background: #f0f7ff; }
  .option-item img { max-width: 100%; max-height: 120px; object-fit: contain; margin-bottom: 8px; }
  .option-item .opt-text { font-size: 15px; font-weight: 600; }
  .option-item.correct { border-color: #4caf50; background: #e8f5e9; }
  .option-item.wrong { border-color: #f44336; background: #ffebee; }
  .practice-controls { text-align: center; margin-top: 24px; }
  .practice-controls .next-btn { padding: 12px 40px; font-size: 15px; background: #1a73e8; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .practice-score { font-size: 14px; color: #666; margin-bottom: 16px; }
```

- [ ] **Step 2: Build practice page HTML**

```html
<div id="page-practice" class="page">
  <h2 class="page-title">刷题练习</h2>
  <div id="practiceContent"></div>
</div>
```

- [ ] **Step 3: Implement practice logic**

```javascript
let practiceState = { series: 'all', questions: [], current: 0, correct: 0, total: 0 };

function renderPracticeSetup() {
  const el = document.getElementById('practiceContent');
  let options = '<option value="all">全部系列</option>';
  SERIES.forEach(s => { options += `<option value="${s.id}">${s.label}</option>`; });
  el.innerHTML = `
    <div class="practice-setup">
      <p style="margin-bottom:20px;color:#666;">选择要练习的产品系列，然后开始刷题</p>
      <select id="practiceSeries">${options}</select>
      <button class="start-btn" onclick="startPractice()">开始练习</button>
    </div>`;
}

function startPractice() {
  const series = document.getElementById('practiceSeries').value;
  const products = getProducts().filter(p => series === 'all' || p.series === series);
  if (products.length < 2) {
    alert('该系列下产品不足2个，无法出题');
    return;
  }
  practiceState = {
    series,
    questions: generateQuestions(products),
    current: 0,
    correct: 0,
    total: 0
  };
  showPracticeQuestion();
}

function generateQuestions(products) {
  const questions = [];
  products.forEach(p => {
    // Type 1: show image, pick model
    questions.push({ type: 'img-to-model', product: p, options: pickDistractors(p, products, 'model') });
    // Type 2: show model, pick image
    questions.push({ type: 'model-to-img', product: p, options: pickDistractors(p, products, 'image') });
  });
  return shuffleArray(questions);
}

function pickDistractors(correct, pool, field) {
  const others = pool.filter(p => p.id !== correct.id);
  const distractors = shuffleArray(others).slice(0, 3).map(p => ({ id: p.id, value: p[field], model: p.model, image: p.image }));
  const answer = { id: correct.id, value: correct[field], model: correct.model, image: correct.image };
  return shuffleArray([answer, ...distractors]);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function showPracticeQuestion() {
  const el = document.getElementById('practiceContent');
  const q = practiceState.questions[practiceState.current];
  if (!q) { showPracticeResult(); return; }
  const answered = false;

  let leftContent, rightContent;
  if (q.type === 'img-to-model') {
    leftContent = q.product.image
      ? `<img src="${q.product.image}" alt="${q.product.model}">`
      : `<div class="no-image" style="height:300px;">${q.product.model}</div>`;
    rightContent = `<div class="option-grid">${q.options.map((o, i) =>
      `<div class="option-item" onclick="checkPracticeAnswer(${i}, '${o.id}')"><div class="opt-text">${o.model}</div></div>`
    ).join('')}</div>`;
  } else {
    leftContent = `<div class="model-display">${q.product.model}</div>`;
    rightContent = `<div class="option-grid">${q.options.map((o, i) =>
      `<div class="option-item" onclick="checkPracticeAnswer(${i}, '${o.id}')">
        ${o.image ? `<img src="${o.image}" alt="option">` : '<div class="no-image" style="height:100px;">无图</div>'}
        <div class="opt-text">${o.model}</div>
      </div>`
    ).join('')}</div>`;
  }

  el.innerHTML = `
    <div class="practice-score">第 ${practiceState.current + 1} / ${practiceState.questions.length} 题 &nbsp;|&nbsp; 正确: ${practiceState.correct} / ${practiceState.total}</div>
    <div class="question-area">
      <div class="question-left">${leftContent}</div>
      <div class="question-right">${rightContent}</div>
    </div>
    <div class="practice-controls" id="practiceControls"></div>`;
}

function checkPracticeAnswer(optIdx, selectedId) {
  const q = practiceState.questions[practiceState.current];
  const correct = selectedId === q.product.id;
  practiceState.total++;

  // Highlight options
  document.querySelectorAll('.option-item').forEach((el, i) => {
    el.style.pointerEvents = 'none';
    if (q.options[i].id === q.product.id) el.classList.add('correct');
    else if (i === optIdx && !correct) el.classList.add('wrong');
  });

  if (correct) {
    practiceState.correct++;
  } else {
    addWrongAnswer(q);
  }

  document.getElementById('practiceControls').innerHTML =
    '<button class="next-btn" onclick="nextPracticeQuestion()">下一题</button>';
}

function nextPracticeQuestion() {
  practiceState.current++;
  showPracticeQuestion();
}

function showPracticeResult() {
  const el = document.getElementById('practiceContent');
  const rate = practiceState.total > 0 ? Math.round(practiceState.correct / practiceState.total * 100) : 0;
  el.innerHTML = `
    <div class="practice-setup">
      <h3>练习结束！</h3>
      <p style="font-size:18px;margin:20px 0;">正确率: ${rate}% (${practiceState.correct} / ${practiceState.total})</p>
      <button class="start-btn" onclick="renderPracticeSetup()">返回选择</button>
    </div>`;
}
```

- [ ] **Step 4: Initialize practice page**

```javascript
renderPracticeSetup();
```

- [ ] **Step 5: Verify practice mode**

Select a series with products, start practice. Verify: questions alternate between "看图选型号" and "看型号选图片". Wrong answers highlight red, correct answers highlight green. Score tracks correctly.

---

## Task 5: Mock Exam Mode (模拟考试)

**Files:**
- Modify: `product-learning-system/index.html` (exam section + styles + JS)

- [ ] **Step 1: Add exam mode CSS styles**

```css
  /* Exam mode */
  .exam-setup { text-align: center; padding: 40px; }
  .exam-setup .start-btn { padding: 12px 40px; font-size: 16px; background: #e65100; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .exam-setup .start-btn:hover { background: #bf360c; }
  .exam-progress { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .exam-progress .progress-text { font-size: 14px; color: #666; }
  .exam-progress .timer { font-size: 18px; font-weight: 700; color: #e65100; }
  .exam-nav { display: flex; justify-content: flex-end; margin-top: 24px; }
  .exam-nav .submit-btn { padding: 12px 40px; font-size: 15px; background: #e65100; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .exam-nav .submit-btn:hover { background: #bf360c; }
  .exam-result { text-align: center; padding: 40px; }
  .exam-result .score-big { font-size: 64px; font-weight: 800; color: #e65100; }
  .exam-result .score-label { font-size: 16px; color: #666; margin-bottom: 24px; }
  .exam-review { margin-top: 30px; text-align: left; }
  .exam-review .review-item { padding: 16px; border-bottom: 1px solid #f0f0f0; }
  .exam-review .review-item.correct { border-left: 4px solid #4caf50; }
  .exam-review .review-item.wrong { border-left: 4px solid #f44336; }
```

- [ ] **Step 2: Build exam page HTML**

```html
<div id="page-exam" class="page">
  <h2 class="page-title">模拟考试</h2>
  <div id="examContent"></div>
</div>
```

- [ ] **Step 3: Implement exam logic**

```javascript
let examState = { questions: [], current: 0, answers: [], startTime: null, finished: false };

function renderExamSetup() {
  const el = document.getElementById('examContent');
  const productCount = getProducts().length;
  const questionCount = Math.min(100, productCount * 2);
  el.innerHTML = `
    <div class="exam-setup">
      <p style="margin-bottom:12px;color:#666;">模拟考试将从所有产品中随机抽取题目</p>
      <p style="margin-bottom:20px;color:#999;">共 ${questionCount} 题，每题 1 分，满分 ${questionCount} 分</p>
      <button class="start-btn" onclick="startExam()">开始考试</button>
    </div>`;
}

function startExam() {
  const products = getProducts();
  if (products.length < 2) {
    alert('产品不足，无法开始考试');
    return;
  }
  const allQuestions = generateQuestions(products);
  examState = {
    questions: shuffleArray(allQuestions).slice(0, 100),
    current: 0,
    answers: [],
    startTime: Date.now(),
    finished: false
  };
  showExamQuestion();
}

function showExamQuestion() {
  const el = document.getElementById('examContent');
  const q = examState.questions[examState.current];
  if (!q) { finishExam(); return; }

  let leftContent, rightContent;
  if (q.type === 'img-to-model') {
    leftContent = q.product.image
      ? `<img src="${q.product.image}" alt="${q.product.model}">`
      : `<div class="no-image" style="height:300px;">${q.product.model}</div>`;
    rightContent = `<div class="option-grid">${q.options.map((o, i) =>
      `<div class="option-item" onclick="selectExamAnswer(${i}, '${o.id}')"><div class="opt-text">${o.model}</div></div>`
    ).join('')}</div>`;
  } else {
    leftContent = `<div class="model-display">${q.product.model}</div>`;
    rightContent = `<div class="option-grid">${q.options.map((o, i) =>
      `<div class="option-item" onclick="selectExamAnswer(${i}, '${o.id}')">
        ${o.image ? `<img src="${o.image}" alt="option">` : '<div class="no-image" style="height:100px;">无图</div>'}
        <div class="opt-text">${o.model}</div>
      </div>`
    ).join('')}</div>`;
  }

  el.innerHTML = `
    <div class="exam-progress">
      <span class="progress-text">第 ${examState.current + 1} / ${examState.questions.length} 题</span>
    </div>
    <div class="question-area">
      <div class="question-left">${leftContent}</div>
      <div class="question-right">${rightContent}</div>
    </div>`;
}

function selectExamAnswer(optIdx, selectedId) {
  const q = examState.questions[examState.current];
  const correct = selectedId === q.product.id;
  examState.answers.push({ questionIndex: examState.current, selectedId, correct });

  if (!correct) addWrongAnswer(q);

  // Move to next question after brief delay
  setTimeout(() => {
    examState.current++;
    showExamQuestion();
  }, 300);
}

function finishExam() {
  examState.finished = true;
  const correctCount = examState.answers.filter(a => a.correct).length;
  const total = examState.questions.length;
  const elapsed = Math.round((Date.now() - examState.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  let reviewHtml = examState.answers.map((a, i) => {
    const q = examState.questions[a.questionIndex];
    return `<div class="review-item ${a.correct ? 'correct' : 'wrong'}">
      <strong>第${i + 1}题</strong> &nbsp; ${q.type === 'img-to-model' ? '看图选型号' : '看型号选图片'} &nbsp;
      正确答案: <strong>${q.product.model}</strong>
      ${a.correct ? '<span style="color:#4caf50;"> ✓</span>' : '<span style="color:#f44336;"> ✗</span>'}
    </div>`;
  }).join('');

  document.getElementById('examContent').innerHTML = `
    <div class="exam-result">
      <div class="score-big">${correctCount}</div>
      <div class="score-label">满分 ${total} 分 &nbsp;|&nbsp; 用时 ${mins}分${secs}秒</div>
      <button class="start-btn" onclick="renderExamSetup()" style="background:#1a73e8;">返回</button>
    </div>
    <div class="exam-review"><h3>答题详情</h3>${reviewHtml}</div>`;
}
```

- [ ] **Step 4: Initialize exam page**

```javascript
renderExamSetup();
```

- [ ] **Step 5: Verify exam mode**

Start exam, answer all questions. Verify: can't go back, score shows at end, review shows correct/wrong for each question.

---

## Task 6: Wrong Answer Collection (错题集)

**Files:**
- Modify: `product-learning-system/index.html` (wrong answer section + JS)

- [ ] **Step 1: Add wrong answer management functions**

```javascript
function getWrongAnswers() {
  return JSON.parse(localStorage.getItem('wrongAnswers') || '[]');
}

function addWrongAnswer(question) {
  const wrong = getWrongAnswers();
  const existing = wrong.find(w => w.productId === question.product.id && w.type === question.type);
  if (existing) {
    existing.count++;
  } else {
    wrong.push({
      productId: question.product.id,
      type: question.type,
      product: question.product,
      count: 1
    });
  }
  localStorage.setItem('wrongAnswers', JSON.stringify(wrong));
}

function clearWrongAnswers() {
  localStorage.removeItem('wrongAnswers');
  renderWrongPage();
}

function removeWrongAnswer(productId, type) {
  const wrong = getWrongAnswers().filter(w => !(w.productId === productId && w.type === type));
  localStorage.setItem('wrongAnswers', JSON.stringify(wrong));
  renderWrongPage();
}
```

- [ ] **Step 2: Build wrong answer page**

```html
<div id="page-wrong" class="page">
  <h2 class="page-title">错题集</h2>
  <div id="wrongContent"></div>
</div>
```

- [ ] **Step 3: Implement wrong answer rendering**

```javascript
function renderWrongPage() {
  const el = document.getElementById('wrongContent');
  const wrong = getWrongAnswers();
  if (wrong.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:#999;padding:60px;">暂无错题，继续加油！</div>';
    return;
  }

  let html = `
    <div style="margin-bottom:20px;">
      <button onclick="practiceWrongAnswers()" style="padding:10px 24px;background:#1a73e8;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-right:12px;">重新练习错题</button>
      <button onclick="if(confirm('确定清空所有错题？'))clearWrongAnswers()" style="padding:10px 24px;background:#fff;color:#f44336;border:1px solid #f44336;border-radius:8px;cursor:pointer;">清空错题集</button>
    </div>`;

  html += '<div class="product-grid">';
  wrong.forEach(w => {
    html += `
      <div class="product-card">
        ${w.product.image ? `<img class="card-img" src="${w.product.image}" alt="${w.product.model}">` : '<div class="no-image">暂无图片</div>'}
        <div class="card-body">
          <div class="card-model">${w.product.model}</div>
          <div class="card-name">${w.type === 'img-to-model' ? '看图选型号' : '看型号选图片'}</div>
          <div style="color:#f44336;font-size:13px;">错误次数: ${w.count}</div>
          <button onclick="removeWrongAnswer('${w.productId}','${w.type}')" style="margin-top:8px;padding:4px 12px;background:none;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:12px;">移除</button>
        </div>
      </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

function practiceWrongAnswers() {
  const wrong = getWrongAnswers();
  if (wrong.length < 2) { alert('错题不足2道，无法练习'); return; }
  practiceState = {
    series: 'wrong',
    questions: wrong.map(w => ({
      type: w.type,
      product: w.product,
      options: pickDistractors(w.product, getProducts(), w.type === 'img-to-model' ? 'model' : 'image')
    })),
    current: 0,
    correct: 0,
    total: 0
  };
  showPage('practice');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.nav-links a')[1].classList.add('active');
  showPracticeQuestion();
}
```

- [ ] **Step 4: Initialize wrong answer page**

```javascript
renderWrongPage();
```

- [ ] **Step 5: Verify wrong answers**

Do some practice, deliberately answer wrong. Switch to 错题集 tab — wrong answers should appear. Click "重新练习错题" — should start practice with only wrong questions.

---

## Task 7: Admin Panel (后台管理)

**Files:**
- Modify: `product-learning-system/index.html` (admin section + styles + JS)

- [ ] **Step 1: Add admin panel CSS styles**

```css
  /* Admin panel */
  .admin-login { text-align: center; padding: 60px; }
  .admin-login input { padding: 12px 20px; font-size: 16px; border: 1px solid #ddd; border-radius: 8px; width: 200px; margin-right: 12px; }
  .admin-login button { padding: 12px 30px; font-size: 15px; background: #1a2332; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
  .admin-table th { background: #1a2332; color: #fff; padding: 12px; text-align: left; font-size: 13px; }
  .admin-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 13px; vertical-align: middle; }
  .admin-table tr:hover { background: #f8f9fa; }
  .admin-table .actions button { padding: 4px 12px; margin-right: 4px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
  .admin-table .btn-edit { background: #e3f2fd; color: #1a73e8; }
  .admin-table .btn-delete { background: #ffebee; color: #f44336; }
  .admin-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .admin-toolbar .add-btn { padding: 10px 24px; background: #4caf50; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.5); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: #fff; border-radius: 12px; padding: 30px; width: 600px; max-height: 80vh; overflow-y: auto; }
  .modal h3 { margin-bottom: 20px; }
  .modal label { display: block; font-size: 13px; color: #666; margin-bottom: 4px; margin-top: 12px; }
  .modal input, .modal select, .modal textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
  .modal textarea { height: 80px; resize: vertical; }
  .modal .modal-actions { margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end; }
  .modal .modal-actions button { padding: 10px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
  .modal .btn-save { background: #4caf50; color: #fff; }
  .modal .btn-cancel { background: #f5f5f5; color: #666; }
  .ai-generate-btn { padding: 6px 16px; background: #ff9800; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 4px; }
```

- [ ] **Step 2: Build admin HTML structure**

```html
<div id="page-admin" class="page">
  <h2 class="page-title">后台管理</h2>
  <div id="adminContent"></div>
</div>

<!-- Modal for add/edit -->
<div id="modal" class="modal-overlay" style="display:none;">
  <div class="modal" id="modalContent"></div>
</div>
```

- [ ] **Step 3: Implement admin login**

```javascript
let adminLoggedIn = false;

function showAdminLogin() {
  if (adminLoggedIn) {
    showPage('admin');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    renderAdminPanel();
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-admin').classList.add('active');
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-login">
      <h3 style="margin-bottom:20px;">请输入管理密码</h3>
      <input type="password" id="adminPwd" placeholder="密码" onkeydown="if(event.key==='Enter')doAdminLogin()">
      <button onclick="doAdminLogin()">进入后台</button>
    </div>`;
}

function doAdminLogin() {
  const pwd = document.getElementById('adminPwd').value;
  if (pwd === '123456') {
    adminLoggedIn = true;
    renderAdminPanel();
  } else {
    alert('密码错误');
  }
}
```

- [ ] **Step 4: Implement admin product table**

```javascript
function renderAdminPanel() {
  const el = document.getElementById('adminContent');
  const products = getProducts();

  let rows = products.map(p => `
    <tr>
      <td>${p.image ? '<img src="' + p.image + '" style="width:50px;height:50px;object-fit:contain;">' : '-'}</td>
      <td><strong>${p.model}</strong></td>
      <td>${p.name}</td>
      <td>${SERIES.find(s => s.id === p.series)?.label.split(' ')[0] || p.series}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.parameters || '-'}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.functions || '-'}</td>
      <td class="actions">
        <button class="btn-edit" onclick="editProduct('${p.id}')">编辑</button>
        <button class="btn-delete" onclick="if(confirm('确定删除？')){deleteProduct('${p.id}');renderAdminPanel();}">删除</button>
      </td>
    </tr>`).join('');

  el.innerHTML = `
    <div class="admin-toolbar">
      <span style="color:#666;">共 ${products.length} 个产品</span>
      <div>
        <button class="add-btn" onclick="showAddProduct()" style="margin-right:8px;">+ 添加产品</button>
        <button onclick="if(confirm('重置为默认数据？')){resetProducts();renderAdminPanel();}" style="padding:10px 16px;background:#fff;border:1px solid #ddd;border-radius:8px;cursor:pointer;">重置数据</button>
      </div>
    </div>
    <table class="admin-table">
      <tr><th>图片</th><th>型号</th><th>名称</th><th>系列</th><th>参数</th><th>功能</th><th>操作</th></tr>
      ${rows}
    </table>`;
}
```

- [ ] **Step 5: Implement add/edit product modal**

```javascript
function showAddProduct() {
  showProductModal(null);
}

function editProduct(id) {
  const product = getProducts().find(p => p.id === id);
  showProductModal(product);
}

function showProductModal(product) {
  const isEdit = !!product;
  const seriesOptions = SERIES.map(s =>
    `<option value="${s.id}" ${product?.series === s.id ? 'selected' : ''}>${s.label}</option>`
  ).join('');

  document.getElementById('modalContent').innerHTML = `
    <h3>${isEdit ? '编辑产品' : '添加产品'}</h3>
    <label>型号 Model *</label>
    <input type="text" id="m_model" value="${product?.model || ''}" placeholder="如 EOA-101-CMP">
    <label>产品名称 *</label>
    <input type="text" id="m_name" value="${product?.name || ''}" placeholder="如 10盘万能蒸烤箱">
    <label>英文名称</label>
    <input type="text" id="m_nameEn" value="${product?.nameEn || ''}" placeholder="如 10-Pan Combi Oven">
    <label>所属系列 *</label>
    <select id="m_series">${seriesOptions}</select>
    <label>产品图片</label>
    <input type="text" id="m_image" value="${product?.image || ''}" placeholder="图片URL 或 base64数据">
    <input type="file" id="m_imageFile" accept="image/*" onchange="handleImageUpload(this)" style="margin-top:8px;font-size:12px;">
    <label>产品参数 / Product Parameters</label>
    <textarea id="m_params" placeholder="如 10×1/1GN / 18kW / 380V">${product?.parameters || ''}</textarea>
    <label>英文参数 / Parameters (EN)</label>
    <textarea id="m_paramsEn" placeholder="如 10x 1/1 GN / 18kW / 380V">${product?.parametersEn || ''}</textarea>
    <label>功能描述 / Functions & Applications</label>
    <textarea id="m_functions" placeholder="如 热风烘烤、蒸煮、组合烹饪">${product?.functions || ''}</textarea>
    <button class="ai-generate-btn" onclick="aiGenerateFunctions()">AI 提炼功能</button>
    <div class="modal-actions">
      <button class="btn-cancel" onclick="closeModal()">取消</button>
      <button class="btn-save" onclick="saveProduct('${product?.id || ''}')">保存</button>
    </div>`;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('m_image').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

function saveProduct(id) {
  const model = document.getElementById('m_model').value.trim();
  const name = document.getElementById('m_name').value.trim();
  const series = document.getElementById('m_series').value;
  if (!model || !name) { alert('型号和名称不能为空'); return; }

  const data = {
    model,
    name,
    nameEn: document.getElementById('m_nameEn').value.trim(),
    series,
    image: document.getElementById('m_image').value.trim(),
    parameters: document.getElementById('m_params').value.trim(),
    parametersEn: document.getElementById('m_paramsEn').value.trim(),
    functions: document.getElementById('m_functions').value.trim()
  };

  if (id) {
    updateProduct(id, data);
  } else {
    addProduct(data);
  }
  closeModal();
  renderAdminPanel();
}
```

- [ ] **Step 6: Implement AI function generator**

```javascript
function aiGenerateFunctions() {
  const model = document.getElementById('m_model').value.trim();
  const series = document.getElementById('m_series').value;
  const params = document.getElementById('m_params').value.trim();

  const functionMap = {
    'combi-steamer': '热风烘烤、蒸煮、组合烹饪、低温慢煮、解冻、自动清洗程序、多段编程烹饪',
    'combination-oven': '对流烘烤、蒸汽烹饪、组合模式、发酵、解冻、余热利用',
    'chicken-rotisserie': '360°旋转均匀烘烤、独立温控、透明玻璃展示、自动计时、照明系统',
    'electric-fryer': '精准温控（50-190°C）、油温快速恢复、超温安全断电、可拆卸清洗、油位指示',
    'gas-fryer': '大火力快速升温、电子脉冲点火、熄火安全保护、油温恒定控制、铸铁炉头',
    'griddle': '大面积均匀加热、独立温区控制、前置油脂收集槽、不锈钢一体台面、温控指示灯',
    'pasta-cooker': '快速沸腾加热、独立定时器、水位自动控制、不锈钢内胆、溢出保护',
    'western-fastfood': '多工位集成设计、高效出餐、不锈钢台面、易清洁维护、空间紧凑',
    'coffee-machine': '意式高压萃取（15bar）、蒸汽打奶泡、PID精准温控、预浸泡功能、双杯同时出品',
    'oven': '多层独立控温、热风循环系统、石板底火加热、蒸汽喷雾、大容量烘烤',
    'supermarket': '快速加热复热、多段编程、除霜烘烤一体、恒温展示保温、紧凑设计适合便利店',
    'snack': '均匀加热成型、不粘涂层易脱模、独立温控、定时功能、商用级耐久',
    'induction': '大功率快速加热、多档火力精准调节、定时功能、过热自动保护、防水易清洁面板'
  };

  let func = functionMap[series] || '高效节能、安全可靠、操作简便、不锈钢材质';

  // Enhance based on parameters
  if (params.includes('380V')) func += '、三相电工业级';
  if (params.includes('220V')) func += '、单相电通用';
  if (params.includes('GN') || params.includes('盘')) func += '、标准GN烤盘兼容';
  if (params.includes('NG') || params.includes('LPG')) func += '、天然气/液化气双兼容';

  document.getElementById('m_functions').value = func;
}
```

- [ ] **Step 7: Verify admin panel**

Click "管理" → enter wrong password → see error. Enter 123456 → see product table. Add a new product → verify it appears in learning center. Edit a product → verify changes persist. Delete a product → verify it's removed.

---

## Task 8: update-data.js Helper Script

**Files:**
- Create: `product-learning-system/update-data.js`
- Create: `product-learning-system/data/images-data.js` (generated output)

- [ ] **Step 1: Create the Node.js helper script**

Create `C:/Users/Mario/product-learning-system/update-data.js`:

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const OUTPUT_FILE = path.join(__dirname, 'data', 'images-data.js');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

function scanImages() {
  const result = {};
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('images/ directory not found. Creating...');
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    return result;
  }

  const seriesDirs = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of seriesDirs) {
    const seriesPath = path.join(IMAGES_DIR, dir.name);
    const files = fs.readdirSync(seriesPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!imageExtensions.includes(ext)) continue;

      const filePath = path.join(seriesPath, file);
      const data = fs.readFileSync(filePath);
      const base64 = data.toString('base64');
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
                 : ext === '.png' ? 'image/png'
                 : ext === '.gif' ? 'image/gif'
                 : ext === '.webp' ? 'image/webp'
                 : 'image/bmp';

      // Key: model name from filename (without extension)
      const model = path.basename(file, ext);
      result[model] = `data:${mime};base64,${base64}`;

      console.log(`  ✓ ${dir.name}/${file} (${(data.length / 1024).toFixed(1)}KB)`);
    }
  }
  return result;
}

console.log('Scanning images/ folder...');
const images = scanImages();
const count = Object.keys(images).length;
console.log(`\nFound ${count} images.`);

if (count === 0) {
  console.log('\nNo images found. Place images in images/<series>/ folders.');
  console.log('Example: images/combi-steamer/EOA-101-CMP.jpg');
  process.exit(0);
}

// Write output
const output = `// Auto-generated by update-data.js
// ${new Date().toISOString()}
// Contains ${count} images
const IMAGE_DATA = ${JSON.stringify(images, null, 2)};
`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
console.log(`\nWrote ${OUTPUT_FILE} (${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)}KB)`);
console.log('\nTo use: add <script src="data/images-data.js"></script> before index.html\'s closing </head> tag.');
console.log('Then images will be auto-matched to products by model name.');
```

- [ ] **Step 2: Add image data auto-merge to index.html**

Add to the `<head>` section of `index.html`:

```html
<script src="data/images-data.js" onerror=""></script>
```

Update the `getProducts()` function:

```javascript
function getProducts() {
  const custom = JSON.parse(localStorage.getItem('products') || 'null');
  const products = custom || JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));

  // Merge batch-imported images
  if (typeof IMAGE_DATA !== 'undefined') {
    products.forEach(p => {
      if (!p.image && IMAGE_DATA[p.model]) {
        p.image = IMAGE_DATA[p.model];
      }
    });
  }
  return products;
}
```

- [ ] **Step 3: Test the helper script**

```bash
cd C:/Users/Mario/product-learning-system
# Place a test image: images/combi-steamer/EOA-101-CMP.jpg
node update-data.js
```

Expected output: `Found 1 images.` and `Wrote data/images-data.js`

---

## Task 9: Polish & Cross-Page Integration

**Files:**
- Modify: `product-learning-system/index.html`

- [ ] **Step 1: Add global responsive styles**

```css
  @media (max-width: 768px) {
    .navbar { padding: 0 12px; }
    .navbar .nav-links a { padding: 12px 10px; font-size: 12px; }
    .product-grid { grid-template-columns: 1fr; }
    .question-area { flex-direction: column; }
    .option-grid { grid-template-columns: 1fr; }
    .modal { width: 95%; margin: 0 10px; }
  }
```

- [ ] **Step 2: Add empty state for exam when products < 2**

Update `renderExamSetup()` to check product count:

```javascript
function renderExamSetup() {
  const el = document.getElementById('examContent');
  const products = getProducts();
  if (products.length < 2) {
    el.innerHTML = '<div style="text-align:center;color:#999;padding:60px;">产品不足2个，无法进行考试。请先在后台添加产品。</div>';
    return;
  }
  const questionCount = Math.min(100, products.length * 2);
  el.innerHTML = `
    <div class="exam-setup">
      <p style="margin-bottom:12px;color:#666;">模拟考试将从所有产品中随机抽取题目</p>
      <p style="margin-bottom:20px;color:#999;">共 ${questionCount} 题，每题 1 分，满分 ${questionCount} 分</p>
      <button class="start-btn" onclick="startExam()">开始考试</button>
    </div>`;
}
```

- [ ] **Step 3: Close modal on outside click**

```javascript
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
```

- [ ] **Step 4: Verify all pages work together**

Full flow test:
1. Open index.html → see 26 sample products in learning center
2. Filter by "电炸炉" → see 2 products
3. Go to 刷题练习 → select "全部" → practice 4 questions
4. Deliberately answer some wrong
5. Go to 错题集 → see wrong answers
6. Go to 模拟考试 → start exam → finish → see score
7. Go to 后台管理 → enter 123456 → see product table
8. Add a new product → go to 学习中心 → verify it appears
9. Refresh page → verify all data persists (localStorage)

---

## Summary

| Task | Description | Dependencies |
|------|-------------|-------------|
| 1 | Project scaffolding & navigation shell | None |
| 2 | Product data layer & embedded defaults | Task 1 |
| 3 | Learning Center UI | Task 2 |
| 4 | Practice Mode | Task 2 |
| 5 | Mock Exam Mode | Task 4 |
| 6 | Wrong Answer Collection | Task 4 |
| 7 | Admin Panel | Task 2 |
| 8 | update-data.js helper script | Task 7 |
| 9 | Polish & integration | All tasks |
