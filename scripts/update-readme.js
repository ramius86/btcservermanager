const fs = require('node:fs');
const path = require('node:path');

// Paths relative to this script
const rootDir = path.join(__dirname, '..');
const goModPath = path.join(rootDir, 'backend', 'go.mod');
const packageJsonPath = path.join(rootDir, 'frontend', 'package.json');
const readmePath = path.join(rootDir, 'README.md');

// 1. Read Go version from backend/go.mod
let goVersion = '';
if (fs.existsSync(goModPath)) {
  const goModContent = fs.readFileSync(goModPath, 'utf8');
  const match = goModContent.match(/^go\s+(\d+\.\d+(?:\.\d+)?)/m);
  if (match) {
    goVersion = match[1];
  }
}

// 2. Read React & Tailwind versions from frontend/package.json
let reactVersion = '';
let tailwindVersion = '';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const getCleanVersion = (val) => val ? val.replace(/^[\^~]/, '') : '';
  
  const devDeps = packageJson.devDependencies || {};
  const deps = packageJson.dependencies || {};
  
  reactVersion = getCleanVersion(deps.react || devDeps.react);
  tailwindVersion = getCleanVersion(deps.tailwindcss || devDeps.tailwindcss);
}

console.log(`Extracted versions: Go: ${goVersion}, React: ${reactVersion}, Tailwind: ${tailwindVersion}`);

if (!goVersion || !reactVersion || !tailwindVersion) {
  console.error('Error: Could not extract all version numbers.');
  process.exit(1);
}

// 3. Read README.md and update it
if (fs.existsSync(readmePath)) {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  let updatedContent = readmeContent;

  // Update badges
  // e.g. ![Go Version](https://img.shields.io/badge/Go-1.26.2-00ADD8?style=flat-square&logo=go&logoColor=white)
  updatedContent = updatedContent.replace(
    /(!\[Go Version\]\(https:\/\/img\.shields\.io\/badge\/Go-)([\d.]+)(-\w+\?style=flat-square&logo=go&logoColor=white\))/g,
    `$1${goVersion}$3`
  );
  
  // e.g. ![React Version](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat-square&logo=react&logoColor=black)
  updatedContent = updatedContent.replace(
    /(!\[React Version\]\(https:\/\/img\.shields\.io\/badge\/React-)([\d.]+)(-\w+\?style=flat-square&logo=react&logoColor=black\))/g,
    `$1${reactVersion}$3`
  );

  // e.g. ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.0-38B2AC?style=flat-square&logo=tailwind-css)
  updatedContent = updatedContent.replace(
    /(!\[Tailwind CSS\]\(https:\/\/img\.shields\.io\/badge\/Tailwind_CSS-v)([\d.]+)(-\w+\?style=flat-square&logo=tailwind-css\))/g,
    `$1${tailwindVersion}$3`
  );

  // Update text mentions
  // e.g. "#### 1. Backend Setup (Go 1.26.2+)"
  updatedContent = updatedContent.replace(
    /(#### 1\. Backend Setup \(Go )([\d.+]+)(\))/g,
    `$1${goVersion}+$3`
  );

  // e.g. "* **Language**: Go 1.26.2"
  updatedContent = updatedContent.replace(
    /(\*\s+\*\*Language\*\*:\s+Go\s+)([\d.]+)/g,
    `$1${goVersion}`
  );

  if (updatedContent === readmeContent) {
    console.log('README.md is already up to date.');
  } else {
    fs.writeFileSync(readmePath, updatedContent, 'utf8');
    console.log('README.md updated successfully.');
  }
} else {
  console.error('Error: README.md not found.');
  process.exit(1);
}
