# AGENTS.md

这是一个用于 TRIZ 问题分析的微信小程序。本文件为在此代码库中工作的智能编码代理提供指南。

## 构建/检查/测试命令

这是一个微信小程序项目，不使用 npm/node 工具。开发通过微信开发者工具 IDE 进行。

- 构建：使用微信开发者工具 -> 上传 或 预览
- 测试：通过微信开发者工具模拟器或真机调试进行手动测试
- 当前未配置自动化的代码检查和测试框架

## Build 模式自动修复

**场景**：当用户执行 `npm run build` 命令时，系统自动：

1. **编译项目**：使用 miniprogram-ci 编译小程序
2. **生成日志**：编译错误自动写入 `COMPILE_LOG.md`
3. **分析错误**：解析错误类型、文件路径、行号
4. **自动修复**：根据 `docs/AUTO_FIX_CONFIG.md` 中的规则执行修复
   - 语法错误：修复括号、引号、分号等
   - 引用错误：添加变量声明、修正拼写
   - 类型错误：添加空值检查、类型转换
   - 微信 API 错误：修正参数、添加授权处理
   - WXML 绑定错误：修正数据绑定路径
   - 文件未找到：修正引用路径或移除无效引用
5. **验证修复**：重新编译并根据结果进行迭代

**修复配置**：详细规则见 `docs/AUTO_FIX_CONFIG.md`

**自动化工具**：
- `scripts/build.js` - 自动编译脚本
- `scripts/auto-fix.js` - 自动修复脚本
- `docs/BUILD_AND_FIX.md` - 完整使用指南

**执行流程**：
```
用户执行 npm run build
  ↓
使用 miniprogram-ci 编译
  ↓
有错误？
  ├─ 是 → 写入 COMPILE_LOG.md
  │       ↓
  │   用户执行 npm run auto-fix
  │       ↓
  │   应用修复规则 → 清空日志
  │       ↓
  │   提示重新编译
  └─ 否 → 编译成功，生成预览二维码
```

## 项目结构

```
app.js              # 全局应用入口，包含 App() 和 globalData
app.json            # 应用配置（页面、tabBar、窗口设置）
pages/              # 页面组件（每个页面包含 .js, .json, .wxml, .wxss）
images/             # 静态图片资源
```

## 代码规范指南

### 文件命名
- 页面：小写字母加连字符（如 `questionnaire`、`conflicts`）
- 每个页面有 4 个文件：`page.js`、`page.json`、`page.wxml`、`page.wxss`

### JavaScript（在 project.config.json 中启用 ES6）

**缩进**：2 个空格（不使用制表符）

**页面结构**：
```javascript
Page({
  data: {
    // 页面状态变量
  },

  onLoad: function() {
    // 页面初始化
  },

  onEventName: function(e) {
    // 事件处理函数
  }
});
```

**应用结构**：
```javascript
App({
  globalData: {
    // 全局共享状态
  },

  onLaunch: function() {
    // 应用启动
  },

  someMethod: function() {
    // 全局辅助方法
  }
});
```

**命名规范**：
- 函数：驼峰命名法（如 `calculateConflicts`、`generateSolution`）
- 变量/属性：驼峰命名法（如 `gridData`、`selectedConflict`）
- 常量：大写下划线分隔（如 `API_CONFIG`、`TEST_MODE`）
- 事件处理函数：以 `on` 开头（如 `onLoad`、`onInput`、`onCellInput`）

**数据更新**：使用 `this.setData({ key: value })` 进行响应式更新。切勿直接修改 `this.data`。

**访问全局数据**：使用 `const app = getApp(); app.globalData.someProperty`

**微信 API**：
- 导航：`wx.navigateTo({ url: '../page/page' })`
- 存储：`wx.setStorageSync('key', value)`、`wx.getStorageSync('key')`
- UI：`wx.showToast({ title: 'message', icon: '...' })`
- 网络：`wx.request({ url, method, header, data, success, fail })`

