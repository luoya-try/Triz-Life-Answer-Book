# NVIDIA API 配置指南

## ✅ 已完成的配置

### API配置文件已更新

`pages/questionnaire/config.js`:
```javascript
const API_CONFIG = {
  apiKey: 'nvapi-xxxx',              // 请替换为您的 NVIDIA API Key
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  model: 'meta/llama-3.1-70b-instruct',  // 默认使用 Llama 3.1 70B
  timeout: 10000,
  maxRetries: 2
};
```

### 支持的模型

| 模型 | 型号ID | 特点 | 推荐度 |
|------|--------|------|--------|
| **Llama 3.1 70B** | `meta/llama-3.1-70b-instruct` | 性能强大，性价比高 | ⭐⭐⭐⭐⭐ |
| **Llama 3.1 405B** | `meta/llama-3.1-405b-instruct` | 最强性能 | ⭐⭐⭐⭐⭐ |
| **Llama 3 70B** | `meta/llama-3-70b-instruct` | 成熟稳定 | ⭐⭐⭐⭐ |
| **Mistral 7B** | `mistralai/mistral-7b-instruct-v0.3` | 响应快速 | ⭐⭐⭐ |
| **Command R Plus** | `cohere/command-r-plus` | 多语言支持 | ⭐⭐⭐⭐ |

---

## 🔑 获取 NVIDIA API 密钥

### 步骤1：注册/登录 NVIDIA Build

1. 打开 https://build.nvidia.com/
2. 点击 **Sign In** 或 **Sign Up**
3. 注册 NVIDIA 账户
4. 完成邮箱验证

### 步骤2：获取 API Key

1. 登录后进入 **API Keys** 页面
   - 或访问: https://build.nvidia.com/settings/api-keys
2. 点击 **Generate API Key**
3. 复制生成的密钥
   - 格式如：`nvapi-xxxxxxxxxxxxxxxxxx`

### 步骤3：配置密钥

#### 方法1：手动编辑（推荐）

1. 打开文件：`pages/questionnaire/config.js`
2. 找到第4行的 `apiKey`
3. 替换为您的真实密钥

```javascript
const API_CONFIG = {
  apiKey: 'nvapi-your-actual-key-here',  // 替换这里
  // ...
};
```

4. 保存文件
5. 在微信开发者工具中点击 **编译**

#### 方法2：告诉我密钥

您可以将您的NVIDIA API密钥发送给我，我会直接更新配置文件。

---

## 🧪 测试 API 连接

### 使用问卷功能测试

1. **编译项目**
   - 在微信开发者工具点击 **编译**

2. **打开问卷页面**
   - 进入"首页" → 点击"开始分析"

3. **测试 API**
   - 输入第一个问题答案
   - 点击"下一题"
   - 观察状态栏是否显示"✓ 真实AI已响应"

### 测试结果说明

#### ✅ 成功（状态码200）
```
✅ NVIDIA API 调用成功！

🤖 模型回复：
我是Llama 3.1，一个由Meta开发的大语言模型...

📊 使用统计：
- 输入Token: 45
- 输出Token: 68
- 总Token: 113

🎉 配置成功！可以使用AI智能提示了！
```

#### ❌ 失败（状态码401）
```
❌ 认证失败 (401)

可能原因：
1. API密钥无效
2. API密钥格式不正确

解决方法：
1. 访问 https://build.nvidia.com/
2. 登录后获取有效的API密钥
3. 更新 config.js 中的 apiKey

当前密钥前缀：
nvapi-xxxxxxxxx...
```

---

## 📊 API 调用格式

### 请求格式
```json
POST https://integrate.api.nvidia.com/v1/chat/completions
Authorization: Bearer nvapi-your-key
Content-Type: application/json

{
  "model": "meta/llama-3.1-70b-instruct",
  "messages": [
    {"role": "system", "content": "你是TRIZ专家"},
    {"role": "user", "content": "生成提示语"}
  ],
  "max_tokens": 150,
  "temperature": 0.7,
  "top_p": 0.7,
  "stream": false
}
```

