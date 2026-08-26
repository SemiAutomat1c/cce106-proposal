const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

// Replace CSS link with inline style
html = html.replace(/<link rel=["']stylesheet["'] href=["']style\.css["']\s*\/?>/, `<style>\n${css}\n</style>`);

// Replace JS script tag with inline script
html = html.replace(/<script src=["']script\.js["']><\/script>/, `<script>\n${js}\n</script>`);

fs.writeFileSync('standalone.html', html, 'utf8');
console.log('standalone.html generated successfully! File size:', fs.statSync('standalone.html').size);
