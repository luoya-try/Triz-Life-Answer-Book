// ========================================
// NVIDIA API 配置文件模板
// ========================================
// 使用说明：
// 1. 复制此文件并重命名为 config.js
// 2. 真实配置文件已在 .gitignore 中，不会提交到 Git
// 3. 将您的 NVIDIA API Key 填入下方 apiKey 字段
// ========================================

const API_CONFIG = {
  // ⚠️ 请将这里替换为您的真实 NVIDIA API Key
  // 获取方法：访问 https://build.nvidia.com/ -> API Keys -> Generate API Key
  apiKey: 'your-nvidia-api-key-here',

  // API 端点（无需修改）
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',

  // 默认模型（可根据需要切换）
  model: 'meta/llama-3.1-70b-instruct',

  // 超时设置（毫秒）
  timeout: 10000,

  // 最大重试次数
  maxRetries: 2
};

// 备选模型配置（可选）
// 如需切换模型，修改上方 API_CONFIG.model 为以下任意值
const MODEL_OPTIONS = {
  llama_3_1_70b: 'meta/llama-3.1-70b-instruct',          // ⭐ 推荐：Llama 3.1 70B，性能强性价比高
  llama_3_1_405b: 'meta/llama-3.1-405b-instruct',        // 最强性能：Llama 3.1 405B
  llama_3_70b: 'meta/llama-3-70b-instruct',              // 成熟稳定：Llama 3 70B
  mistral_7b: 'mistralai/mistral-7b-instruct-v0.3',      // 快速响应：Mistral 7B
  cohere_command_r: 'cohere/command-r-plus'              // 多语言支持：Command R Plus
};

// 测试模式配置
const TEST_MODE = {
  // 是否启用测试模式（true：使用模拟响应，false：调用真实 API）
  // 开发调试时可设为 true，节省 API 调用次数
  enabled: false,

  // 模拟响应延迟（毫秒）
  mockDelay: 500,

  // 模拟响应内容（测试时使用）
  mockResponses: [
    "感谢您分享核心问题！基于您提到的内容，我想了解更多背景信息，这将帮助我们更全面地分析问题。",
    "您的回答很有价值！为了更好地理解问题，请问您能分享更多相关细节吗？",
    "非常感谢您的详细描述！这对我们分析问题很有帮助。接下来，我们将深入探讨更多相关因素。",
    "您的见解非常独到！为了更全面地分析问题，我们需要从多个角度考虑可能的影响因素。",
    "感谢您的分享！这些信息对我们理解问题非常重要。接下来，我们将探讨更多潜在的解决方案。",
    "您的回答很有启发性！为了更全面地分析问题，我们需要考虑更多相关因素。",
    "非常感谢您的详细描述！这些信息对我们理解问题的背景非常有帮助。",
    "您的见解很有价值！基于这些信息，我们可以更有针对性地分析问题并寻找解决方案。"
  ]
};

module.exports = {
  API_CONFIG,
  MODEL_OPTIONS,
  TEST_MODE
};
