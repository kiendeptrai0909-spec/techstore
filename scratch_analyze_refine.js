const fs = require('fs');
const path = require('path');

const results = JSON.parse(fs.readFileSync(path.join(__dirname, 'analysis_raw.json'), 'utf-8'));

const reallyUnused = [];
const maybeUnused = [];
const keep = [];

results.forEach(file => {
  const isJava = file.ext === '.java';
  const isJS = ['.js', '.jsx'].includes(file.ext);
  
  // Đọc nội dung file để phân tích annotations
  let content = '';
  try {
    content = fs.readFileSync(path.join(__dirname, file.path), 'utf-8');
  } catch (err) {}
  
  if (file.refCount === 0) {
    if (isJava) {
      const isController = content.includes('@RestController') || content.includes('@Controller');
      const isConfig = content.includes('@Configuration') || content.includes('@Component') && file.path.includes('/config/');
      const isExceptionHandler = content.includes('@ControllerAdvice') || content.includes('@RestControllerAdvice');
      const isSpringBootApp = content.includes('@SpringBootApplication');
      const isCleanupService = file.name.includes('CleanupService') || content.includes('@Scheduled');
      
      if (isController || isConfig || isExceptionHandler || isSpringBootApp || isCleanupService) {
        keep.push({
          path: file.path,
          reason: 'Spring Boot Component (Controller/Config/App/Scheduler) được Spring tự động load.'
        });
      } else {
        reallyUnused.push({
          path: file.path,
          reason: 'Java class (Entity/DTO/Repository/Service) không được import hoặc reference bởi bất kỳ file nào khác.'
        });
      }
    } else if (isJS) {
      // Check xem có phải là Route hoặc Config được config động không
      reallyUnused.push({
        path: file.path,
        reason: 'Javascript/React file (API/Component/Page) không được import hoặc reference bởi bất kỳ file nào khác.'
      });
    } else {
      // Assets
      reallyUnused.push({
        path: file.path,
        reason: 'Asset/CSS file không được reference hoặc sử dụng.'
      });
    }
  } else {
    // Có reference
    keep.push({
      path: file.path,
      reason: `Được reference bởi: ${file.referencedBy.join(', ')}`
    });
  }
});

console.log('=== THỰC SỰ UNUSED (CÓ THỂ XÓA AN TOÀN) ===');
reallyUnused.forEach(f => {
  console.log(`- ${f.path}: ${f.reason}`);
});

console.log('\n=== CẦN GIỮ LẠI ===');
console.log(`Tổng số file được xác định cần giữ lại: ${keep.length}`);

// Ghi báo cáo ra file report
const report = {
  safeToDelete: reallyUnused,
  keep: keep
};
fs.writeFileSync(path.join(__dirname, 'report.json'), JSON.stringify(report, null, 2));
