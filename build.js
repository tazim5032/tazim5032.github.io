// Copies only the public website files into dist/ for deployment.
// Usage: npm run build
const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'dist');
const files = [
  'index.html', 'blog.html', 'post.html', 'referrals.html',
  'styles.css', 'site.js', 'analytics.js',
  'referrals.json', 'Mohammad_Fakhrul_Islam_Resume.pdf',
];
const dirs = ['posts'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const f of files) fs.copyFileSync(path.join(root, f), path.join(out, f));
for (const d of dirs) fs.cpSync(path.join(root, d), path.join(out, d), { recursive: true });
// Optional extra files, copied only if present (e.g. photo.jpg, og-image.png).
for (const f of fs.readdirSync(root)) {
  if (/\.(jpe?g|png|webp|svg|ico)$/i.test(f)) fs.copyFileSync(path.join(root, f), path.join(out, f));
}
console.log('Built dist/ with', fs.readdirSync(out).join(', '));
