const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const pdfPath = path.resolve(__dirname, 'poster_a4.pdf');

// Remove old PDF first so we know a fresh one is written
if (fs.existsSync(pdfPath)) {
  fs.unlinkSync(pdfPath);
}

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-margins',
  '--no-pdf-header-footer',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=3000',
  `--print-to-pdf=${pdfPath}`,
  htmlUrl
];

console.log('Generating PDF...');
execFile(chromePath, args, (error, stdout, stderr) => {
  if (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
  if (fs.existsSync(pdfPath)) {
    console.log('poster_a4.pdf successfully created! Size:', fs.statSync(pdfPath).size, 'bytes');
  } else {
    console.error('PDF file not found after generation.');
  }
});
