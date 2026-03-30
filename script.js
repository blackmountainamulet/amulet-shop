* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, "Noto Sans TC", sans-serif;
  background: #0f0f0f;
  color: #f5f5f5;
  line-height: 1.8;
}

a {
  color: inherit;
}

.site-header {
  border-bottom: 1px solid #262626;
  background: #111;
}

.site-header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 18px 16px;
}

.site-header h1 {
  margin: 0;
  font-size: 24px;
  letter-spacing: 1px;
}

.back-link {
  display: inline-block;
  margin-bottom: 10px;
  color: #cfcfcf;
  text-decoration: none;
  font-size: 14px;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  display: block;
  text-decoration: none;
  background: #181818;
  border: 1px solid #292929;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  border-color: #444;
}

.product-image-wrap {
  aspect-ratio: 1 / 1;
  background: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-info {
  padding: 14px;
}

.product-name {
  font-size: 16px;
  line-height: 1.55;
  margin-bottom: 8px;
}

.product-id {
  font-size: 13px;
  color: #b8b8b8;
}

.detail-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 480px);
  gap: 28px;
  align-items: start;
}

.detail-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.detail-image-item {
  background: #181818;
  border: 1px solid #292929;
  border-radius: 14px;
  overflow: hidden;
}

.detail-image-item img {
  width: 100%;
  display: block;
}

.detail-content {
  background: #181818;
  border: 1px solid #292929;
  border-radius: 14px;
  padding: 20px;
}

.detail-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 28px;
  line-height: 1.45;
}

.detail-id {
  margin-bottom: 18px;
  color: #b8b8b8;
  font-size: 14px;
}

.detail-desc {
  font-size: 15px;
  color: #f1f1f1;
  word-break: break-word;
}

.no-image,
.empty-state {
  color: #9e9e9e;
  text-align: center;
  padding: 36px 20px;
}

@media (max-width: 960px) {
  .detail-page {
    grid-template-columns: 1fr;
  }

  .detail-content {
    padding: 18px;
  }

  .detail-title {
    font-size: 24px;
  }
}
