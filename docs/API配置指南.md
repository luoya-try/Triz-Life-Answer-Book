# GLM-4 API 配置指南

## ✅ 已完成的更新

### API配置已更新为正确的格式

`pages/questionnaire/config.js`:
```javascript
const API_CONFIG = {
  apiKey: '7f09b44777cd47be83ce89334c254f44.kjaO0kCEbTQhebQ7',
  apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',  // 已更新
  model: 'glm-4',                                                   // 已更新
  timeout: 10000,
  maxRetries: 2
};
```

### 更新内容
- ✅ API端点: 使用正确的v4 API端点
- ✅ 模型名称: `glm-4.7` → `glm-4`
- ✅ 请求格式: 符合智谱AI标准格式
- ✅ 域名检查: 已在项目配置中关闭

---

## 🔑 获取有效的API密钥

### 步骤1：注册/登录智谱AI

1. 打开 https://open.bigmodel.cn/
2. 使用手机号注册账户
3. 完成实名认证（可能需要）

### 步骤2：获取API密钥

1. 登录后进入 **控制台**
2. 找到 **API密钥管理**
3. 点击 **创建新的API KEY**
4. 复制生成的密钥
   - 格式如：`xxxxxxxxx.xxxxxxxxxxxxx`

---

## 🔧 更新API密钥

### 方法1：手动编辑（推荐）

1. 打开文件：`pages/questionnaire/config.js`
2. 找到第4行的 `apiKey`
3. 替换为您的真实密钥

```javascript
const API_CONFIG = {
  apiKey: '您的真实API密钥',  // 替换这里
  // ...
};
```

4. 保存文件
5. 在微信开发者工具中点击 **编译**

### 方法2：告诉我您的密钥

您可以：
1. 将您的API密钥发送给我
2. 我会直接更新配置文件
3. 您重新编译项目

---

## 🧪 测试API连接

### 使用问卷功能测试

1. **编译项目**
   - 在开发者工具点击 **编译**

2. **打开问卷页面**
   - 进入"首页" → 点击"开始分析"

3. **测试 API**
   - 输入第一个问题答案
   - 点击"下一题"
   - 观察状态栏是否显示"✓ 真实AI已响应"

### 测试结果说明

#### ✅ 成功（状态码200）
```
✅ API调用成功！

状态码: 200

🤖 GLM-4回复：
我是一个基于GLM架构的大语言模型...

🎉 恭喜！API密钥配置正确！
```
**说明：配置完成，可以使用AI智能提示了！**

#### ❌ 失败（状态码401）
```
❌ 认证失败 (401)

可能原因：
1. API密钥无效或已过期
2. API密钥格式不正确

解决方法：
1. 访问 https://open.bigmodel.cn/
2. 登录后获取有效的API密钥
3. 更新 config.js 中的 apiKey
```
**说明：需要更新API密钥**

---

## 📊 API调用格式

### 请求格式
```json
POST https://open.bigmodel.cn/api/paas/v4/chat/completions
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "model": "glm-4",
  "messages": [
    {"role": "system", "content": "你是TRIZ专家"},
    {"role": "user", "content": "生成提示语"}
  ],
  "max_tokens": 150,
  "temperature": 0.7,
  "stream": false
}
```

### 响应格式（成功）
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "glm-4",
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

## 💡 使用说明

### 在问卷页面使用AI提示

1. 打开问卷页面
2. 关闭"智能提示"开关（切换到真实AI模式）
3. 回答问题
4. 系统会自动调用API生成个性化提示

### 测试模式 vs 真实模式

| 模式 | 说明 | 优点 | 缺点 |
|------|------|------|------|
| 测试模式 | 使用预设数据 | 无需API密钥，响应快 | 提示语不够个性化 |
| 真实模式 | 调用GLM-4 | 智能生成个性化提示 | 需要API密钥，消耗token |

---

## 🔍 常见问题

### Q1: 401认证失败

**原因**: API密钥无效

**解决**:
1. 确认密钥是否正确复制
2. 检查账户余额是否充足
3. 重新生成新的API密钥

### Q2: 仍然显示域名检查错误

**解决**:
1. 详情 > 本地设置 > 勾选"不校验合法域名..."
2. 工具 > 清缓存 > 清除全部缓存
3. 重启开发者工具

### Q3: API响应很慢

**原因**: 网络问题或服务器负载高

**解决**:
- 检查网络连接
- 稍后重试

---

## 📞 技术支持

- 智谱AI文档: https://open.bigmodel.cn/docs/
- 微信小程序开发: https://developers.weixin.qq.com/

---

## 📝 注意事项

⚠️ **生产环境安全**
- 不要将真实API密钥提交到代码仓库
- 使用环境变量管理密钥
- 考虑使用后端代理

⚠️ **计费说明**
- GLM-4 API 按token计费
- 注意监控使用量
- 账户余额为0时会无法调用

---

祝您使用愉快！ 🎉
