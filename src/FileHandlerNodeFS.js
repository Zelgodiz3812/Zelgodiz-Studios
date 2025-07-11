// src/FileHandlerNodeFS.js
// Uses Node.js 'fs' and 'path' modules for actual file system operations.

const fs = require('fs');
const path = require('path');

const FileHandlerNodeFS = {
  ensureDirectoryExists(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExists(dirname); // Recursively create parent directories
    fs.mkdirSync(dirname);
  },

  saveFile(filePath, content) {
    try {
      this.ensureDirectoryExists(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`File saved: ${filePath}`);
      return true;
    } catch (error) {
      console.error(`Error saving file ${filePath}:`, error);
      return false;
    }
  },

  loadFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
      console.warn(`File not found: ${filePath}`);
      return null; // Or throw new Error('File not found');
    } catch (error) {
      console.error(`Error loading file ${filePath}:`, error);
      return null; // Or throw error;
    }
  },

  listFiles(directoryPath = '.') {
    try {
      // Ensure the directory path is absolute or resolve it
      const resolvedPath = path.resolve(directoryPath);

      if (!fs.existsSync(resolvedPath)) {
        console.warn(`Directory not found: ${resolvedPath}`);
        return []; // Return empty if directory doesn't exist
      }

      const items = fs.readdirSync(resolvedPath);
      return items.map(item => {
        const itemPath = path.join(resolvedPath, item);
        let stats;
        try {
          stats = fs.statSync(itemPath);
        } catch (e) {
          // Could be a symlink that's broken or permission issue
          console.warn(`Could not stat ${itemPath}, skipping. Error: ${e.message}`);
          return null;
        }
        return {
          name: item,
          path: itemPath,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          // size: stats.size, // Optional: include size
          // lastModified: stats.mtime, // Optional: include last modified
        };
      }).filter(item => item !== null); // Filter out items that couldn't be stat'd
    } catch (error) {
      console.error(`Error listing files in directory ${directoryPath}:`, error);
      return [];
    }
  },

  deleteFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          // For directories, use recursive delete (like rimraf or fs.rmSync with recursive option)
          // For simplicity, fs.rmdirSync will fail if not empty.
          // A more robust solution would use fs.rm(filePath, { recursive: true, force: true }, callback);
          // or fs.rmSync(filePath, { recursive: true, force: true }); for Node 14.14+
          // For now, let's stick to deleting files or empty directories for simplicity in this step.
          // If you need to delete non-empty directories, this needs enhancement.
          fs.rmdirSync(filePath); // Only works for empty directories
          console.log(`Directory deleted: ${filePath}`);

        } else {
          fs.unlinkSync(filePath);
          console.log(`File deleted: ${filePath}`);
        }
        return true;
      }
      console.warn(`File/Directory not found for deletion: ${filePath}`);
      return false;
    } catch (error) {
      console.error(`Error deleting file/directory ${filePath}:`, error);
      return false;
    }
  },

  createDirectory(directoryPath) {
    try {
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // recursive: true creates parent dirs if they don't exist
        console.log(`Directory created: ${directoryPath}`);
        return true;
      }
      console.warn(`Directory already exists: ${directoryPath}`);
      return false;
    } catch (error) {
      console.error(`Error creating directory ${directoryPath}:`, error);
      return false;
    }
  },

  getItemType(itemPath) {
    try {
      const stats = fs.statSync(itemPath);
      if (stats.isFile()) return 'file';
      if (stats.isDirectory()) return 'directory';
      return 'other';
    } catch (error) {
      // If path doesn't exist or other error
      console.error(`Error getting item type for ${itemPath}:`, error.message);
      return 'unknown';
    }
  },

  resolvePath(...paths) {
    return path.resolve(...paths);
  },

  basename(filePath) {
    return path.basename(filePath);
  },

  dirname(filePath) {
    return path.dirname(filePath);
  }
};

// Export the module for use in Electron renderer process (if nodeIntegration is true)
// or for use in main process if operations are moved there via IPC.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileHandlerNodeFS;
} else {
  // Fallback for potential browser environment if this file is somehow included there
  // Though it won't work due to 'require'
  window.FileHandlerNodeFS = FileHandlerNodeFS;
}