### 响应格式（成功）
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "meta/llama-3.1-70b-instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "您刚才提到..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150
  }
}
```

---

## 🎯 切换模型

### 步骤1：选择模型

在 `config.js` 中查看 `MODEL_OPTIONS`：

```javascript
const MODEL_OPTIONS = {
  llama_3_1_70b: 'meta/llama-3.1-70b-instruct',      // Llama 3.1 70B 推荐
  llama_3_1_405b: 'meta/llama-3.1-405b-instruct',    // Llama 3.1 405B 最强
  llama_3_70b: 'meta/llama-3-70b-instruct',           // Llama 3 70B
  mistral_7b: 'mistralai/mistral-7b-instruct-v0.3',   // Mistral 7B 快速
  cohere_command_r: 'cohere/command-r-plus'           // Command R Plus
};
```

### 步骤2：修改配置

打开 `pages/questionnaire/config.js`：

```javascript
const API_CONFIG = {
  apiKey: 'nvapi-your-key',
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  model: 'mistralai/mistral-7b-instruct-v0.3',  // 修改这里
  // ...
};
```

### 步骤3：编译测试

保存文件后，在开发者工具点击 **编译**，然后测试API。

---

## 💡 使用说明

### 在问卷页面使用AI提示

1. 打开问卷页面
2. 关闭"智能提示"开关（切换到真实AI模式）
3. 回答问题
4. 系统会自动调用NVIDIA API生成个性化提示

### 模型选择建议

| 使用场景 | 推荐模型 | 原因 |
|----------|----------|------|
| 生产环境 | Llama 3.1 70B | 性能强，响应快，性价比高 |
| 最佳效果 | Llama 3.1 405B | 最强的推理能力 |
| 快速响应 | Mistral 7B | 模型小，速度快 |
| 多语言 | Command R Plus |出色的多语言支持 |

---

## 🔍 常见问题

### Q1: 401认证失败

**原因**: API密钥无效

**解决**:
1. 确认密钥格式是否正确（`nvapi-` 开头）
2. 检查是否复制完整
3. 登录 https://build.nvidia.com/ 确认密钥状态

### Q2: 仍然显示域名检查错误

**解决**:
1. 详情 > 本地设置 > 勾选"不校验合法域名..."
2. 工具 > 清缓存 > 清除全部缓存
3. 重启开发者工具

### Q3: 账户余额不足

**说明**: NVIDIA API 有免费额度，用完后需要升级

**解决**:
1. 登录 https://build.nvidia.com/
2. 查看账户状态
3. 如需升级，联系 NVIDIA

### Q4: 如何查看使用量

1. 登录 https://build.nvidia.com/
2. 查看 **Usage** 或 **Usage Dashboard**
3. 可以看到 token 使用量和费用

---

## 📞 技术支持

- NVIDIA AI 官网: https://www.nvidia.com/ai/
- NVIDIA Build 文档: https://build.nvidia.com/docs
- API 参考文档: https://build.nvidia.com/meta/llama-3.1-70b-instruct

---

## ⚠️ 注意事项

### 安全性
- 不要将真实API密钥提交到代码仓库
- 使用环境变量管理密钥
- 考虑使用后端代理

### 计费说明
- NVIDIA API 有免费额度
- 超出免费额度后按使用量计费
- 不同模型费率不同
- 建议使用 Llama 3.1 70B（性价比高）

### 性能优化
- `temperature`: 0.7（推荐），越低越保守，越高越随机
- `max_tokens`: 150（对话类），可根据需要调整
- `top_p`: 0.7（推荐），控制采样范围

---

## 🎉 开始使用

完成配置后：

1. **编译项目**
2. **测试API**
3. **在问卷中体验AI智能提示**

祝您使用愉快！ 🚀
