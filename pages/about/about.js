// pages/about/about.js

// 隐私政策内容
const PRIVACY_CONTENT = `隐私政策

生效日期：2026年2月18日

《TRIZ答案之书》（以下简称"本小程序"）由个人开发者提供。我们重视用户的隐私保护，本隐私政策说明我们如何收集、使用、存储和保护您的信息。

1. 我们收集的信息

1.1 您主动提供的信息
- 九宫格问题数据：您在问卷中填写的问题描述、分析内容
- 解决方案记录：您保存的创新方案
- 使用偏好：主题风格选择、版本选择

1.2 自动收集的信息
- 本地存储数据：您的历史记录、保存在本地的设置
- 使用统计数据：功能使用频率、页面访问记录

1.3 第三方服务收集的信息
- NVIDIA API：当您使用AI功能时，您的输入内容会发送到NVIDIA API进行处理。

2. 我们如何使用您的信息
- 提供AI分析服务
- 保存您的历史记录
- 优化产品体验

3. 我们如何存储和保护您的信息
- 本地数据仅存储在您的设备上
- API传输使用HTTPS加密
- 我们不会出售您的个人信息给任何第三方

4. 您的权利
根据《个人信息保护法》，您享有以下权利：
- 知情权
- 删除权（在"个人中心"清空数据）
- 撤回同意

5. 联系我们
如您对本隐私政策有任何疑问，请通过小程序内反馈功能联系。

声明：本小程序使用的AI服务由NVIDIA提供，其数据处理受NVIDIA隐私政策约束。`;

// 用户协议内容
const AGREEMENT_CONTENT = `用户服务协议

生效日期：2026年2月18日

重要提示：请在使用《TRIZ答案之书》小程序前仔细阅读本协议。

1. 服务说明

本小程序是一款基于TRIZ创新方法论的问题分析工具，帮助用户：
- 结构化分析问题（九宫格法）
- 识别和分析矛盾
- 获得创新原理推荐和解决方案建议

服务性质：本小程序提供的是工具和服务，不构成专业咨询。

2. 使用条款

2.1 使用许可
在您遵守本协议的前提下，我们授予您：
- 非独占、不可转让的使用许可
- 仅限个人非商业目的使用

2.2 使用限制
您不得：
- 将本小程序用于任何违法目的
- 试图篡改、破解或干扰本小程序的正常运行
- 复制、修改、分发本小程序的代码或内容

3. AI服务免责声明

3.1 服务依赖
本小程序的AI功能依赖第三方服务（NVIDIA API），我们不保证：
- 服务的持续可用性
- AI生成内容的准确性、完整性或实用性

3.2 风险提示
- AI生成的内容可能包含错误或不准确信息
- 重要决策请咨询专业人士

4. 知识产权
- 本小程序代码、设计：开发者所有
- TRIZ理论、方法论：公有领域
- 您填写的分析内容：您个人所有

5. 责任限制
在法律允许的最大范围内，我们不承担因使用本小程序导致的任何损失或损害。

6. 争议解决
双方友好协商；协商不成，提交至中国国际经济贸易仲裁委员会。

使用本小程序即表示您已阅读并同意本用户服务协议。`;

// 关于我们内容
const ABOUT_CONTENT = `关于我们

TRIZ答案之书是一款基于TRIZ（发明问题解决理论）的微信小程序，帮助用户结构化分析问题、识别矛盾、获得创新解决方案。

核心功能
• 九宫格分析 - 9个维度结构化问题分析
• 矛盾提取 - 自动识别16个矛盾点
• AI智能推荐 - 基于AI的创新原理推荐
• 解决方案生成 - 个性化的解决方案建议

产品特色
• 双版本模式：专业版（技术问题）+ 生活版（个人问题）
• AI智能辅助：基于大语言模型的智能提示和分析
• 本地数据存储：您的数据保存在本地，保护隐私
• 主题切换：朴素风 / 多巴胺风

版本信息
当前版本：v1.0.0
发布日期：2026年2月
微信基础库：2.19.4

技术支持

Q: AI功能需要收费吗？
A: 本小程序本身免费，但AI功能会消耗NVIDIA API调用额度。我们提供测试模式供免费体验。

Q: 我的数据安全吗？
A: 您的数据保存在本地微信存储中，不会自动上传到任何服务器。

联系我们
反馈建议：通过微信开发者工具提交Issue

致谢
本小程序的开发参考了TRIZ理论、微信小程序开发平台、NVIDIA AI大语言模型服务。

感谢您使用TRIZ答案之书！`;

Page({
  data: {
    themeClass: 'simple-theme',
    showModal: false,
    modalTitle: '',
    modalContent: ''
  },

  onLoad: function() {
    this.loadTheme();
  },

  onShow: function() {
    this.loadTheme();
  },

  // 加载主题
  loadTheme: function() {
    const app = getApp();
    const theme = app.globalData.theme || 'simple';
    this.setData({ themeClass: theme + '-theme' });
  },

  // 主题切换回调
  onThemeChanged: function(newTheme) {
    this.setData({ themeClass: newTheme + '-theme' });
  },

  // 显示隐私政策
  showPrivacyPolicy: function() {
    this.setData({
      modalTitle: '隐私政策',
      modalContent: PRIVACY_CONTENT,
      showModal: true
    });
  },

  // 显示用户协议
  showUserAgreement: function() {
    this.setData({
      modalTitle: '用户协议',
      modalContent: AGREEMENT_CONTENT,
      showModal: true
    });
  },

  // 显示关于我们
  showAboutUs: function() {
    this.setData({
      modalTitle: '关于我们',
      modalContent: ABOUT_CONTENT,
      showModal: true
    });
  },

  // 隐藏弹窗
  hideModal: function() {
    this.setData({ showModal: false });
  }
});
