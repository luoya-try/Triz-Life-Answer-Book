# API 配置说明

## 已完成的配置

### 1. 项目配置已更新
- ✅ `project.config.json` 中 `urlCheck` 已设置为 `false`
- ✅ 开发时不再检查域名白名单

### 2. 文件结构
```
pages/questionnaire/
├── config.js           # API 配置（密钥、端点）
├── questionnaire.js    # 页面逻辑
├── questionnaire.wxml  # 页面结构
├── questionnaire.wxss  # 页面样式
└── questionnaire.json  # 页面配置
```

## 使用说明

### 开发调试步骤

1. **重新编译项目**
   - 在微信开发者工具中，点击 **编译** 按钮
   - 或按快捷键 `Ctrl + B` (Windows) / `Cmd + B` (Mac)

2. **运行问卷页面**
   - 导航到问卷页面，应该能看到新的界面
   - 智能提示开关默认为"测试模式"

3. **切换到真实 AI 模式**
   - 点击底部的"智能提示"开关
   - 切换后会调用 GLM-4.7 API 生成个性化提示

### API 状态说明

状态栏会显示当前状态：
- `测试模式 - 模拟响应` - 使用预设的模拟数据
- `真实API模式 - 调用中...` - 正在调用真实 AI
- `✓ 真实AI已响应` - API 调用成功
- `网络失败，已切换测试模式` - 调用失败，自动回退

## 生产环境配置

### 重要提醒

⚠️ **提交审核或发布前，必须：**

1. 在微信公众平台配置域名：
   - 登录 https://mp.weixin.qq.com/
   - 开发 > 开发管理 > 开发设置 > 服务器域名
   - 在 `request合法域名` 添加: `https://open.bigmodel.cn`

2. 验证域名配置：
   ```json
   // project.config.json 中设置
   "urlCheck": true
   ```

3. 或使用 HTTPS 代理（不推荐，仅临时测试）

## 测试 API 连接

### 快速测试

在问卷页面：
1. 输入第一个问题答案（如"电池续航短"）
2. 点击"下一题"
3. 观察状态栏显示
4. 系统会自动调用 API 生成第二题的提示语

### 调试日志

在微信开发者工具控制台查看：
```
调用GLM4.7 API: ...
API响应: ...
```

## 常见问题

### Q1: 仍然显示"request:fail url not in domain list"

**解决方案：**
- 确保项目已重新编译
- 清除缓存：工具 > 清缓存 > 清除全部缓存
- 检查 `project.config.json` 中 `urlCheck` 是否为 `false`

### Q2: API 调用成功但返回内容为空

**可能原因：**
- API 密钥无效或过期
- 账户余额不足
- 网络问题

**检查方法：**
- 访问 https://open.bigmodel.cn/ 查看账户状态
- 在控制台查看详细的错误信息

### Q3: 如何使用自己的 API 密钥？

修改 `pages/questionnaire/config.js`:
```javascript
const API_CONFIG = {
  apiKey: 'your-actual-api-key-here',
  // ...
};
```

## API 密钥安全

⚠️ **不要将生产环境的 API 密钥提交到代码仓库！**

建议方案：
1. 使用环境变量
2. 或后端代理转发
3. 或使用服务端签名

## 技术支持

- 智谱AI API 文档: https://open.bigmodel.cn/
- 微信小程序开发文档: https://developers.weixin.qq.com/miniprogram/dev/framework/
