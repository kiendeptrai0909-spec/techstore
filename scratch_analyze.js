const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

// Các thư mục cần quét
const scanDirs = [
  path.join(rootDir, 'frontend', 'src'),
  path.join(rootDir, 'backend', 'src', 'main', 'java')
];

// Hàm lấy đệ quy tất cả các file
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = [];
scanDirs.forEach(dir => getFiles(dir, allFiles));

console.log(`Tìm thấy tổng cộng: ${allFiles.length} files trong dự án.`);

// Phân loại các file và nội dung của chúng
const fileDatabase = allFiles.map(filePath => {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath);
  const nameWithoutExt = path.basename(filePath, ext);
  
  // Đọc nội dung file
  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    // Binary or empty
  }
  
  return {
    path: filePath,
    relPath: path.relative(rootDir, filePath).replace(/\\/g, '/'),
    basename,
    nameWithoutExt,
    ext,
    content
  };
});

// Quét references
const results = [];

fileDatabase.forEach(file => {
  // Bỏ qua các file cấu hình chính hoặc layout/routes mặc định nếu chắc chắn dùng
  if (['main.jsx', 'App.jsx', 'App.css', 'index.css', 'TechstoreApplication.java'].includes(file.basename)) {
    return;
  }
  
  let refCount = 0;
  const referencedBy = [];
  
  // Tìm kiếm sự xuất hiện của tên file trong các file khác
  fileDatabase.forEach(otherFile => {
    if (otherFile.path === file.path) return;
    
    // Đối với Java class, tìm import hoặc reference qua classname
    // Đối với JS/JSX, tìm import qua path hoặc component name
    let isReferenced = false;
    
    if (file.ext === '.java') {
      // Check import đầy đủ hoặc đơn thuần tên class
      const classPattern = new RegExp(`\\b${file.nameWithoutExt}\\b`);
      if (classPattern.test(otherFile.content)) {
        isReferenced = true;
      }
    } else if (['.js', '.jsx'].includes(file.ext)) {
      // Check import path (e.g. from './api/brandApi' or from '../pages/admin/AdminBrandPage')
      // Hoặc tên Component nếu là JSX
      const pathPattern = new RegExp(`\\b${file.nameWithoutExt}\\b`);
      if (pathPattern.test(otherFile.content)) {
        isReferenced = true;
      }
    } else {
      // Với assets hoặc css
      if (otherFile.content.includes(file.basename)) {
        isReferenced = true;
      }
    }
    
    if (isReferenced) {
      refCount++;
      referencedBy.push(otherFile.relPath);
    }
  });
  
  results.push({
    path: file.relPath,
    name: file.basename,
    ext: file.ext,
    refCount,
    referencedBy
  });
});

// Tìm các file có refCount === 0
const unusedFiles = results.filter(r => r.refCount === 0);

console.log('\n--- CÁC FILE KHÔNG ĐƯỢC REFERENCE ĐẾN ---');
unusedFiles.forEach(file => {
  console.log(`[UNUSED] ${file.path} (${file.ext})`);
});

// Lưu kết quả ra JSON để kiểm tra chi tiết
fs.writeFileSync(path.join(__dirname, 'analysis_raw.json'), JSON.stringify(results, null, 2));
