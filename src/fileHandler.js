// Simple browser file handler for Zelgodiz Studio (offline, free)
const FileHandler = {
  saveFile(name, content) {
    localStorage.setItem(`file:${name}`, content);
  },
  loadFile(name) {
    return localStorage.getItem(`file:${name}`) || '';
  },
  listFiles() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith('file:'))
      .map(key => key.replace('file:', ''));
  },
  deleteFile(name) {
    localStorage.removeItem(`file:${name}`);
  }
};
window.FileHandler = FileHandler;
export default FileHandler;
