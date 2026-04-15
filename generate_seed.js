const fs = require('fs');

const data = JSON.parse(fs.readFileSync('supabase.txt', 'utf8'));

let sql = `
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM categories;

DO $$
DECLARE
`;

const catVars = [];
function addCatVar(slug) {
  if (!slug) return;
  let varName = slug.replace(/-/g, '_');
  if (!catVars.includes(varName)) {
    catVars.push(varName);
    sql += `  cat_${varName} UUID;\n`;
  }
}

data.categories.forEach(c => {
  addCatVar(c.slug);
  if (c.children) {
    c.children.forEach(child => addCatVar(child.slug));
  }
});

sql += `BEGIN\n`;

function insertCat(c) {
  if (!c.slug) return;
  let varName = c.slug.replace(/-/g, '_');
  let name = (c.meta && c.meta.en && c.meta.en.name) ? c.meta.en.name : c.id;
  let desc = (c.meta && c.meta.en && c.meta.en.description) ? c.meta.en.description : '';
  let metaStr = JSON.stringify(c).replace(/'/g, "''");
  let imgUrl = c.bannerImage || (c.heroVideo && c.heroVideo.poster) || '';
  
  sql += `  INSERT INTO categories (name, slug, description, image_url, metadata) VALUES ('${name.replace(/'/g, "''")}', '${c.slug}', '${desc.replace(/'/g, "''")}', '${imgUrl.replace(/'/g, "''")}', '${metaStr}'::jsonb) RETURNING id INTO cat_${varName};\n`;
}

data.categories.forEach(c => {
  insertCat(c);
  if (c.children) {
    c.children.forEach(child => insertCat(child));
  }
});

sql += `\n`;

data.products.forEach(p => {
  let catVar = 'cat_' + (p.categoryId || '').replace(/-/g, '_');
  // fallback if category not matched
  if (!catVars.includes((p.categoryId || '').replace(/-/g, '_'))) {
    catVar = 'NULL';
  }
  
  let name = (p.meta && p.meta.en && p.meta.en.name) ? p.meta.en.name : (p.sku || p.id);
  let priceStr = (p.price && p.price.current) ? p.price.current : '0';
  let price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  if (isNaN(price)) price = 0;
  
  let stock = p.stockCount || 0;
  let rating = p.rating || 0;
  let isFeatured = p.status === 'inStock' || p.status === 'onlyLeft' ? true : false;
  
  let images = p.images && p.images.gallery ? [...p.images.gallery] : [];
  if (p.images && p.images.primary) images.unshift(p.images.primary);
  let arrayStr = images.length > 0 ? `ARRAY[${images.map(i => `'${i}'`).join(', ')}]::text[]` : `ARRAY[]::text[]`;
  
  let pMeta = JSON.stringify(p).replace(/'/g, "''");

  sql += `  INSERT INTO products (category_id, name, price, stock, image_urls, is_featured, rating, metadata) VALUES (${catVar}, '${name.replace(/'/g, "''")}', ${price}, ${stock}, ${arrayStr}, ${isFeatured}, ${rating}, '${pMeta}'::jsonb);\n`;
});

sql += `END $$;\n`;

fs.writeFileSync('seed_from_txt.sql', sql);
console.log('SQL generated.');