**错误处理**：
```javascript
try {
  // 操作
} catch (e) {
  console.error('错误描述:', e);
  // 降级处理
}
```

### WXML（标记语言）

**数据绑定**：使用 `{{variableName}}` 绑定文本内容
**事件绑定**：`bindtap="functionName"` 或 `bindinput="onInput"`
**数据属性**：`data-section="value"`，在处理函数中通过 `e.currentTarget.dataset.section` 访问

### WXSS（样式）

**单位**：使用 `rpx` 作为响应式单位（1rpx = 750px 宽度屏幕上的 0.5px）
**颜色**：十六进制格式（如 `#52c41a`、`#f5f5f5`）
**Flexbox**：主要布局系统（如 `display: flex`、`flex-direction: column`）
**类名**：短横线分隔（如 `.grid-container`、`.cell-title`）

### 注释

- 语言：中文
- 格式：行内注释使用 `//`
- 在复杂逻辑块上方描述其用途

### 常量配置

API 密钥和配置在模块级别定义（如 `API_CONFIG`、`TEST_MODE`）。

### ⚠️ 配置文件安全（重要）

**敏感配置文件已在 `.gitignore` 中排除：**
- `pages/questionnaire/config.js` - 包含真实 API Key，已加入 `.gitignore`
- `pages/questionnaire/config.example.js` - 配置模板，已提交到 Git（供其他开发者参考）

**注意事项：**
- ❌ **切勿** 将真实的 API Key 提交到 Git 仓库
- ✅ 新开发者需复制 `config.example.js` 为 `config.js` 并填入自己的 API Key
- ✅ 如不慎提交了包含真实 Key 的 `config.js`，请立即：
  1. 撤销提交或移除文件
  2. 在 NVIDIA 控制台重置 API Key
- ✅ 生产环境部署时，建议使用环境变量或后端代理服务

### 状态管理

- 本地状态：页面的 `data` 对象，通过 `setData` 更新
- 全局状态：app.js 中的 `app.globalData`
- 持久化：使用微信存储保存知识库

### 事件处理模式

```javascript
onEventName: function(e) {
  const { dataKey } = e.currentTarget.dataset;
  const value = e.detail.value;
  // 处理并更新状态
  this.setData({ someKey: value });
}

---

## 🚨 P0级工作流程：Mock测试规则

**规则优先级**: P0（必须遵守）

### 核心规则
> **每次修改涉及以下3个核心功能的代码后，必须：**
> 1. 开启Mock测试
> 2. 完整测试专业版和生活版的3个模块
> 3. 测试通过后**必须关闭Mock**
> 4. 进行语法检查
> 5. 只有以上全部完成后才能提交代码

### 3个核心功能模块
1. **问卷页面** (`pages/questionnaire/questionnaire.js`)
2. **矛盾提取** (`pages/conflicts/conflicts.js`)
3. **解决方案** (`pages/solutions/solutions.js`)

### Mock配置位置
```javascript
文件: pages/questionnaire/config.js
行号: 34
配置: TEST_MODE.enabled (true=开启, false=关闭)
```

### 完整工作流程

**步骤1: 开启Mock**
```bash
修改 pages/questionnaire/config.js 第34行:
enabled: true,
```

**步骤2: 测试专业版**
- [ ] 测试问卷 - AI提示生成、文案显示
- [ ] 测试矛盾提取 - 矛盾描述生成、数据格式
- [ ] 测试解决方案 - 原理推荐、方案生成

**步骤3: 测试生活版**
- 切换到生活版（在个人中心页面）
- [ ] 测试问卷 - 生活版question load、lifestyle prompts
- [ ] 测试矛盾提取 - 生活版JSON格式（4个字段）
- [ ] 测试解决方案 - 行动地图生成（4部分）

**步骤4: 关闭Mock**（重要！）
```bash
修改 pages/questionnaire/config.js 第34行:
enabled: false,
```

**步骤5: 语法检查**
```bash
node -c pages/questionnaire/questionnaire.js
node -c pages/conflicts/conflicts.js
node -c pages/solutions/solutions.js
node -c utils/lifestyleConfig.js
node -c utils/lifestylePrompts.js
node -c utils/lifestylePrinciples.js
```

**步骤6: 提交代码**
```bash
# 确认Mock已关闭后再提交
git status
git commit -m "feat: xxx"
```

### 常见错误
- ❌ 忘记关闭Mock就提交（生产环境使用假数据）
- ❌ 只测试一个版本（另一个版本功能被破坏）
- ❌ 只测试部分模块（其他模块存在未发现的问题）
- ❌ 未进行语法检查（编译错误）

### 快速命令
```bash
# 开启Mock
sed -i 's/enabled: false/enabled: true/' pages/questionnaire/config.js

