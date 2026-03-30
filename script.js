const JSON_URL = "https://script.google.com/macros/s/AKfycbz9AWk4aUrtfEiddayYkggV1fQfICLiCP-i4sD7aR5l817IQGLZ1NwgyCemkfHdpZdOTA/exec";

async function loadProducts() {
  try {
    const response = await fetch(JSON_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const products = await response.json();
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = "";

    if (!products || products.length === 0) {
      productList.innerHTML = `<div class="empty-state">目前尚無商品資料</div>`;
      return;
    }

    products.forEach((product) => {
      const firstImage = product.images && product.images.length > 0 ? product.images[0] : "";
      const firstImageThumb = firstImage
        ? `/cdn-cgi/image/width=420,quality=75,format=auto/${firstImage}`
        : "";

      const card = document.createElement("a");
      card.className = "product-card";
      card.href = `detail.html?id=${encodeURIComponent(product.id)}`;

      card.innerHTML = `
        <div class="product-image-wrap">
          ${firstImageThumb ? `<img src="${firstImageThumb}" alt="${escapeHtml(product.name)}" loading="lazy">` : `<div class="no-image">暫無圖片</div>`}
        </div>
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-id">編號：${escapeHtml(product.id)}</div>
        </div>
      `;

      const img = card.querySelector("img");
      if (img) {
        img.onerror = function () {
          this.remove();
          const wrap = card.querySelector(".product-image-wrap");
          if (wrap) {
            wrap.innerHTML = `<div class="no-image">暫無圖片</div>`;
          }
        };
      }

      productList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    const productList = document.getElementById("product-list");
    if (productList) {
      productList.innerHTML = `<div class="empty-state">商品資料載入失敗</div>`;
    }
  }
}

async function loadProductDetail() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const container = document.getElementById("product-detail");

    if (!container) return;

    if (!productId) {
      container.innerHTML = `<div class="empty-state">找不到商品編號</div>`;
      return;
    }

    const response = await fetch(JSON_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const products = await response.json();
    const product = products.find(item => item.id === productId);

    if (!product) {
      container.innerHTML = `<div class="empty-state">找不到商品資料</div>`;
      return;
    }

    const imagesHtml = (product.images || []).map(src => {
      const thumb = `/cdn-cgi/image/width=900,quality=80,format=auto/${src}`;
      return `<img src="${thumb}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.remove()">`;
    }).join("");

    container.innerHTML = `
      <div class="detail-gallery">
        ${imagesHtml || `<div class="no-image">暫無圖片</div>`}
      </div>
      <div class="detail-content">
        <h1>${escapeHtml(product.name)}</h1>
        <div class="detail-id">編號：${escapeHtml(product.id)}</div>
        <div class="detail-desc">${formatDescription(product.desc)}</div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    const container = document.getElementById("product-detail");
    if (container) {
      container.innerHTML = `<div class="empty-state">商品資料載入失敗</div>`;
    }
  }
}

function formatDescription(text) {
  return String(text || "").replace(/\n/g, "<br>");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
