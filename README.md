# TRIZ 答案之书

一款帮助用户使用 TRIZ 九宫格法结构化分析问题、识别矛盾并智能推荐创新原理的微信小程序。

## ✨ 主要功能

- 📝 **智能问卷引导** - 9 向导式问题填充九宫格，AI 根据上下文生成个性化引导提示
- 🔲 **九宫格编辑** - 可视化展示并编辑九宫格数据（核心问题 + 时间/系统维度）
- ⚡ **矛盾自动提取** - 自动识别 16 组技术矛盾（12 组相邻 + 4 组核心对角线）
- 🧠 **原理智能推荐** - 基于 AI 分析矛盾，推荐最适用的 TRIZ 40 个发明原理
- 💡 **方案生成与保存** - 组合原理生成解决方案，支持保存、修改和删除
- 📚 **知识库自学习** - 记录用户方案，优化未来推荐


## 🚀 快速开始

### 前置要求

- [Node.js >= 16.0.0](https://nodejs.org/)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [NVIDIA API Key](https://build.nvidia.com/)

### 获取 NVIDIA API Key

1. 访问 [NVIDIA Build](https://build.nvidia.com/) 并注册/登录账户
2. 进入 **API Keys** 页面（或直接访问 https://build.nvidia.com/settings/api-keys）
3. 点击 **Generate API Key** 生成新密钥
4. 复制密钥（格式：`nvapi-xxxxxxxxxxxxxxxxxx`）

### 配置项目

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/triz-book.git
   cd Triz
   ```

2. **创建配置文件**
   ```bash
   # 复制配置模板
   cp pages/questionnaire/config.example.js pages/questionnaire/config.js
   ```

3. **填入您的 API Key**

    打开 `pages/questionnaire/config.js`，将第 4 行的占位符替换为您的真实密钥：
    ```javascript
    const API_CONFIG = {
      apiKey: 'nvapi-your-actual-key-here',  // 替换为您的真实密钥
      // ...
    };
    ```

4. **验证配置**
    - 在微信开发者工具中打开项目
    - 点击底部导航栏"首页" → "开始分析"
    - 使用问卷功能验证 API 连接是否正常

### 运行项目

1. 打开**微信开发者工具**
2. 点击 **导入**，选择项目根目录
3. AppID 填入您的微信小程序 AppID（或使用测试号）
4. **关闭域名检查**（仅开发环境需要）：
   - 点击右上角 **详情** 按钮
   - 切换到 **本地设置** 标签
   - ✅ 勾选 **"不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书"**
5. 点击 **编译** 运行

## 📁 项目结构

```
Triz/
├── app.js                          # 全局应用入口
├── app.json                        # 应用配置
├── .gitignore                      # Git 忽略文件
├── README.md                       # 本文件
│
├── pages/
│   ├── index/                      # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   │
│   ├── questionnaire/              # 问卷页面（AI 智能提示）
│   │   ├── questionnaire.js
│   │   ├── questionnaire.wxml
│   │   ├── questionnaire.wxss
│   │   ├── questionnaire.json
│   │   ├── config.example.js       # ⚠️ 配置模板（提交到 Git）
│   │   └── config.js               # ⚠️ 真实配置（在 .gitignore 中）
│   │
│   ├── grid/                       # 九宫格编辑
│   │   ├── grid.js                 # 矛盾对计算逻辑
│   │   ├── grid.wxml
│   │   ├── grid.wxss
│   │   └── grid.json
│   │
│   ├── conflicts/                  # 矛盾可视化
│   │   ├── conflicts.js
│   │   ├── conflicts.wxml
│   │   ├── conflicts.wxss
│   │   └── conflicts.json
│   │
│   ├── solutions/                  # 解决方案生成
│   │   ├── solutions.js            # TRIZ 原理推荐
│   │   ├── solutions.wxml
│   │   ├── solutions.wxss
│   │   └── solutions.json
│
├── docs/                           # 项目文档
│   ├── API_SETUP.md                # API 配置说明
│   ├── NVIDIA API配置指南.md       # NVIDIA API 详细指南
│   ├── 配置完成清单.md              # 配置检查清单
│   ├── 快速解决域名检查问题.md      # 域名问题解决
│   ├── P3 【设计】需求文档（Triz答案之书）.md
│   └── AGENTS.md                   # 开发者指南
│
├── .build/                         # 自动修复配置
│   └── AUTO_FIX_CONFIG.md          # 编译错误自动修复规则
│
└── images/                         # 静态图片资源
```

## 📖 功能说明

### 1. 问卷模块

**流程**：
1. 用户从核心问题开始回答
2. 根据时间（过去/当前/未来）和系统层次（超系统/系统/子系统）逐步深入
3. AI 根据已回答的问题生成个性化引导提示
4. 支持返回修改和最终九宫格编辑

**AI 智能提示特点**：
- 结合前序答案生成上下文相关的引导
- 语气友好自然，像对话一样
- 可随时切换测试模式（使用模拟响应）

### 2. 矛盾提取模块

**矛盾类型**：
- **12 组相邻矛盾**：九宫格横向和纵向相邻格子
- **4 组核心矛盾**：中心格与四个对角格

**可视化**：
- 用颜色标识矛盾重要程度（绿→红）
- 点击查看详细矛盾描述（AI 生成解析）

### 3. 解决方案模块

**TRIZ 40 个原理**：
内置经典发明原理，包括分割、抽取、预先作用、反馈等

**推荐流程**：
1. 选择一对矛盾
2. AI 分析矛盾特征，推荐 3-5 个最适用的原理
3. 用户可手动添加或删除原理
4. 基于选中原理生成解决方案草案
5. 保存、修改或删除解决方案

### 4. 知识库自学习

- 记录用户保存的"矛盾-原理"配对
- 相似矛盾优先推荐历史使用过的原理
- 数据存储在微信本地存储中

## 🔧 配置选项

### 模型选择

在 `config.js` 中选择不同的模型：

| 模型 | ID | 特点 | 推荐度 |
|------|--------|------|--------|
| **Llama 3.1 70B** | `meta/llama-3.1-70b-instruct` | 性能强，性价比高 | ⭐⭐⭐⭐⭐ |
| **Llama 3.1 405B** | `meta/llama-3.1-405b-instruct` | 最强性能 | ⭐⭐⭐⭐⭐ |
| **Llama 3 70B** | `meta/llama-3-70b-instruct` | 成熟稳定 | ⭐⭐⭐⭐ |
| **Mistral 7B** | `mistralai/mistral-7b-instruct-v0.3` | 响应快速 | ⭐⭐⭐ |
| **Command R Plus** | `cohere/command-r-plus` | 多语言支持 | ⭐⭐⭐⭐ |

### 测试模式

在 `config.js` 中设置 `TEST_MODE.enabled = true`，可以使用模拟响应，节省 API 调用量。问卷页面底部有开关可以实时切换。

## ⚠️ 重要提示

### API Key 安全

- ⚠️ **切勿将真实 API Key 提交到 Git 仓库**
- `pages/questionnaire/config.js` 已加入 `.gitignore`，不会被提交
- 每个开发者需配置自己的 API Key
- 如不慎误提交，请撤销提交并在 NVIDIA 控制台重置密钥

### 生产环境配置

提交审核或发布前，必须在微信公众平台配置域名白名单：

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 **开发 > 开发管理 > 开发设置 > 服务器域名**
3. 在 **request 合法域名** 中添加：
   ```
   https://integrate.api.nvidia.com
   ```
4. 在 `project.config.json` 中设置 `"urlCheck": true`
5. 取消勾选"不校验合法域名..."选项

### NVIDIA API 计费

- NVIDIA API 提供免费额度
- 超出免费额度后按 Token 使用量计费
- 建议优先使用 Llama 3.1 70B（性价比最高）
- 定期访问 [NVIDIA Usage Dashboard](https://build.nvidia.com/) 查看使用量

预估费用（每次提示约消耗 100-150 Token）：
| 模型 | 每 1K Token 费用 |
|------|-----------------|
| Llama 3.1 70B | $0.00070 |
| Llama 3.1 405B | $0.00135 |
| Mistral 7B | $0.00006 |

## 🛠️ 开发指南

### 自动化编译与修复

本项目集成了 `miniprogram-ci` 自动化工具，支持命令行编译和错误自动修复。

#### 编译项目

```bash
npm run build
```

编译结果：
- ✓ 成功：显示编译成功信息
- ✗ 失败：错误信息写入 `COMPILE_LOG.md`

#### 自动修复错误

```bash
npm run auto-fix
```

自动修复流程：
1. 读取 `COMPILE_LOG.md` 中的编译错误
2. 解析错误类型和位置
3. 尝试自动修复常见错误（如移除无效页面引用）
4. 修复完成后清空日志

#### 完整工作流

```bash
# 1. 编译项目
npm run build

# 2. 如果有错误，自动修复
npm run auto-fix

# 3. 重新编译验证
npm run build
```

详细说明请参阅 [BUILD_AND_FIX.md](docs/BUILD_AND_FIX.md)

### 编译结果反馈

微信小程序编译后的错误/警告信息保存在 `COMPILE_LOG.md` 中。开发时请遵循以下流程：

1. 使用微信开发者工具编译项目
2. 复制控制台中的错误、警告或编译信息
3. 粘贴到 `COMPILE_LOG.md` 并保存
4. 当需要 AI 代理协助时，提及"读取编译日志"，代理会自动读取 `COMPILE_LOG.md`

### 代码规范

详细编码规范请查看 [AGENTS.md](docs/AGENTS.md)

### 页面结构

每个小程序页面包含 4 个文件：
- `.js` - 页面逻辑
- `.json` - 页面配置
- `.wxml` - 页面结构
- `.wxss` - 页面样式

### 状态管理

- **页面状态**：使用 `this.data` 和 `this.setData()`
- **全局状态**：使用 `app.globalData`（在 `app.js` 中定义）
- **持久化存储**：使用 `wx.setStorageSync` 和 `wx.getStorageSync`

### API 调用

使用 NVIDIA API 生成 AI 内容（详细示例见代码）：
```javascript
wx.request({
  url: API_CONFIG.apiUrl,
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.apiKey}`
  },
  data: {
    model: API_CONFIG.model,
    messages: [...],
    max_tokens: 150,
    temperature: 0.7
  },
  success: (res) => { /* 处理响应 */ }
});
```

## 📚 更多文档

- [API 配置指南](docs/API_SETUP.md) - API 配置详细说明
- [NVIDIA API 配置指南](docs/NVIDIA%20API配置指南.md) - NVIDIA API 完整文档
- [配置完成清单](docs/配置完成清单.md) - 配置检查清单
- [快速解决域名检查问题](docs/快速解决域名检查问题.md) - 域名问题解决
- [需求文档](docs/P3%20【设计】需求文档（Triz答案之书）.md) - 产品需求文档
- [AGENTS.md](docs/AGENTS.md) - 开发者指南

### 外部资源

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [NVIDIA AI 官网](https://www.nvidia.com/ai/)
- [NVIDIA Build 文档](https://build.nvidia.com/docs)
- [TRIZ 创新方法论简介](https://zh.wikipedia.org/wiki/TRIZ)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [NVIDIA](https://www.nvidia.com/) - 提供强大的 LLM API 服务
- [微信小程序](https://developers.weixin.qq.com/) - 提供优秀的小程序开发平台
- [TRIZ 创新理论](https://triz.org/) - 强大的问题分析与创新方法论

## 📮 联系方式

如有问题或建议，欢迎提交 Issue 或联系维护者。

---

⭐ 如果这个项目对您有帮助，请给一个 Star！