# 关闭Mock
sed -i 's/enabled: true/enabled: false/' pages/questionnaire/config.js

# 批量语法检查
for f in pages/questionnaire/questionnaire.js pages/conflicts/conflicts.js pages/solutions/solutions.js utils/lifestyle*.js; do node -c $f && echo "✅ $f"; done
```

**详细文档**: 见 `docs/MOCK Testing Workflow规范.md`

---

## 🚨 ✅ 任务完成强制检查清单（P0级）

### 适用场景
**每次修改以下文件时，必须执行本清单：**
- `pages/questionnaire/questionnaire.js`
- `pages/conflicts/conflicts.js`
- `pages/solutions/solutions.js`
- `utils/lifestyleConfig.js`
- `utils/lifestylePrompts.js`
- `utils/lifestylePrinciples.js`

### 强制检查流程（必须按顺序执行）

**步骤1: 语法检查**
```bash
# 必须全部通过，有任何错误不能继续
node -c pages/questionnaire/questionnaire.js
node -c pages/conflicts/conflicts.js
node -c pages/solutions/solutions.js
node -c utils/lifestyleConfig.js
node -c utils/lifestylePrompts.js
node -c utils/lifestylePrinciples.js
```

**步骤2: Mock状态检查（关键步骤）**
```bash
# 检查Mock是否关闭
grep "enabled" pages/questionnaire/config.js

# 必须看到：enabled: false
# 如果看到：enabled: true ❌ 不能告知用户"任务完成"
```

**步骤3: 确认用户已测试（如果Mock已开启）**
```bash
# 如果Mock是开启状态，必须询问用户：
"检测到Mock模式未关闭。请先测试3个核心功能：
1. 问卷模块（专业版 + 生活版）
2. 矛盾提取模块（专业版 + 生活版）
3. 解决方案模块（专业版 + 生活版）

测试完成后，告知我'测试完成'，我会立即关闭Mock。"
```

**步骤4: 关闭Mock（如果用户确认测试完成）**
```bash
# 用户确认后，立即执行
sed -i 's/enabled: true/enabled: false/' pages/questionnaire/config.js

# 重新检查确认
grep "enabled" pages/questionnaire/config.js
```

**步骤5: 显示任务完成状态**
```
✅ 语法检查：通过
✅ Mock状态：enabled: false (已关闭)
✅ 3个模块测试：完成（用户确认）
✅ 任务完成：可以提交代码
```

### ❌ 严禁的行为

1. **严禁**在Mock开启时告知用户"任务完成"
2. **严禁**跳过Mock状态检查直接提示"可以提交"
3. **严禁**在用户未确认测试完成的情况下关闭Mock
4. **严禁**在语法检查未通过时进入Mock检查环节

### AI助手的自我约束（必须遵守）

**当修改完上述文件后，我的行为流程：**

```
修改代码
  ↓
运行语法检查
  ├─ 失败 → 修复错误 → 重新检查
  └─ 通过 ✓
  ↓
