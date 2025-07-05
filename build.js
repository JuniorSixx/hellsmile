const fs = require('fs-extra');
const path = require('path');

const VALID_EXTENSIONS = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
const CRITICAL_FILES = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

async function build() {
  try {
    // Create dist directory if it doesn't exist
    await fs.ensureDir('dist');
    console.log('Building project...');

    // Copy all valid files from src to dist
    await fs.copy('src', 'dist', {
      filter: (src, dest) => {
        const ext = path.extname(src).toLowerCase();
        return VALID_EXTENSIONS.includes(ext);
      }
    });

    console.log('Build completed successfully!');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
