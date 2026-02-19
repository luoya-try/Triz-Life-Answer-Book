# 自动化编译与修复指南

## 概述

本项目集成了 `miniprogram-ci` 提供命令行自动化编译和错误修复功能。

## 前置要求

- Node.js >= 16.0.0
- npm（随 Node.js 一起安装）

## 安装依赖

```bash
npm install
```

## 使用方法

### 1. 编译项目

```bash
npm run build
```

编译结果：
- 成功：生成预览二维码（`qrcode.jpg`），可用微信扫描预览
- 失败：错误信息写入 `COMPILE_LOG.md`

### 2. 自动修复错误

```bash
npm run auto-fix
```

自动修复流程：
1. 读取 `COMPILE_LOG.md` 中的编译错误
2. 解析错误类型和位置
3. 尝试自动修复常见错误
4. 修复完成后清空日志

### 3. 完整工作流

```bash
# 1. 编译项目
npm run build

# 2. 如果有错误，自动修复
npm run auto-fix

# 3. 重新编译
npm run build
```

## 支持的自动修复类型

目前支持识别（但不一定自动修复）以下错误类型：

1. **文件未找到错误**
   - 检测缺失的页面文件
   - 提示从 app.json 中移除引用

2. **语法错误 (SyntaxError)**
   - 括号不匹配
   - 引号错误
   - 分号缺失

3. **引用错误 (ReferenceError)**
   - 变量未定义
   - 缺少 import/require

4. **类型错误 (TypeError)**
   - 属性访问错误
   - 函数调用错误

## 配置文件

- `.ci.js` - CI 配置
- `scripts/build.js` - 编译脚本
- `scripts/auto-fix.js` - 自动修复脚本
- `docs/AUTO_FIX_CONFIG.md` - 详细修复规则

## 常见问题

### Q1: 编译失败提示"project.private.config.json 找不到"?

A: 这是正常的，miniprogram-ci 主要用于上传和预览功能。本地预览编译可以跳过项目密钥验证。

### Q2: 如何查看详细的编译错误?

A: 查看 `COMPILE_LOG.md` 文件或运行 `npm run auto-fix` 查看错误解析。

### Q3: 自动修复后编译还是失败?

A: 自动修复功能仍在完善中，部分复杂错误需要手动修复。请查看编译日志中的具体错误信息。

## 配合 AI 代理使用

当使用 AI 代理进行开发时：

1. **触发构建模式**：AI 代理会自动读取 `COMPILE_LOG.md`
2. **智能修复**：AI 根据 `AUTO_FIX_CONFIG.md` 中的规则应用修复
3. **迭代验证**：修复后自动重新编译

## 注意事项

- 编译需要联网（miniprogram-ci 会连接微信服务器）
- 首次编译可能需要较长时间
- 生成的二维码有有效期限制