检查Mock状态
  ├─ enabled: true ✓
  │   ↓
  │   询问用户："检测到Mock未关闭，是否已完成3个模块测试？"
  │   ├─ 否 → 提醒测试 → 等待用户确认
  │   └─ 是 → 关闭Mock → 再次检查Mock状态
  └─ enabled: false ✓
  ↓
显示任务完成状态（必须包含Mock状态）
✅ 语法检查：通过
✅ Mock状态：enabled: false
✅ 任务完成
```

### 异常处理协议

**如果我发现自己刚才违反了规则（已经说了"完成"但Mock未关闭）：**

1. **立即承认错误**
   ```
   我发现了一个严重错误：我刚才虽然完成了代码修改，但未关闭Mock。
   这是违反规则的，我现在立即修正。
   ```

2. **立即执行修正**
   ```bash
   1. 关闭Mock
   2. 重新检查确认
   3. 向用户确认已修正
   ```

3. **原因分析（如本次）**
   - 为什么会犯这个错误？
   - 如何避免再次发生？
   - 建议的改进措施

### 紧急检查命令（发现可疑情况时使用）

```bash
# 一键检查所有关键状态
echo "=== Mock状态 ==="
grep "enabled" pages/questionnaire/config.js
echo -e "\n=== 语法检查 ==="
for f in pages/questionnaire/questionnaire.js pages/conflicts/conflicts.js pages/solutions/solutions.js utils/lifestyle*.js; do node -c $f 2>&1 && echo "✅ $f" || echo "❌ $f"; done
```

**这个清单的优先级高于其他所有规则。如果任何步骤未完成，不能宣称"任务完成"。**

---

## 🚨 📦 代码提交规则（P0级）

### 核心原则
> **绝对禁止AI主动执行git commit命令**
>
> **只有在用户明确说"提交代码"或类似指令时，才能执行提交**

### 适用场景
**任何可能涉及代码提交的情况：**
- ✅ 完成代码修改后的git操作
- ✅ 版本控制相关的命令执行
- ✅ 所有使用git命令的场景

### 提交流程（严格遵守）

**流程1: 用户明确要求提交**
```
用户指令："提交代码" / "commit" / "提交这次修改"
  ↓
AI执行：
  1. 检查Mock状态（必须是enabled: false）
  2. 检查git status（查看修改内容）
  3. 确认修改内容正确
  4. 执行git add
  5. 执行git commit（用户提供的commit message）
  6. 显示提交结果
```

**流程2: 用户未要求提交（AI主动询问）**
```
AI完成任务后：
  ↓
显示完成状态：
  ✅ 语法检查：通过
  ✅ Mock状态：enabled: false (已关闭)
  ✅ 任务完成

  ↓
❌ 绝对不能执行git commit

  ↓
询问用户：
  "代码已修改完成并测试通过，是否需要提交？"
```

**流程3: 用户说"不要提交"**
```
用户指令："不要提交" / "先不提交" / "我自己提交"
  ↓
AI执行：
  ✅ 完成所有代码修改
  ✅ 完成所有测试和检查
  ✅ 显示完成状态
  ❌ 绝对不执行任何git命令
  ⏸️ 等待用户下一步指令
```

### ❌ 严禁的行为

1. **严禁**在没有收到用户明确提交指令时执行git commit
2. **严禁**在任务完成时自动执行git add和git commit
3. **严禁**在用户说"不要提交"后仍然尝试提交
4. **严禁**在Mock未关闭时执行任何git提交相关操作
5. **严禁**在语法检查未通过时询问用户是否提交

### ✅ 允许的操作

1. ✅ **允许**查看git状态（git status）
2. ✅ **允许**查看git差异（git diff）
3. ✅ **允许**显示修改的文件列表
4. ✅ **允许**询问用户"是否需要提交"
5. ✅ **允许**在用户明确要求后执行git add和git commit

### 提交前安全检查（用户要求提交时必须执行）

**步骤1: Mock状态检查**
```bash
grep "enabled" pages/questionnaire/config.js
# 必须看到：enabled: false
# 如果看到：enabled: true → 拒绝提交，提醒用户关闭Mock
```

**步骤2: 修改内容确认**
```bash
git status
# 向用户展示修改内容，确认无误后再提交
```

**步骤3: 语法检查确认**
```bash
# 必须确认所有修改文件语法检查通过
```

**步骤4: 执行提交**
```bash
git add .
git commit -m "用户提供的commit message"
```

### 对话示例

**示例1: 完成任务，询问用户**
```
AI: ✅ 已完成代码修改
    ✅ 语法检查：通过
    ✅ Mock状态：enabled: false

    代码已准备就绪，是否需要提交？

