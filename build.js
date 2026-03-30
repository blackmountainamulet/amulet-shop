const fs = require("fs");
const path = require("path");

const DETAIL_URL =
  "https://script.google.com/macros/s/AKfycbz9AWk4aUrtfEiddayYkggV1fQfICLiCP-i4sD7aR5l817IQGLZ1NwgyCemkfHdpZdOTA/exec?mode=detail";

const SITE_NAME = "黑山泰國佛牌";
const SITE_URL = "https://blackmountainamulet.com";
const IMAGE_CDN_HOST = "https://img.blackmountainamulet.com";

async function main() {
  const distDir = path.join(__dirname, "dist");
  const productsDir = path.join(distDir, "products");

  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(productsDir, { recursive: true });

  const cssSource = path.join(__dirname, "style.css");
  const cssTarget = path.join(distDir, "style.css");
  fs.copyFileSync(cssSource, cssTarget);

  const products = await fetchProducts();

  fs.writeFileSync(
    path.join(distDir, "index.html"),
    renderIndexPage(products),
    "utf8"
  );

  for (const product of products) {
    const filePath = path.join(productsDir, `${product.id}.html`);
    fs.writeFileSync(filePath, renderProductPage(product), "utf8");
  }

  fs.writeFileSync(
    path.join(distDir, "404.html"),
    render404Page(),
    "utf8"
  );

  console.log(`Built ${products.length} product pages`);
}

async function fetchProducts() {
  const response = await fetch(DETAIL_URL, {
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch failed: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON payload");
  }

  return data
    .filter(item => item && item.id && item.name)
    .sort((a, b) => (Number(a.sort) || 999999) - (Number(b.sort) || 999999))
    .map(item => ({
      sort: Number(item.sort) || 999999,
      id: String(item.id).trim(),
      name: String(item.name || "").trim(),
      desc: String(item.desc || "").trim(),
      images: Array.isArray(item.images) ? item.images.filter(Boolean) : []
    }));
}

function renderIndexPage(products) {
  const cards = products.map(product => {
    const cover = product.images[0]
      ? buildThumb(product.images[0], 360, 72)
      : "";

    return `
      <a class="product-card" href="/products/${encodeURIComponent(product.id)}.html">
        <div class="product-image-wrap">
          ${
            cover
              ? `<img src="${escapeAttr(cover)}" alt="${escapeAttr(product.name)}" loading="lazy">`
              : `<div class="no-image">暫無圖片</div>`
          }
        </div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-id">編號：${escapeHtml(product.id)}</div>
        </div>
      </a>
    `;
  }).join("");

  return `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${SITE_NAME}</title>
  <link rel="stylesheet" href="/style.css">
  <meta name="description" content="黑山泰國佛牌商品列表">
  <link rel="canonical" href="${SITE_URL}/">
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <h1>${SITE_NAME}</h1>
    </div>
  </header>

  <main class="container">
    <section class="product-grid">
      ${cards || `<div class="empty-state">目前尚無商品資料</div>`}
    </section>
  </main>
</body>
</html>
  `.trim();
}

function renderProductPage(product) {
  const gallery = product.images.map(src => {
    const thumb = buildThumb(src, 1000, 80);
    return `
      <div class="detail-image-item">
        <img src="${escapeAttr(thumb)}" alt="${escapeAttr(product.name)}" loading="lazy">
      </div>
    `;
  }).join("");

  const paragraphs = product.desc
    ? escapeHtml(product.desc).replace(/\n/g, "<br>")
    : "暫無介紹";

  return `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(product.name)}｜${SITE_NAME}</title>
  <link rel="stylesheet" href="/style.css">
  <meta name="description" content="${escapeAttr(product.name)}">
  <link rel="canonical" href="${SITE_URL}/products/${encodeURIComponent(product.id)}.html">
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <a class="back-link" href="/">← 返回首頁</a>
      <h1>${SITE_NAME}</h1>
    </div>
  </header>

  <main class="container detail-page">
    <section class="detail-gallery">
      ${gallery || `<div class="no-image">暫無圖片</div>`}
    </section>

    <section class="detail-content">
      <h2 class="detail-title">${escapeHtml(product.name)}</h2>
      <div class="detail-id">編號：${escapeHtml(product.id)}</div>
      <div class="detail-desc">${paragraphs}</div>
    </section>
  </main>
</body>
</html>
  `.trim();
}

function render404Page() {
  return `
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>找不到頁面｜${SITE_NAME}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="site-header">
    <div class="site-header-inner">
      <h1>${SITE_NAME}</h1>
    </div>
  </header>
  <main class="container">
    <div class="empty-state">
      找不到頁面，<a href="/">返回首頁</a>
    </div>
  </main>
</body>
</html>
  `.trim();
}

function buildThumb(src, width, quality) {
  const cleanSrc = String(src || "").trim();
  if (!cleanSrc) return "";
  if (!cleanSrc.startsWith(IMAGE_CDN_HOST)) {
    return cleanSrc;
  }
  return `/cdn-cgi/image/width=${width},quality=${quality},format=auto/${cleanSrc}`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
