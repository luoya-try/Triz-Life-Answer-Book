// 测试工具 - 用于mock测试九宫格解析、矛盾提取、解决方案生成

const mockData = require('./mockData.js');

class TestHelper {
  constructor(config) {
    this.config = config;
    this.currentVersion = 'professional';
  }

  // 设置当前版本
  setVersion(version) {
    this.currentVersion = version || 'professional';
  }

  // 获取mock响应（带延迟）
  getMockResponse(type, callback) {
    const { mockDelay } = this.config.TEST_MODE;
    const dataType = this.currentVersion === 'lifestyle' ? 'lifestyle' : 'professional';

    setTimeout(() => {
      if (mockData[type] && mockData[type][dataType]) {
        callback(null, mockData[type][dataType]);
      } else {
        callback(new Error('Mock data not found'), null);
      }
    }, mockDelay);
  }

  // 模拟调用API
  callMockAPI(prompt, type, callback) {
    console.log('[TEST MODE] Mock API call:', type);
    console.log('[TEST MODE] Current version:', this.currentVersion);

    this.getMockResponse(type, (error, response) => {
      if (error) {
        console.error('[TEST MODE] Error:', error);
        callback(null);
      } else {
        console.log('[TEST MODE] Response:', response);
        callback(response);
      }
    });
  }

  // 模拟生成九宫格提取
  mockExtractConflicts(question, callback) {
    console.log('[TEST MODE] Mock extracting conflicts for:', question);
    this.callMockAPI(question, 'mockGridExtraction', callback);
  }

  // 模拟矛盾分析
  mockAnalyzeConflict(conflictName, callback) {
    console.log('[TEST MODE] Mock analyzing conflict:', conflictName);
    this.callMockAPI(conflictName, 'mockConflictAnalysis', callback);
  }

  // 模拟生成解决方案
  mockGenerateSolution(problem, conflicts, principles, callback) {
    console.log('[TEST MODE] Mock generating solution');
    this.callMockAPI(null, 'mockSolutionGeneration', callback);
  }

  // 生成随机mock文本
  generateMockText() {
    const { mockResponses } = this.config.TEST_MODE;
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex];
  }
}

module.exports = TestHelper;