用户: 提交
AI: ✓ 正在提交...
    ✓ 提交完成
    ✓ Commit: [提交信息]
```

**示例2: 用户明确要求不要提交**
```
用户: 完成这个功能，但不要提交
AI: ✓ 功能已完成
    ✓ 语法检查：通过
    ✓ Mock状态：enabled: false

    代码已准备好，未执行git提交操作。
    等待您下一步指令。
```

**示例3: 用户要求提交，但发现未关闭Mock**
```
用户: 提交代码
AI: ❌ 无法提交
    原因：检测到Mock模式未关闭（enabled: true）

    请先关闭Mock：
    sed -i 's/enabled: true/enabled: false/' pages/questionnaire/config.js

    关闭后，重新告知我"提交"，我会立即提交。
```

### 关键识别词（用户提交意图）

**明确的提交指令**：
- "提交代码"
- "commit"
- "提交这次修改"
- "提交更新"
- "保存并提交"
- "帮我提交"

**明确的不提交指令**：
- "不要提交"
- "先不提交"
- "我自己提交"
- "别提交"
- "不commit"

### AI自我约束规则

**当完成任务后，我的行为：**

```
任务完成
  ↓
显示完成状态
  ├─ ❌ 不能执行git commit
  ├─ ❌ 不能执行git add
  └─ ✅ 只能询问："是否需要提交？"
  ↓
等待用户回复
  ├─ "提交" → 执行检查 → 提交
  ├─ "不要提交" → 不执行任何git命令
  └─ 其他指令 → 按用户要求执行
```

### 异常处理

**如果我发现自己不小心尝试提交了：**

1. **立即停止**
   ```
   ⚠️ 检测到我在尝试执行git提交，但用户未明确要求。
   正在停止... 已停止。
   ```

2. **承认错误**
   ```
   我试图在没有收到明确提交指令的情况下提交代码。
   这是违反规则的，我不会执行提交操作。
   ```

3. **等待用户指令**
   ```
   代码已修改并检查完毕。
   您可以：
   - 说"提交代码"让我提交
   - 说"不要提交"让我不提交
   - 或给出其他指令
   ```

### 紧急命令（防止误操作）

**如果需要查看当前状态而不提交：**
```bash
git status          # 查看修改状态
git diff            # 查看具体修改
git diff --cached   # 查看已暂存的修改
```

**这个规则的优先级：P0级别，与任务完成强制检查清单同等重要。**

---

## 🔄 完整工作流程（整合以上所有规则）

```
用户要求修改代码
  ↓
修改代码
  ↓
语法检查
  ├─ 失败 → 修复 → 重新检查
  └─ 通过 ✓
  ↓
检查Mock
  ├─ enabled: true → 询问用户测试 → 关闭Mock
  └─ enabled: false ✓
  ↓
显示完成状态
  ✅ 语法检查：通过
  ✅ Mock状态：enabled: false
  ✅ 任务完成

  ↓
❌ 绝对不能执行git commit

  ↓
询问用户："是否需要提交？"
  ↓
用户回复
  ├─ "提交代码" → 检查Mock → git add → git commit → 显示结果
  ├─ "不要提交" → 不执行git命令 → 等待下一步
  └─ 其他指令 → 按用户要求执行
```

**记住：只有用户明确说"提交代码"，才能执行提交操作！**

```

