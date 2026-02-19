#!/usr/bin/env node

/**
 * 自动修复脚本
 * 读取 COMPILE_LOG.md 中的编译错误，并根据规则自动修复
 */

const fs = require('fs');
const path = require('path');

// 日志文件路径
const compileLogFile = path.resolve(__dirname, '../COMPILE_LOG.md');
const autoFixConfigPath = path.resolve(__dirname, '../docs/AUTO_FIX_CONFIG.md');

// 格式化时间
function formatTime() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// 读取编译日志
function readCompileLog() {
  try {
    if (!fs.existsSync(compileLogFile)) {
      console.log('✗ 编译日志不存在');
      return null;
    }

    const content = fs.readFileSync(compileLogFile, 'utf-8');
    return content;
  } catch (error) {
    console.error('✗ 读取编译日志失败:', error);
    return null;
  }
}

// 解析编译日志，提取错误信息
function parseErrors(logContent) {
  const errors = [];

  // 匹配 [ERROR] 开头的错误
  const errorRegex = /\[ERROR\]\s+(.+)/g;
  let match;
  while ((match = errorRegex.exec(logContent)) !== null) {
    errors.push(match[1].trim());
  }

  return errors;
}

// 备份文件
function backupFile(filePath) {
  try {
    const backupPath = filePath + '.backup';
    fs.copyFileSync(filePath, backupPath);
    console.log(`✓ 已备份: ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`✗ 备份失败: ${filePath}`, error);
    return false;
  }
}

// 修复错误
function fixError(error, appJson) {
  console.log('');
  console.log('→ 尝试修复错误:', error);

  // 1. 文件未找到错误
  if (error.includes('no such file or directory') || error.includes('not found')) {
    const filePathMatch = error.match(/open ['"](.+?)['"]/) || error.match(/File: (.+)/);
    if (filePathMatch) {
      const filePath = filePathMatch[1].replace(/\\/g, '/');
      console.log('  检测到文件未找到错误:', filePath);

      // 检查是否在 app.json 中引用了不存在的页面
      if (filePath.includes('pages/')) {
        const pagePath = filePath.split('pages/')[1]?.replace(/\.(wxml|wxss|js|json)/, '');
        console.log('  解析到的页面路径:', pagePath);

        if (pagePath) {
          const fullPagePath = 'pages/' + pagePath;
          console.log('  检查 app.json 中是否存在:', fullPagePath);
          console.log('  app.json.pages:', appJson.pages);

          const pageIndex = appJson.pages.indexOf(fullPagePath);
          if (pageIndex !== -1) {
            console.log(`  → 从 app.json 中移除页面引用: ${fullPagePath}`);

            // 备份 app.json
            if (!backupFile(path.join(process.cwd(), 'app.json'))) {
              return { fixed: false, message: '备份失败，无法修复' };
            }

            // 移除页面引用
            appJson.pages.splice(pageIndex, 1);

            // 写入修改后的 app.json
            const appJsonPath = path.join(process.cwd(), 'app.json');
            fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), 'utf-8');

            console.log('  ✓ 已移除页面引用');
            return { fixed: true, message: '已移除无效页面引用' };
          } else {
            console.log('  页面不在 app.json.pages 数组中');
          }
        }
      }
    }
    return { fixed: false, message: '无法自动修复' };
  }

  // 2. 语法错误 - 简单修复
  if (error.includes('SyntaxError')) {
    console.log('  检测到语法错误，需要手动检查代码');
    return { fixed: false, message: '语法错误需要手动修复' };
  }

  // 3. 引用错误
  if (error.includes('ReferenceError') || error.includes('is not defined')) {
    const varMatch = error.match(/ReferenceError: (.+) is not defined/);
    if (varMatch) {
      console.log(`  检测到变量未定义: ${varMatch[1]}`);
      return { fixed: false, message: `变量 ${varMatch[1]} 未定义，需要手动添加` };
    }
  }

  // 4. 类型错误
  if (error.includes('TypeError')) {
    console.log('  检测到类型错误，需要手动检查代码');
    return { fixed: false, message: '类型错误需要手动修复' };
  }

  console.log('  → 未知错误类型');
  return { fixed: false, message: '未知错误类型' };
}

// 清空编译日志
function clearCompileLog() {
  try {
    if (fs.existsSync(compileLogFile)) {
      fs.unlinkSync(compileLogFile);
      console.log('✓ 编译日志已清空');
    }
  } catch (error) {
    console.error('✗ 清空编译日志失败:', error);
  }
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('自动修复脚本');
  console.log('='.repeat(60));

  const logContent = readCompileLog();
  if (!logContent) {
    console.log('✗ 没有找到编译日志');
    console.log('ℹ️  请先运行 npm run build 生成编译日志');
    process.exit(1);
  }

  console.log('✓ 已读取编译日志');
  console.log(`📅 时间: ${formatTime()}`);
  console.log('');

  // 加载 app.json
  const appJsonPath = path.join(process.cwd(), 'app.json');
  let appJson = null;
  try {
    appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    console.log('✓ 已加载 app.json');
  } catch (error) {
    console.error('✗ 加载 app.json 失败:', error);
    process.exit(1);
  }

  const errors = parseErrors(logContent);
  console.log(`📊 发现 ${errors.length} 个错误`);
  console.log('');

  if (errors.length === 0) {
    console.log('✓ 未发现错误，无需修复');
    clearCompileLog();
    process.exit(0);
  }

  // 显示所有错误
  errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
  console.log('');

  // 尝试修复每个错误
  let fixedCount = 0;
  for (let i = 0; i < errors.length; i++) {
    const result = fixError(errors[i], appJson);
    if (result.fixed) {
      fixedCount++;
    } else {
      console.log(`  ⚠️  ${result.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`修复完成: ${fixedCount}/${errors.length} 个错误`);
  console.log('='.repeat(60));

  if (fixedCount > 0) {
    console.log('');
    console.log('✓ 已自动修复部分错误');
    console.log('ℹ️  运行 npm run build 重新编译验证');
    clearCompileLog();
  } else {
    console.log('');
    console.log('⚠️  未自动修复任何错误，请手动检查代码');
    console.log('ℹ️  编译日志未被清空，可继续参考');
  }

  process.exit(fixedCount > 0 ? 0 : 1);
}

// 运行主函数
main();
