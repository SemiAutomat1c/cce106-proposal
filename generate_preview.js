const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlUrl = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
const previewPath = path.resolve(__dirname, 'preview.png');
const tempUserData = path.join(os.tmpdir(), 'chrome-preview-' + Date.now());

const args = [
  '--headless=new',
  '--disable-gpu',
  `--user-data-dir=${tempUserData}`,
  '--window-size=920,1320',
  '--hide-scrollbars',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=3000',
  `--screenshot=${previewPath}`,
  htmlUrl
];

console.log('Generating clean preview.png...');
execFile(chromePath, args, (error) => {
  if (error) {
    console.error('Error generating preview:', error);
    process.exit(1);
  }
  
  // Clean up temp user data
  try {
    fs.rmSync(tempUserData, { recursive: true, force: true });
  } catch (e) {}

  if (fs.existsSync(previewPath)) {
    console.log('preview.png successfully generated! Size:', fs.statSync(previewPath).size);
  }
});
