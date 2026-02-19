const { API_CONFIG, TEST_MODE } = require('./config.js');
const { getThemeConfig, getQuestionsConfig } = require('../../utils/themeConfig.js');
const lifestyleConfig = require('../../utils/lifestyleConfig.js');
const lifestylePrompts = require('../../utils/lifestylePrompts.js');
const TestHelper = require('./testHelper.js');

Page({
  data: {
    currentQuestion: 1,
    currentQuestionData: null,
    answers: new Array(9).fill(''),
    answerSources: new Array(9).fill('manual'),
    canSave: false,
    themeClass: '',
    version: 'professional',
    config: {},
    autoFilledCount: 0,
    isAnalyzing: false,
    autoFillPreviewVisible: false,
    autoFillPreviewData: null,
    questions: [],
    testModeEnabled: TEST_MODE.enabled,
    apiStatus: '就绪',
    autoAnalysisTestMode: false,
    isEditingHint: false,
    aiLoading: false,
    showAiInput: false,
    aiInputText: ''
  },

  testHelper: null,

  onLoad: function() {
    console.log('问卷页面加载完成');
    console.log('测试模式:', TEST_MODE.enabled ? '已启用' : '未启用');

    // 初始化测试工具
    if (TEST_MODE.enabled) {
      this.testHelper = new TestHelper({ TEST_MODE, API_CONFIG });
      console.log('[TEST] 测试工具已初始化');
    }

    this.loadAppVersion();
    this.loadTheme();

    // 页面加载时立即开始AI生成提示
    this.updateCurrentHint();
  },

  // 加载主题
  loadTheme: function() {
    const app = getApp();
    const theme = app.globalData.theme || 'simple';
    this.setData({ themeClass: theme + '-theme' });
  },

  // 加载应用版本
  loadAppVersion: function() {
    const app = getApp();
    const version = app.globalData.appVersion || 'professional';

    if (this.testHelper) {
      this.testHelper.setVersion(version);
    }

    let config, questions;

    if (version === 'lifestyle') {
      // 生活版使用lifestyleConfig
      config = lifestyleConfig;
      questions = lifestyleConfig.questions.map((q, index) => ({
        ...q,
        id: index + 1,
        defaultHint: q.hint,  // hint作为默认提示
        aiGenerated: false
      }));
    } else {
      // 专业版使用themeConfig
      config = getThemeConfig(version);
      questions = getQuestionsConfig(version).map((q, index) => ({
        ...q,
        id: index + 1,
        defaultHint: q.hint || q.text,
        aiGenerated: false
      }));
    }

    const progressText = config.progress.replace('{current}', this.data.currentQuestion).replace('{total}', 9);
    const aiFillText = config.aiAutoFillDone ? config.aiAutoFillDone.replace('{filled}', 0).replace('{total}', 9) : 'AI已自动填充 0/9 格，点击查看';

    this.setData({
      version,
      config,
      questions,
      themeClass: `theme-${version}`,
      progressText,
      aiFillText
    });
  },


  // 主题切换回调
  onThemeChanged: function(newTheme) {
    this.setData({ themeClass: newTheme + '-theme' });
  },

  // 更新当前问题数据
  updateCurrentQuestionData: function() {
    const currentQ = this.data.currentQuestion;
    if (currentQ < 1 || currentQ > 9) {
      console.error('无效的题目编号:', currentQ);
      return;
    }

    const currentQuestionData = this.data.questions[currentQ - 1];
    if (!currentQuestionData) {
      console.error('找不到问题数据:', currentQ);
      return;
    }

    this.setData({ currentQuestionData });
  },

  // 初始化默认提示
  initialDefaultHints: function() {
    const questions = [...this.data.questions];
    questions.forEach((q, index) => {
      if (q.defaultHint) {
        q.hint = q.defaultHint;
        q.aiGenerated = false;
      }
    });
    this.setData({ questions });
  },

  // 监听页面数据变化
  onReady: function() {
  },

  // 监听页面显示
  onShow: function() {
    this.loadAppVersion();
    this.loadTheme();
    // 每次显示页面时更新当前题的提示
    setTimeout(() => {
      this.updateCurrentHint();
    }, 100);
  },

  // 更新当前题的提示
  updateCurrentHint: function() {
    const currentQ = this.data.currentQuestion;

    // 边界检查
    if (currentQ < 1 || currentQ > 9) {
      console.error('updateCurrentHint: 无效的题目编号:', currentQ);
      return;
    }

    const questions = [...this.data.questions];
    const questionIndex = currentQ - 1;

    // 检查问题数据是否存在
    if (!questions[questionIndex]) {
      console.error('updateCurrentHint: 找不到问题数据:', questionIndex);
      return;
    }

    // 先用内置提示词显示
    if (questions[questionIndex].defaultHint) {
      questions[questionIndex].hint = questions[questionIndex].defaultHint;
      questions[questionIndex].aiGenerated = false;
      this.setData({ questions });
      // 更新当前问题数据到页面
      this.updateCurrentQuestionData();
    }

    // 设置loading状态
    this.setData({ aiLoading: true, apiStatus: '正在生成AI提示...' });

    // 生成AI提示
    if (currentQ === 1) {
      // 第一题调用API生成友好的欢迎提示
      this.generateFirstQuestionHint();
     } else {
       // 其他题目根据上下文生成提示
       const context = this.prepareContext(currentQ);
       this.generateHintWithGLM(context, currentQ);
     }
  },
  
  // 生成第一题的AI欢迎提示
  generateFirstQuestionHint: function() {
    const version = this.data.version;
    let prompt;

    if (version === 'lifestyle') {
      // 生活版prompt
      prompt = lifestylePrompts.questionnaire.firstQuestionHint();
    } else {
      // 专业版prompt（原有）
      prompt = `你是一位友好、专业的TRIZ问题分析助手。这是问卷调查的第一题。请为用户生成一个温暖、友好的欢迎提示。要求：1.使用"您"尊称 2.语气温暖、鼓励 3.简洁明了，80-120字 4.用中文回复。请直接返回提示语文本。`;
    }

    if (this.testModeEnabled && this.testHelper) {
      // 测试模式
      const hintText = this.testHelper.generateMockText();
      console.log('[TEST MODE] 使用mock提示:', hintText);
      console.log('[TEST MODE] 当前版本:', version);

      const questions = [...this.data.questions];
      questions[0].hint = hintText;
      questions[0].aiGenerated = true;

      this.setData({
        questions,
        aiLoading: false,
        apiStatus: '[TEST] AI提示已生成'
      });
      this.updateCurrentQuestionData();
    } else {
      // 正常模式
      console.log('[', version.toUpperCase(), '] 调用AI生成第一题提示...');
      this.callGLMAPI(prompt, (hint) => {
        if (hint) {
          const questions = [...this.data.questions];
          questions[0].hint = hint;
          questions[0].aiGenerated = true;

          this.setData({
            questions,
            aiLoading: false,
            apiStatus: 'AI提示已生成'
          });
          this.updateCurrentQuestionData();
        } else {
          this.setData({
            aiLoading: false,
            apiStatus: '使用默认提示'
          });
        }
      });
    }
  },
  
   // 回答输入事件
   onAnswerInput: function(e) {
     const value = e.detail.value;
     const currentIndex = this.data.currentQuestion - 1;

     console.log(`=== onAnswerInput 第${currentIndex + 1}题 ===`);
     console.log('输入值:', value);
     console.log('当前this.data.answers:', this.data.answers);

     const answers = [...this.data.answers];
     const answerSources = [...this.data.answerSources];

     answers[currentIndex] = value;
     answerSources[currentIndex] = 'manual';

     console.log('更新后answers:', answers);

     // 检查是否已回答至少2道题目
     const canSave = answers.filter(a => a && a.trim()).length >= 2;

     this.setData({ answers, answerSources, canSave });
   },
  
   // 准备上下文信息 - 直接从this.data获取，确保数据一致性
   prepareContext: function(targetQuestionIndex) {
     const context = [];

     console.log('=== prepareContext 开始 ===');
     console.log('targetQuestionIndex:', targetQuestionIndex);

     // 直接从this.data读取最新状态
     const questions = this.data.questions || [];
     const answers = this.data.answers || [];

     console.log('questions.length:', questions.length);
     console.log('answers.length:', answers.length);
     console.log('answers[0]:', answers[0]);
     console.log('answers[1]:', answers[1]);
     console.log('answers[2]:', answers[2]);

     // 遍历所有已回答的问题（0到targetQuestionIndex-2）
     for (let i = 0; i < targetQuestionIndex - 1; i++) {
       const answer = answers[i];
       const question = questions[i];

       console.log(`i=${i}: answer.length=${answer ? answer.length : 0}, question=${question ? question.shortText : 'null'}`);

       if (answer && answer.trim() && question && question.shortText) {
         const item = {
           question: question.shortText,
           answer: answer.trim()
         };
         context.push(item);
         console.log(`  ✓ 添加: ${JSON.stringify(item)}`);
       } else {
         console.log(`  ✗ 跳过: answer=${answer ? '有值' : '空'}, question=${question ? '有值' : 'null'}`);
       }
     }

     console.log('最终context.length:', context.length);
     console.log('最终context:', JSON.stringify(context));
     console.log('=== prepareContext 结束 ===');
     return context;
   },
  
   // 调用AI生成提示（支持专业版和生活版）
   generateHintWithGLM: function(context, targetQuestionIndex) {
     const version = this.data.version;
     const questions = this.data.questions;
     const targetQuestionData = questions[targetQuestionIndex - 1];

     console.log('=== generateHintWithGLM ===');
     console.log('context参数接收:', JSON.stringify(context));
     console.log('targetQuestionIndex:', targetQuestionIndex);

     let prompt;

     if (version === 'lifestyle') {
       // 生活版：使用lifestylePrompts
       const userCoreIssue = this.data.answers[0] || (questions[0].text);
       console.log('userCoreIssue:', userCoreIssue);
       console.log('传给prompt的context:', JSON.stringify(context));
       console.log('context.length:', context.length);

       prompt = lifestylePrompts.questionnaire.generateNextQuestion(
         userCoreIssue,
         context,
         targetQuestionIndex,
         targetQuestionData
       );

       console.log('=== 生活版完整Prompt ===');
       console.log(prompt);
       console.log('=== Prompt结束 ===');
    } else {
      // 专业版：原有prompt逻辑
      if (context.length === 0) {
        prompt = `你是一位友好的TRIZ问题分析助手。
当前问题："${targetQuestionData.text}"
问题标签："${targetQuestionData.shortText}"
问题维度说明：${targetQuestionData.defaultHint}
请为这个问题生成一个自然、友好的提示语。要求：1.像真人对话一样自然，使用"您"等尊称 2.结合当前问题的维度说明，引导用户从正确角度思考 3.简洁明了，60-100字 4.用中文回复。请直接返回提示语文本。`;
      } else {
        prompt = `你是一位友好的TRIZ问题分析助手，正在引导用户完成TRIZ九宫格问题分析法。
用户之前的回答：${context.join('\n')}
当前问题："${targetQuestionData.text}"
当前问题标签："${targetQuestionData.shortText}"
问题维度说明：${targetQuestionData.defaultHint}
TRIZ九宫格说明：超系统、系统、子系统的层次结构。
请根据用户之前的回答和当前问题的维度，生成一个自然、有人情味的提示语。要求：1.像真人对话一样自然，使用"您"等尊称 2.必须提及用户之前的某个具体回答内容 3.结合当前问题的维度说明 4.简洁明了，60-100字 5.用中文回复。请直接返回提示语文本。`;
      }
    }

    console.log('发送API请求...');

    // 调用API
    this.callGLMAPI(prompt, (hint) => {
      console.log('========================================');

      if (hint) {
        console.log('✓ API返回成功!');
        console.log('提示内容:', hint);
        const newQuestions = [...this.data.questions];
        newQuestions[targetQuestionIndex - 1].hint = hint;
        newQuestions[targetQuestionIndex - 1].aiGenerated = true;

        this.setData({
          questions: newQuestions,
          aiLoading: false,
          apiStatus: 'AI提示已生成'
        });
        this.updateCurrentQuestionData();
        console.log('✓ 页面提示已更新');
      } else {
        console.log('✗ API失败，保持默认提示');
        this.setData({
          aiLoading: false,
          apiStatus: '使用默认提示'
        });
      }
      console.log('========================================');
    });
  },
  
  // 切换测试模式
  toggleTestMode: function() {
    const newTestModeEnabled = !this.data.testModeEnabled;
    this.setData({ 
      testModeEnabled: newTestModeEnabled,
      apiStatus: newTestModeEnabled ? '测试模式' : '真实API模式'
    });
    
    // 重新生成当前问题的提示
    this.updateCurrentHint();
  },
  
  // 调用GLM4.7 API
  callGLMAPI: function(prompt, callback) {
    console.log('调用GLM4.7 API:', prompt);

    // 检查是否启用测试模式
    if (this.testModeEnabled && this.testHelper) {
      console.log('[TEST MODE] 使用testHelper模拟API响应');
      this.setData({ apiStatus: '[TEST MODE] 模拟API响应' });

      const mockHint = this.testHelper.generateMockText();
      console.log('[TEST MODE] 测试模式响应:', mockHint);
      callback(mockHint);
      return;
    }

    this.setData({ apiStatus: 'AI生成中' });

    try {
      wx.request({
        url: API_CONFIG.apiUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        data: {
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '你是一个TRIZ问题分析专家，擅长引导用户思考问题，生成友好、自然的提示语。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.7,
          top_p: 0.7,
          stream: false
        },
        success: (res) => {
          console.log('API响应:', res);

          if (res.statusCode === 200) {
            if (res.data && res.data.choices && res.data.choices[0]) {
              const hint = res.data.choices[0].message.content;
              console.log('成功获取AI提示:', hint);
              callback(hint);
            } else {
              console.error('API响应格式错误:', res.data);
              this.setData({ apiStatus: 'API错误', aiLoading: false });
              callback(null);
            }
          } else {
            console.error('API调用失败:', res.statusCode, res.data);
            this.setData({ apiStatus: `API错误: ${res.statusCode}`, aiLoading: false });
            callback(null);
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
          this.setData({
            apiStatus: '网络失败，已切换测试模式'
          });
          const mockHint = this.testHelper ? this.testHelper.generateMockText() : TEST_MODE.mockResponses[0];
          callback(mockHint);
        }
      });
    } catch (error) {
      console.error('API调用异常:', error);
      this.setData({ apiStatus: 'API异常', aiLoading: false });
      callback(null);  // 返回null表示失败
    }
  },
  
  // 上一题
  prevQuestion: function() {
    if (this.data.currentQuestion > 1) {
      this.setData({ currentQuestion: this.data.currentQuestion - 1 }, () => {
        // 更新当前问题数据
        this.updateCurrentQuestionData();
        // 上一题后更新当前题的提示
        this.updateCurrentHint();
      });
    }
  },
  
  // 下一题
  nextQuestion: function() {
    console.log('nextQuestion被调用');

    if (this.data.currentQuestion < 9) {
      // 还有下一题
      const nextQ = this.data.currentQuestion + 1;
      this.setData({ currentQuestion: nextQ }, () => {
        this.updateCurrentQuestionData();
        setTimeout(() => {
          this.updateCurrentHint();
        }, 300);
      });
    } else {
      // 第9题不做任何操作（"下一题"按钮已变灰）
      // 用户可以点击中间的"查看矛盾"按钮
    }
  },

  // 计算矛盾对
  calculateConflicts: function() {
    const app = getApp();
    const gridData = app.globalData.gridData;

    console.log('开始计算矛盾对，gridData:', gridData);

    // 定义九宫格位置映射
    const positions = {
      // 过去的三个格子（上排）
      pastSuper: { name: '过去的超系统', content: gridData.past.super, coordinates: [0, 0] },
      pastSystem: { name: '过去的系统', content: gridData.past.system, coordinates: [0, 1] },
      pastSub: { name: '过去的子系统', content: gridData.past.sub, coordinates: [0, 2] },

      // 当前的格子（中排，注意没有当前系统，因为就是中心格）
      currentSuper: { name: '当前的超系统', content: gridData.current.super, coordinates: [1, 0] },
      currentSub: { name: '当前的子系统', content: gridData.current.sub, coordinates: [1, 2] },

      // 未来的三个格子（下排）
      futureSuper: { name: '未来的超系统', content: gridData.future.super, coordinates: [2, 0] },
      futureSystem: { name: '未来的系统', content: gridData.future.system, coordinates: [2, 1] },
      futureSub: { name: '未来的子系统', content: gridData.future.sub, coordinates: [2, 2] },

      // 中心格
      center: { name: '核心问题', content: gridData.center, coordinates: [1, 1] }
    };

    const conflicts = [];
    let conflictId = 1;

    // 计算相邻矛盾（水平相邻）
    const adjacentPairs = {
      1: ['pastSuper', 'pastSystem'],
      2: ['pastSystem', 'pastSub'],
      3: ['currentSuper', 'center'],
      4: ['center', 'currentSub'],
      5: ['futureSuper', 'futureSystem'],
      6: ['futureSystem', 'futureSub']
    };

    console.log('');
    console.log('【水平相邻矛盾生成】');
    for (const [buttonId, pair] of Object.entries(adjacentPairs)) {
      const id = parseInt(buttonId);
      const cell1 = positions[pair[0]];
      const cell2 = positions[pair[1]];

      console.log(`  检查矛盾点${id}: ${cell1.name} vs ${cell2.name}`);
      console.log(`    ${pair[0]} 内容长度:`, cell1.content ? cell1.content.length : 0);
      console.log(`    ${pair[1]} 内容长度:`, cell2.content ? cell2.content.length : 0);

      if (cell1.content && cell2.content) {
        const priority = this.calculatePriority(cell1, cell2);
        const coreLevel = this.calculateCoreLevel(priority);
        const color = this.calculateColor('adjacent', priority);
        const shape = this.calculateShape('adjacent');

        conflicts.push({
          id: id,
          type: 'adjacent',
          cell1Name: cell1.name,
          cell2Name: cell2.name,
          cell1Content: cell1.content,
          cell2Content: cell2.content,
          pair: [pair[0], pair[1]],
          priority: priority,
          coreLevel: coreLevel,
          color: color,
          shape: shape
        });
        console.log(`    ✓ 创建矛盾，颜色: ${color}`);
      } else {
        console.log(`    ✗ 跳过：格子为空`);
      }
    }

    // 计算垂直相邻矛盾
    const verticalPairs = {
      7: ['pastSuper', 'currentSuper'],
      8: ['currentSuper', 'futureSuper'],
      9: ['pastSystem', 'center'],
      10: ['center', 'futureSystem'],
      11: ['pastSub', 'currentSub'],
      12: ['currentSub', 'futureSub']
    };

    console.log('');
    console.log('【垂直相邻矛盾生成】');
    for (const [buttonId, pair] of Object.entries(verticalPairs)) {
      const id = parseInt(buttonId);
      const cell1 = positions[pair[0]];
      const cell2 = positions[pair[1]];

      console.log(`  检查矛盾点${id}: ${cell1.name} vs ${cell2.name}`);
      console.log(`    ${pair[0]} 内容长度:`, cell1.content ? cell1.content.length : 0);
      console.log(`    ${pair[1]} 内容长度:`, cell2.content ? cell2.content.length : 0);

      if (cell1.content && cell2.content) {
        const priority = this.calculatePriority(cell1, cell2);
        const coreLevel = this.calculateCoreLevel(priority);
        const color = this.calculateColor('vertical', priority);
        const shape = this.calculateShape('vertical');

        conflicts.push({
          id: id,
          type: 'vertical',
          cell1Name: cell1.name,
          cell2Name: cell2.name,
          cell1Content: cell1.content,
          cell2Content: cell2.content,
          pair: [pair[0], pair[1]],
          priority: priority,
          coreLevel: coreLevel,
          color: color,
          shape: shape
        });
        console.log(`    ✓ 创建矛盾，颜色: ${color}`);
      } else {
        console.log(`    ✗ 跳过：格子为空`);
      }
    }

    // 计算对角矛盾（4个核心对角线）
    const diagonalPairs = {
      13: ['pastSuper', 'center'],
      14: ['center', 'futureSub'],
      15: ['pastSub', 'center'],
      16: ['center', 'futureSuper']
    };

    console.log('=== 开始计算对角矛盾 ===');
    console.log('对角矛盾对数量:', Object.keys(diagonalPairs).length);

    for (const [buttonId, pair] of Object.entries(diagonalPairs)) {
      const cell1 = positions[pair[0]];
      const cell2 = positions[pair[1]];
      const id = parseInt(buttonId);

      console.log(`检查对角矛盾 ${pair[0]} vs ${pair[1]} (按钮ID ${id}):`);
      console.log(`  ${cell1.name} 内容长度:`, cell1.content ? cell1.content.length : 0);
      console.log(`  ${cell2.name} 内容长度:`, cell2.content ? cell2.content.length : 0);

      if (cell1.content && cell2.content) {
        const priority = this.calculatePriority(cell1, cell2);
        const coreLevel = this.calculateCoreLevel(priority);
        const color = this.calculateColor('diagonal', priority);
        const shape = this.calculateShape('diagonal');

        console.log(`  创建对角矛盾，使用固定ID: ${id}`);
        conflicts.push({
          id: id,
          type: 'diagonal',
          cell1Name: cell1.name,
          cell2Name: cell2.name,
          cell1Content: cell1.content,
          cell2Content: cell2.content,
          pair: [pair[0], pair[1]],
          priority: priority,
          coreLevel: coreLevel,
          color: color,
          shape: shape
        });
      } else {
        console.log(`  跳过：格子为空`);
      }
    }

    console.log('');
    console.log('========================================');
    console.log('      所有矛盾生成完成');
    console.log('========================================');
    console.log(`总共生成矛盾数量: ${conflicts.length}`);
    console.log('');
    console.log('矛盾详情:');
    for (const conflict of conflicts) {
      console.log(`  矛盾点${conflict.id} (${conflict.type}): ${conflict.cell1Name} vs ${conflict.cell2Name} - 颜色: ${conflict.bgColor}`);
    }
    console.log('========================================\n');

    // 保存到全局数据
    app.globalData.conflicts = conflicts;

    console.log('=== 矛盾对计算完成 ===');
    console.log('共生成 ' + conflicts.length + ' 个矛盾对');
    console.log('conflicts:', JSON.stringify(conflicts, null, 2));
  },

  // 计算矛盾优先级
  calculatePriority: function(cell1, cell2) {
    // 对角线矛盾优先级最高
    if ((cell1.coordinates[0] === 0 || cell1.coordinates[0] === 2) &&
        (cell1.coordinates[1] === 0 || cell1.coordinates[1] === 2) &&
        (cell2.coordinates[0] === 1 && cell2.coordinates[1] === 1)) {
      return 3;
    }

    // 根据时间跨度和系统层次判断
    const timeDifference = Math.abs(cell1.coordinates[0] - cell2.coordinates[0]);
    const levelDifference = Math.abs(cell1.coordinates[1] - cell2.coordinates[1]);

    if (timeDifference === 2 && levelDifference === 2) {
      return 3;
    } else if (timeDifference === 2) {
      return 2;
    } else if (levelDifference === 2) {
      return 2;
    } else if (timeDifference === 1 && cell1.content !== cell2.content) {
      return 1;
    }

    return 1;
  },

  // 计算核心程度（priority 1-3 转换为 星级 1-5）
  calculateCoreLevel: function(priority) {
    const mapping = { 1: 1, 2: 3, 3: 5 };
    return mapping[priority] || 1;
  },

  // 计算颜色（基于类型和优先级）
  calculateColor: function(type, priority) {
    const colorMap = {
      'adjacent': { 1: '#20c997', 2: '#fd7e14', 3: '#fa5252' },
      'vertical': { 1: '#4dabf7', 2: '#ffa94d', 3: '#e03131' },
      'diagonal': { 1: '#9775fa', 2: '#cc5de8', 3: '#be4bdb' }
    };
    return colorMap[type] ? colorMap[type][priority] : '#adb5bd';
  },

  // 计算形状（基于类型）
  calculateShape: function(type) {
    const shapeMap = {
      'adjacent': 'circle',
      'vertical': 'triangle',
      'diagonal': 'square'
    };
    return shapeMap[type] || 'circle';
  },

  // 跳转到指定问题
  jumpToQuestion: function(e) {
    const index = parseInt(e.currentTarget.dataset.index) || 0;
    const targetQuestion = index + 1;

    console.log('jumpToQuestion: index=', index, 'targetQuestion=', targetQuestion);

    // 边界检查
    if (index < 0 || index > 8) {
      console.error('jumpToQuestion: 无效的索引:', index);
      return;
    }

    this.setData({ currentQuestion: targetQuestion }, () => {
      // 更新当前问题数据
      this.updateCurrentQuestionData();
      // 跳转后更新当前题的提示
      this.updateCurrentHint();
    });
  },

  // 保存问卷数据到全局数据
  saveData: function() {
    const app = getApp();
    const answers = this.data.answers;

    console.log('保存问卷数据:', answers);

    // 填充九宫格数据
    app.globalData.gridData = {
      center: answers[0],
      past: {
        super: answers[1],
        system: answers[2],
        sub: answers[3]
      },
      current: {
        super: answers[4],
        system: '',
        sub: answers[5]
      },
      future: {
        super: answers[6],
        system: answers[7],
        sub: answers[8]
      }
    };

    console.log('九宫格数据已保存:', app.globalData.gridData);
  },

  // 保存九宫格并命名
  saveGridWithName: function() {
    const app = getApp();
    const that = this;

    // 直接保存数据（删除完整性校验）
    this.saveData();

    console.log('准备保存九宫格...');
    console.log('gridData:', app.globalData.gridData);

    // 对话框输入名称
    wx.showModal({
      title: '保存九宫格',
      editable: true,
      placeholderText: app.globalData.gridData.center || '未命名九宫格',
      success: function(res) {
        if (res.confirm) {
          const gridName = res.content ? res.content.trim() : (app.globalData.gridData.center || '未命名九宫格');

          console.log('网格名称:', gridName);

          // 构建保存对象
          const savedGrid = {
            id: Date.now().toString(),
            name: gridName,
            description: app.globalData.gridData.center || '',
            gridData: app.globalData.gridData,
            timestamp: Date.now(),
            answers: that.data.answers
          };

          console.log('准备保存的网格数据:', savedGrid);

          // 保存到本地存储
          try {
            const savedGrids = wx.getStorageSync('savedGrids') || [];
            savedGrids.unshift(savedGrid);
            wx.setStorageSync('savedGrids', savedGrids);

            console.log('保存成功，当前网格数量:', savedGrids.length);

            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('保存九宫格失败:', error);
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 检查九宫格完整性
  checkGridCompleteness: function() {
    const answers = this.data.answers;
    const filledCount = answers.filter(a => a && a.trim()).length;

    // 检查是否有可以构成矛盾对的格子
    const hasConflictPairs = this.checkConflictPairs(answers);

    return {
      isComplete: filledCount === 9,
      filledCount: filledCount,
      missingCount: 9 - filledCount,
      canViewConflicts: hasConflictPairs
    };
  },

  // 检查是否有可以构成矛盾对的格子
  checkConflictPairs: function(answers) {
    // 九宫格索引布局：
    // [1] [2] [3]
    // [4] [0] [5]
    // [6] [7] [8]
    // 0=核心问题, 1=过去超系统, 2=过去系统, 3=过去子系统, 4=当前超系统, 5=当前子系统, 6=未来超系统, 7=未来系统, 8=未来子系统

    // 水平相邻矛盾
    const adjacentPairs = [
      [1, 2], // 过去超系统-过去系统
      [2, 3], // 过去系统-过去子系统
      [4, 0], // 当前超系统-核心问题
      [0, 5], // 核心问题-当前子系统
      [6, 7], // 未来超系统-未来系统
      [7, 8]  // 未来系统-未来子系统
    ];

    // 垂直相邻矛盾
    const verticalPairs = [
      [1, 4], // 过去超系统-当前超系统
      [4, 6], // 当前超系统-未来超系统
      [2, 7], // 过去系统-未来系统
      [3, 5], // 过去子系统-当前子系统
      [5, 8]  // 当前子系统-未来子系统
    ];

    // 对角线矛盾（关键对角线）
    const diagonalPairs = [
      [1, 0], // 过去超系统-核心问题
      [0, 8], // 核心问题-未来子系统
      [3, 0], // 过去子系统-核心问题
      [0, 6]  // 核心问题-未来超系统
    ];

    const allPairs = [...adjacentPairs, ...verticalPairs, ...diagonalPairs];

    // 检查是否有至少一对填写的格子可以构成矛盾
    for (const pair of allPairs) {
      const [idx1, idx2] = pair;
      if (answers[idx1] && answers[idx1].trim() && answers[idx2] && answers[idx2].trim()) {
        return true;
      }
    }

    return false;
  },

  // 查看矛盾（用于独立按钮）
  checkConflicts: function() {
    this.saveData();
    this.calculateConflicts();

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/conflicts/conflicts'
      });
    }, 500);
  },

  // 从中间按钮点击查看矛盾
  viewConflictsFromCenter: function() {
    const completeness = this.checkGridCompleteness();
    const that = this;

    if (!completeness.canViewConflicts) {
      // 没有可构成矛盾对的格子
      wx.showToast({
        title: '需要至少2个相邻或相关宫格',
        icon: 'none',
        duration: 2500
      });
      return;
    }

    // 至少有可以构成矛盾对的格子，但未填满9个
    if (!completeness.isComplete) {
      wx.showModal({
        title: '九宫格未填满',
        content: '您已完成 ' + completeness.filledCount + '/9 个宫格。\n\n是否仍要查看矛盾分析？',
        confirmText: '继续查看',
        cancelText: '完成问卷',
        success: function(res) {
          if (res.confirm) {
            that.checkConflicts();
          }
        }
      });
    } else {
      // 已填满9个，直接查看
      that.checkConflicts();
    }
  },

  // 格式化时间戳
  formatTimestamp: function(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  },

  // 导入九宫格
  importGrid: function() {
    const that = this;

    try {
      const savedGrids = wx.getStorageSync('savedGrids') || [];

      if (savedGrids.length === 0) {
        wx.showModal({
          title: '暂无已保存的九宫格',
          content: '个人中心还没有保存的九宫格。请先完成问卷并保存。',
          showCancel: false
        });
        return;
      }

      // 显示九宫格选择列表
      const itemList = savedGrids.map((grid, index) => {
        const time = that.formatTimestamp(grid.timestamp);
        return `${grid.name} (${time})`;
      });

      wx.showActionSheet({
        itemList: itemList,
        success: function(res) {
          const index = res.tapIndex;
          const selectedGrid = savedGrids[index];

          // 确认导入
          wx.showModal({
            title: '确认导入',
            content: `即将导入：${selectedGrid.name}\n\n核心问题：${selectedGrid.gridData.center || '无'}`,
            success: function(confirmRes) {
              if (confirmRes.confirm) {
                // 加载选中的九宫格数据
                if (selectedGrid.answers && selectedGrid.answers.length === 9) {
                  that.setData({ answers: selectedGrid.answers });

                  // 重新计算 canSave 状态
                  const canSave = selectedGrid.answers.filter(a => a && a.trim()).length >= 2;
                  that.setData({ canSave });
                }

                // 保存到全局数据
                if (selectedGrid.gridData) {
                  const app = getApp();
                  app.globalData.gridData = selectedGrid.gridData;
                }

                // 更新当前问题数据
                that.updateCurrentQuestionData();

                wx.showToast({
                  title: '导入成功',
                  icon: 'success'
                });
              }
            }
          });
        },
        fail: function(err) {
          console.log('用户取消选择');
        }
      });

    } catch (error) {
      console.error('获取九宫格列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

   // 开始自动化分析 - 切换到内嵌输入模式
   startAutoAnalysis: function() {
     this.setData({
       showAiInput: true,
       aiInputText: ''
     });
   },

   // 取消AI输入
   cancelAiInput: function() {
     this.setData({
       showAiInput: false,
       aiInputText: ''
     });
   },

   // AI长文本输入
   onAiInput: function(e) {
     this.setData({
       aiInputText: e.detail.value
     });
   },

   // 提交AI输入并开始解析
   submitAiInput: function() {
     console.log('=== submitAiInput 被调用 ===');
     console.log('aiInputText:', this.data.aiInputText);
     console.log('aiInputText.length:', this.data.aiInputText.length);

     const inputText = this.data.aiInputText.trim();
     console.log('inputText:', inputText);

     if (inputText.length < 50) {
       wx.showToast({
         title: '请输入更详细的描述（至少50字）',
         icon: 'none',
         duration: 2000
       });
       return;
     }

     console.log('开始AI解析...');

     this.setData({
       showAiInput: false,
       apiStatus: 'AI正在解析...'
     });

     this.performAutoAnalysis(inputText);
   },

  // 获取mock分析结果
  getMockAnalysisResult: function() {
    return {
      "center": "公司产品销量下滑严重，需要提升市场份额",
      "pastSuper": "市场竞争相对稳定，主要对手实力相当",
      "pastSystem": "市场占有率达30%，产品性能稳定，客户满意度高",
      "pastSub": "研发团队技术成熟，生产供应链完善",
      "currentSuper": "竞争对手推出新产品，市场竞争加剧",
      "currentSub": "研发资金不足，技术创新受限",
      "futureSuper": "市场需求稳定增长，技术应用前景广阔",
      "futureSystem": "重新夺回市场，市场占有率恢复到35%以上",
      "futureSub": "技术团队扩充，研发能力增强"
    };
  },

  // 调用GLM API进行分析（专用JSON版本，更大的token限制）
  callGLMAPIForAnalysJson: function(prompt, callback) {
    console.log('调用GLM API进行JSON分析...');

    const that = this;

    // 检查是否启用测试模式
    if (this.data.testModeEnabled) {
      console.log('使用测试模式，模拟API响应');
      setTimeout(() => {
        const mockResult = that.getMockAnalysisResult();
        callback(mockResult);
      }, 1000);
      return;
    }

    try {
      wx.request({
        url: API_CONFIG.apiUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`
        },
        data: {
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的TRIZ九宫格分析助手。你的任务是从用户描述中提取信息并分类填充到九宫格的9个格子中。分类标准按系统层次（超系统/系统/子系统）×时间维度（过去/现在/未来）。请润色整理语言，保留关键细节但让表达清晰流畅。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,  // 增加token限制以容纳更多详细信息
          temperature: 0.4,  // 稍微提高温度以保留更多信息
          top_p: 0.6,
          top_p: 0.5,
          stream: false
        },
        success: (res) => {
          console.log('API响应:', res);

          if (res.statusCode === 200) {
            if (res.data && res.data.choices && res.data.choices[0]) {
              const response = res.data.choices[0].message.content;
              console.log('成功获取AI响应:', response);

              // 清理响应中的markdown代码块
              let cleanedResponse = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*/g, '')
                .trim();

              console.log('清理后的响应:', cleanedResponse);

              try {
                // 尝试直接解析
                let result = JSON.parse(cleanedResponse);
                console.log('✓ JSON解析成功:', result);
                callback(result);
              } catch (e) {
                console.log('直接解析失败，尝试用正则提取...');

                // 尝试用正则提取JSON
                const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  try {
                    const result = JSON.parse(jsonMatch[0]);
                    console.log('✓ 正则提取JSON成功:', result);
                    callback(result);
                    return;
                  } catch (innerError) {
                    console.error('正则提取的JSON也解析失败:', innerError);
                  }
                }

                console.error('无法解析JSON');
                wx.showModal({
                  title: '返回格式错误',
                  content: 'AI返回的数据格式不正确。\n\n请尝试重新描述您的问题。',
                  showCancel: false
                });
                callback(null);
              }
            } else {
              console.error('API响应格式错误:', res.data);
              wx.showToast({
                title: 'API返回错误',
                icon: 'none'
              });
              callback(null);
            }
          } else {
            console.error('API调用失败:', res.statusCode, res.data);
            wx.showToast({
              title: `API错误: ${res.statusCode}`,
              icon: 'none'
            });
            callback(null);
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          callback(null);
        }
      });
    } catch (error) {
      console.error('API调用异常:', error);
      wx.showToast({
        title: 'API调用异常',
        icon: 'none'
      });
      callback(null);
    }
  },

  // 执行自动化分析
  performAutoAnalysis: function(inputText) {
    const that = this;
    this.setData({ isAnalyzing: true });

    wx.showLoading({
      title: 'AI正在分析...',
      mask: true
    });

    const prompt = `请分析以下描述，按照TRIZ九宫格的方法提取信息并分类。必须只返回JSON格式。

【第一步：明确系统】
首先，从用户描述中明确当前要分析的"系统"是什么。
系统是我们关注的核心对象（例如：公司产品、某个项目、某个流程、某个产品线等）。

【第二步：基于系统进行分类】

用户描述：${inputText}

TRIZ九宫格分类标准（系统层次×时间维度）：

【系统 - 关注的核心对象】
- pastSystem（系统本身的历史）：系统怎么一步步变成现在这样、经历过哪些关键阶段和事件
- currentSub（系统的当前状态）：系统现在什么样子、如何运作、核心优势和问题是什么
- futureSystem（系统的未来目标）：系统未来想变成什么样、发展愿景和战略目标
- center（核心问题）：从"系统"的角度看，当前最迫切想解决的问题是什么（50字以内）

【超系统 - 系统所处的更大环境】
只有当用户明确提到系统的外部环境时才填写
- pastSuper（历史环境与起源）：系统诞生时外部的大环境、当时的趋势或规则
- currentSuper（当前环境与关系）：系统现在和外部谁打交道、受什么规则约束、依赖什么资源
- futureSuper（未来趋势与挑战）：外部环境将来会怎么变、会出现什么新机会或新威胁

【子系统 - 内部组成部分】
只有当用户明确提到系统的内部组成部分时才填写
- pastSub（组成部分的演变）：系统各部分最初什么样、如何发展改进或淘汰
- currentSub（组成部分的现状）：现在内部各部分怎么分工合作、它们的关系如何
- futureSub（组成部分的未来发展）：为了支持未来目标，各部分需要如何升级改变或创新

重要要求：
1. 润色整理语言，让表达清晰流畅，保留关键信息和细节
2. 严格按照"系统"为核心，基于它来识别超系统和子系统
3. 如果用户确实没有提到超系统或子系统的相关信息，对应字段可以留空（不要凭空编造）
4. 不要设置字数限制，根据实际情况自然描述（一般100-200字左右即可）

直接返回JSON：
{
  "center": "",
  "pastSuper": "",
  "pastSystem": "",
  "pastSub": "",
  "currentSuper": "",
  "currentSub": "",
  "futureSuper": "",
  "futureSystem": "",
  "futureSub": ""
}`;

    // 调用专用函数，使用适合JSON生成的参数
    this.callGLMAPIForAnalysJson(prompt, function(result) {
      wx.hideLoading();
      that.setData({ isAnalyzing: false });

      if (result) {
        that.processAnalysisResult(result);
      } else {
        wx.showToast({
          title: 'AI分析失败，请重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  // 处理分析结果
  processAnalysisResult: function(result) {
    const answers = [...this.data.answers];
    const answerSources = [...this.data.answerSources];

    const mapping = [
      'center',
      'pastSuper',
      'pastSystem',
      'pastSub',
      'currentSuper',
      'currentSub',
      'futureSuper',
      'futureSystem',
      'futureSub'
    ];

    let filledCount = 0;
    mapping.forEach((key, index) => {
      if (result[key] && result[key].trim() !== '') {
        answers[index] = result[key].trim();
        answerSources[index] = 'ai';
        filledCount++;
      }
    });

    const canSave = filledCount >= 2;

    const aiFillText = this.data.config.aiAutoFillDone
      ? this.data.config.aiAutoFillDone.replace('{filled}', filledCount).replace('{total}', 9)
      : `AI已自动填充 ${filledCount}/9 格，点击查看`;

    this.setData({
      answers,
      answerSources,
      canSave,
      autoFilledCount: filledCount,
      autoFillPreviewData: result,
      aiFillText: aiFillText
    });

    this.updateCurrentQuestionData();

    const that = this;
    setTimeout(() => {
      that.showAutoFillPreview();
    }, 300);
  },

  // 显示自动填充预览
  showAutoFillPreview: function() {
    const data = this.data.autoFillPreviewData;
    if (!data) return;

    const filledCount = this.data.autoFilledCount;
    const filledInfo = this.generateFilledInfo(data);

    wx.showModal({
      title: `✅ 分析完成！已填充 ${filledCount}/9 格`,
      content: `九宫格填充情况：\n\n${filledInfo}\n\n点击"去检查编辑"查看并修改每个格子的内容`,
      confirmText: '去检查编辑',
      cancelText: '重新分析',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '请检查编辑内容',
            icon: 'none'
          });
        }
      }
    });
  },

  // 生成填充信息文本
  generateFilledInfo: function(data) {
    const mapping = [
      { key: 'center', name: '核心问题' },
      { key: 'pastSuper', name: '过去的超系统' },
      { key: 'pastSystem', name: '过去的系统' },
      { key: 'pastSub', name: '过去的子系统' },
      { key: 'currentSuper', name: '当前的超系统' },
      { key: 'currentSub', name: '当前的子系统' },
      { key: 'futureSuper', name: '未来的超系统' },
      { key: 'futureSystem', name: '未来的系统' },
      { key: 'futureSub', name: '未来的子系统' }
    ];

    let info = '';
    mapping.forEach(item => {
      const status = data[item.key] && data[item.key].trim() ? '✓' : '✗';
      info += `${status} ${item.name}\n`;
    });

    return info;
  },

  // 清空自动填充
  clearAutoFill: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有AI填充的内容吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showToast({
            title: '手动清空',
            icon: 'none'
          });
        }
      }
    });
  }
});
