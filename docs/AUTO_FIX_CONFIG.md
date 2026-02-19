# 自动编译日志分析与自修复配置

此文件定义如何根据 COMPILE_LOG.md 中的编译错误自动修复的规则。

## 使用方法

当用户进入 build 模式时，系统自动：
1. 读取 COMPILE_LOG.md 中的编译错误
2. 根据本文件中的规则匹配错误类型
3. 执行相应的修复操作
4. 重新编译验证

## 错误类型与修复规则

### 1. 语法错误 (SyntaxError)

**模式：** `SyntaxError: .* in (.+):(\d+)`

**修复操作：**
- 解析文件路径和行号
- 分析语法错误类型（括号不匹配、缺少分号、引号错误等）
- 自动修复常见语法问题

**示例：**
```
[ERROR] pages/index/index.js:15 - SyntaxError: missing ) after argument list
→ 自动添加缺少的括号
```

### 2. 引用错误 (ReferenceError)

**模式：** `ReferenceError: (.+) is not defined`

**修复操作：**
- 检查是否是未声明的变量
- 检查是否拼写错误
- 检查是否缺少 import/require

**示例：**
```
[ERROR] pages/grid/grid.js:42 - ReferenceError: gridData is not defined
→ 检查变量声明，添加到 data 对象中
```

### 3. 类型错误 (TypeError)

**模式：** `TypeError: (.+)`

**修复操作：**
- 检查空的/未定义的访问
- 检查函数调用参数
- 修复数据类型转换

**示例：**
```
[ERROR] pages/questionnaire/questionnaire.js:128 - TypeError: Cannot read property 'value' of undefined
→ 添加空值检查：condition && condition.value
```

### 4. 微信 API 调用错误

**模式：** `(wx\.\w+).*fail`

**修复操作：**
- 检查 API 参数是否正确
- 检查是否需要用户授权
- 添加错误处理

**示例：**
```
[ERROR] request:fail - url not in domain list
→ 提醒配置域名白名单或启用不校验域名选项
```

### 5. WXML 绑定错误

**模式：** `Cannot read property .+ of (undefined|null)`

**修复操作：**
- 检查数据绑定路径
- 添加默认值或条件渲染

**示例：**
```
[ERROR] pages/solutions/solutions.wxml:23 - Cannot read property 'title' of undefined
→ 修改为：{{solution?.title || ''}}
```

### 6. 文件未找到 (File not found)

**模式：** `File: (.+) not found`

**修复操作：**
- 检查引用路径是否正确
- 检查 app.json 中的 pagePath
- 修正路径

**示例：**
```
[ERROR] pagePath "pages/error/error" not found
→ 从 app.json 中移除无效的页面路径
```

## 自动执行流程

```
1. 读取 COMPILE_LOG.md
   ↓
2. 解析错误类型和位置
   ↓
3. 匹配修复规则
   ↓
4. 生成修复方案
   ↓
5. 应用修复（修改文件）
   ↓
6. 清空 COMPILE_LOG.md（标记已处理）
   ↓
7. 通知用户重新编译验证
```

## 日志格式

COMPILE_LOG.md 应使用以下格式：

```markdown
# ==================== 编译日志开始 ====================

[2026-02-13 20:30:00] 编译开始...
[ERROR] pages/index/index.js:15 - SyntaxError: missing ) after argument list
[WARN] pages/index/index.wxss:23 - Property 'color' is deprecated
[SUCCESS] 编译成功，耗时 1250ms

# ==================== 编译日志结束 ====================
```

## 优先级

1. **高优先级** - 语法错误、引用错误（阻止编译）
2. **中优先级** - 类型错误、API 错误（影响功能）
3. **低优先级** - 警告信息（不影响运行）

## 注意事项

- 自动修复前会先备份原文件
- 无法自动修复的错误会提示用户手动处理
- 复杂错误需要用户确认后再修复
