const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../pages/conflicts/conflicts.wxml');
const outputFile = path.join(__dirname, '../pages/conflicts/conflicts.wxml.new');

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err);
    process.exit(1);
  }

  // 批量替换所有按钮的函数调用
  let newData = data;

  const replacements = [
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 }
  ];

  replacements.forEach(({ id }) => {
    const idx = id - 1;
    
    // 替换 getConflictLevelClass
    newData = newData.replace(
      new RegExp(`getConflictLevelClass\\(${id}\\)`, 'g'),
      `conflictMap[${id}].levelClass`
    );
    
    // 替换 getConflictColor
    newData = newData.replace(
      new RegExp(`getConflictColor\\(${id}\\)`, 'g'),
      `conflictMap[${id}].bgColor`
    );
    
    // 替换 getConflictShape
    newData = newData.replace(
      new RegExp(`getConflictShape\\(${id}\\)`, 'g'),
      `conflictMap[${id}].shapeClass`
    );
  });

  // 写入新文件
  fs.writeFile(outputFile, newData, 'utf8', (err) => {
    if (err) {
      console.error('写入文件失败:', err);
      process.exit(1);
    }
    
    console.log('✓ 已处理所有按钮的WXS函数调用');
    console.log('新文件:', outputFile);
    console.log('\n请手动替换：');
    console.log('  mv ' + outputFile + ' ' + inputFile);
  });
});
