#!/usr/bin/env node

/**
 * 微信小程序本地编译脚本
 * 检查代码语法并捕获错误输出到 COMPILE_LOG.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目配置
const projectConfig = {
  projectPath: path.resolve(__dirname, '..'),
};

// 日志文件路径
const compileLogFile = path.resolve(__dirname, '../COMPILE_LOG.md');

// 格式化时间
function formatTime() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// 写入编译日志
function writeCompileLog(content) {
  const logContent = `# ==================== 编译日志开始 ====================

[${formatTime()}] ${content}

# ==================== 编译日志结束 ====================
`;

  try {
    fs.writeFileSync(compileLogFile, logContent, 'utf-8');
    console.log(`✓ 编译日志已写入: ${compileLogFile}`);
  } catch (error) {
    console.error('✗ 写入编译日志失败:', error);
  }
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

// 检查文件语法
function checkJSFile(filePath) {
  try {
    execSync(`node -c "${filePath}"`, { stdio: 'pipe' });
    return null;
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString() : '';
    const match = stderr.match(/:(\d+):(\d+)/);
    const errorInfo = {
      file: path.relative(projectConfig.projectPath, filePath).replace(/\\/g, '/'),
      error: stderr.trim() || error.message
    };
    if (match) {
      errorInfo.line = match[1];
      errorInfo.column = match[2];
    }
    return errorInfo;
  }
}

// 检查 WXML 文件
function checkWXMLFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const errors = [];

    // 检查标签闭合
    const openTags = content.match(/<[\w-]+[^>]*>/g) || [];
    const closeTags = content.match(/<\/[\w-]+>/g) || [];

    // 暂时不做深度语法检查，只做基本的文件存在性检查

    return errors;
  } catch (error) {
    return [{
      file: filePath,
      error: error.message
    }];
  }
}

// 扫描项目文件
function scanProject() {
  const errors = [];
  const pagesPath = path.join(projectConfig.projectPath, 'pages');

  // 扫描所有 JS 文件
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.'))
        scanDir(fullPath);
      else if (file.endsWith('.js')) {
        const check = checkJSFile(fullPath);
        if (check) errors.push(check);
      }
    });
  }

  scanDir(pagesPath);

  return errors;
}

// 编译项目
async function buildProject() {
  console.log('='.repeat(60));
  console.log('开始检查微信小程序代码...');
  console.log('='.repeat(60));

  clearCompileLog();

  const startTime = Date.now();

  try {
    // 检查必要文件是否存在
    const requiredFiles = [
      'app.js',
      'app.json',
      'app.wxss'
    ];

    const missingFiles = [];
    requiredFiles.forEach(file => {
      const filePath = path.join(projectConfig.projectPath, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    });

    if (missingFiles.length > 0) {
      throw new Error(`缺少必要文件: ${missingFiles.join(', ')}`);
    }

    // 检查 app.json 中的页面路径
    const appJsonPath = path.join(projectConfig.projectPath, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));

    const pageErrors = [];
    appJson.pages.forEach((pagePath) => {
      const fullPath = path.join(projectConfig.projectPath, pagePath);
      const requiredExtensions = ['.js', '.wxml', '.json', '.wxss'];

      requiredExtensions.forEach(ext => {
        const filePath = fullPath + ext;
        if (!fs.existsSync(filePath)) {
          pageErrors.push(`ENOENT: no such file or directory, open '${path.relative(projectConfig.projectPath, filePath).replace(/\\/g, '/')}'`);
        }
      });
    });

    // 扫描项目代码
    const syntaxErrors = scanProject();

    // 汇总所有错误
    const allErrors = [...pageErrors, ...syntaxErrors.map(e => e.error)];

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    if (allErrors.length === 0) {
      console.log('='.repeat(60));
      console.log('✓ 代码检查通过！');
      console.log('='.repeat(60));
      console.log('✓ 未发现语法或文件引用错误');
      console.log(`⏱️  检查耗时: ${elapsed}秒`);

      writeCompileLog(`[SUCCESS] 代码检查通过，耗时 ${elapsed}秒`);
      process.exit(0);
    } else {
      console.log('='.repeat(60));
      console.log('✗ 发现错误！');
      console.log('='.repeat(60));

      allErrors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error}`);
      });

      console.log(`\n⏱️  检查耗时: ${elapsed}秒`);

      // 写入编译日志
      const logLines = allErrors.map(e => `[ERROR] ${e}`).join('\n');
      writeCompileLog(logLines);

      console.log('\nℹ️  编译日志已写入 COMPILE_LOG.md');
      console.log('ℹ️  运行 npm run auto-fix 可尝试自动修复错误');

      process.exit(1);
    }

  } catch (error) {
    console.error('='.repeat(60));
    console.error('✗ 检查失败！');
    console.error('='.repeat(60));
    console.error('错误信息:', error.message);
    console.error('错误详情:', error);

    // 写入编译日志
    writeCompileLog(`[ERROR] ${error.message}

错误堆栈:
${error.stack || ''}`);

    console.log('\nℹ️  编译日志已写入 COMPILE_LOG.md');
    console.log('ℹ️  运行 npm run auto-fix 可尝试自动修复错误');

    process.exit(1);
  }
}

// 执行编译
buildProject();
