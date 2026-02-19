#!/usr/bin/env node
/**
 * 从环境变量 TRIZ_APIKEY 读取 API Key 并写入 config.js
 *
 * 用法：
 *   # Linux/macOS
 *   TRIZ_APIKEY=nvapi-xxx node scripts/configure-api-key.js
 *
 *   # Windows (PowerShell)
 *   $env:TRIZ_APIKEY="nvapi-xxx"; node scripts/configure-api-key.js
 *
 *   # Windows (CMD)
 *   set TRIZ_APIKEY=nvapi-xxx && node scripts/configure-api-key.js
 */

const fs = require('fs');
const path = require('path');

// 读取环境变量
const apiKey = process.env.TRIZ_APIKEY || '';

if (!apiKey) {
  console.log('❌ 未检测到 TRIZ_APIKEY 环境变量');
  console.log('请设置环境变量后重新运行：');
  console.log('  Linux/macOS: TRIZ_APIKEY=nvapi-xxx node scripts/configure-api-key.js');
  console.log('  Windows:     set TRIZ_APIKEY=nvapi-xxx && node scripts/configure-api-key.js');
  process.exit(1);
}

if (!apiKey.startsWith('nvapi-')) {
  console.log('❌ API Key 格式不正确，应该以 "nvapi-" 开头');
  process.exit(1);
}

const configPath = path.join(__dirname, '..', 'pages', 'questionnaire', 'config.js');

// 读取当前配置文件
let configContent = fs.readFileSync(configPath, 'utf-8');

// 替换 apiKey
const newConfigContent = configContent.replace(
  /apiKey:\s*''/,
  `apiKey: '${apiKey}'`
);

fs.writeFileSync(configPath, newConfigContent, 'utf-8');

console.log('✅ API Key 已成功写入 config.js');
console.log(`   文件路径: ${configPath}`);
