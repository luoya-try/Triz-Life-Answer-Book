const { API_CONFIG, TEST_MODE } = require('../questionnaire/config.js');
const lifestyleConfig = require('../../utils/lifestyleConfig.js');
const lifestylePrompts = require('../../utils/lifestylePrompts.js');

Page({
  data: {
    gridData: {
      center: '',
      past: {
        super: '',
        system: '',
        sub: ''
      },
      current: {
        super: '',
        sub: ''
      },
      future: {
        super: '',
        system: '',
        sub: ''
      }
    },
    conflicts: [],
    showModal: false,
    currentConflict: null,
    aiLoading: false,
    apiStatus: '',
    themeClass: '',
    version: 'professional',
    config: {},
    analysisProgress: 0,
    testModeEnabled: TEST_MODE.enabled,
    currentAnalyzingId: null
  },

  onLoad: function() {
    console.log('');
    console.log('========================================');
    console.log('       矛盾提取页面 - 九宫格分析');
    console.log('========================================');
    this.loadAppVersion();
    this.loadTheme();

    const app = getApp();
    const gridData = app.globalData.gridData;
    const conflicts = app.globalData.conflicts || [];

    // 定义九宫格ID系统（从左到右，从上到下，1-9）
    const gridCells = {
      1: { name: '过去的超系统', key: 'pastSuper', content: gridData.past.super },
      2: { name: '过去的系统', key: 'pastSystem', content: gridData.past.system },
      3: { name: '过去的子系统', key: 'pastSub', content: gridData.past.sub },
      4: { name: '当前的超系统', key: 'currentSuper', content: gridData.current.super },
      5: { name: '核心问题', key: 'center', content: gridData.center },
      6: { name: '当前的子系统', key: 'currentSub', content: gridData.current.sub },
      7: { name: '未来的超系统', key: 'futureSuper', content: gridData.future.super },
      8: { name: '未来的系统', key: 'futureSystem', content: gridData.future.system },
      9: { name: '未来的子系统', key: 'futureSub', content: gridData.future.sub }
    };

    // 定义矛盾点ID系统（从左到右，从上到下，1-16）
    const conflictPoints = {
      1: { name: '矛盾点1', type: '水平', cell1: 1, cell2: 2 },
      2: { name: '矛盾点2', type: '水平', cell1: 2, cell2: 3 },
      3: { name: '矛盾点3', type: '水平', cell1: 4, cell2: 5 },
      4: { name: '矛盾点4', type: '水平', cell1: 5, cell2: 6 },
      5: { name: '矛盾点5', type: '水平', cell1: 7, cell2: 8 },
      6: { name: '矛盾点6', type: '水平', cell1: 8, cell2: 9 },
      7: { name: '矛盾点7', type: '垂直', cell1: 1, cell2: 4 },
      8: { name: '矛盾点8', type: '垂直', cell1: 4, cell2: 7 },
      9: { name: '矛盾点9', type: '垂直', cell1: 2, cell2: 5 },
      10: { name: '矛盾点10', type: '垂直', cell1: 5, cell2: 8 },
      11: { name: '矛盾点11', type: '垂直', cell1: 3, cell2: 6 },
      12: { name: '矛盾点12', type: '垂直', cell1: 6, cell2: 9 },
      13: { name: '矛盾点13', type: '对角线', cell1: 1, cell2: 5 },
      14: { name: '矛盾点14', type: '对角线', cell1: 5, cell2: 9 },
      15: { name: '矛盾点15', type: '对角线', cell1: 3, cell2: 5 },
      16: { name: '矛盾点16', type: '对角线', cell1: 5, cell2: 7 }
    };

    console.log('\n【九宫格ID系统 (1-9)】');
    let filledCells = [];
    for (let i = 1; i <= 9; i++) {
      const cell = gridCells[i];
      const status = cell.content ? '✓ 有内容' : '✗ 空';
      console.log(`  格子${i}: ${cell.name} - ${status}`);
      if (cell.content) {
        filledCells.push(i);
      }
    }
    console.log(`\n有内容的九宫格ID: [${filledCells.join(', ')}]`);

    // 检查哪些矛盾点对应的格子都有内容
    console.log('\n【矛盾点ID系统 (1-16)】');
    console.log('检查相邻或对角线宫格之间是否有矛盾：');

    let enabledConflictPoints = [];

    for (let i = 1; i <= 16; i++) {
      const point = conflictPoints[i];
      const cell1 = gridCells[point.cell1];
      const cell2 = gridCells[point.cell2];

      const hasContent1 = !!cell1.content;
      const hasContent2 = !!cell2.content;
      const hasConflict = hasContent1 && hasContent2;

      const status = hasConflict ? '✓ 点亮' : '✗ 未点亮';
      const reason = hasConflict ? '两个格子都有内容' : '至少一个格子为空';

      console.log(`  矛盾点${i} (${point.type}): ${cell1.name} ↔ ${cell2.name} - ${status} (${reason})`);

      if (hasConflict) {
        enabledConflictPoints.push(i);
      }
    }

    console.log(`\n点亮的矛盾点ID: [${enabledConflictPoints.join(', ')}]`);
    console.log('\n========================================\n');

    // 检查哪些格子是空的
    const emptyCells = {
      pastSuper: !gridData.past.super,
      pastSystem: !gridData.past.system,
      pastSub: !gridData.past.sub,
      currentSuper: !gridData.current.super,
      currentSub: !gridData.current.sub,
      center: !gridData.center,
      futureSuper: !gridData.future.super,
      futureSystem: !gridData.future.system,
      futureSub: !gridData.future.sub
    };

    // 获取应该禁用的按钮列表（没有内容的格子对应的矛盾点）
    const disabledConflictPoints = [];

    for (let i = 1; i <= 16; i++) {
      const point = conflictPoints[i];
      const cell1 = gridCells[point.cell1];
      const cell2 = gridCells[point.cell2];

      if (!cell1.content || !cell2.content) {
        disabledConflictPoints.push(i);
      }
    }

    // 预处理冲突数据
    const processedConflicts = this.preprocessConflicts(conflicts);

    // 创建按钮ID到冲突的映射
    const conflictMap = {};
    processedConflicts.forEach((conflict) => {
      conflictMap[conflict.id] = conflict;
    });

    // 确保所有按钮ID 1-16 都有对应的值
    for (let i = 1; i <= 16; i++) {
      if (!conflictMap[i]) {
        conflictMap[i] = null;
      }
    }

    this.setData({
      gridData: gridData,
      conflicts: processedConflicts,
      conflictMap: conflictMap,
      emptyCells: emptyCells,
      disabledButtons: disabledConflictPoints,
      gridCells: gridCells,
      conflictPoints: conflictPoints,
      filledCells: filledCells,
      enabledConflictPoints: enabledConflictPoints
    });

    console.log('开始AI分析矛盾...');
    this.analyzeAllConflictsWithAI();
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

  // 辅助函数 - 计算冲突等级类名
  getConflictLevelClassByPriority: function(priority) {
    if (priority === 3) return 'high';
    if (priority === 2) return 'medium';
    return 'low';
  },

  // 辅助函数 - 预处理冲突数据
  preprocessConflicts: function(conflicts) {
    return conflicts.map(conflict => ({
      ...conflict,
      levelClass: this.getConflictLevelClassByPriority(conflict.priority),
      bgColor: conflict.color || '#adb5bd',
      shapeClass: conflict.shape || 'circle'
    }));
  },
  
  // 显示矛盾详情
  showConflict: function(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const conflict = this.data.conflictMap[id];
    const conflictPoint = this.data.conflictPoints[id];

    console.log('');
    console.log('========================================');
    console.log('           点击矛盾点');
    console.log('========================================');
    console.log(`矛盾点ID: ${id}`);
    console.log(`矛盾点名称: ${conflictPoint ? conflictPoint.name : '未知'}`);
    console.log(`矛盾点类型: ${conflictPoint ? conflictPoint.type : '未知'}`);
    console.log(`连接格子: 格子${conflictPoint ? conflictPoint.cell1 : '?'} ↔ 格子${conflictPoint ? conflictPoint.cell2 : '?'}`);

    if (conflictPoint) {
      const cell1 = this.data.gridCells[conflictPoint.cell1];
      const cell2 = this.data.gridCells[conflictPoint.cell2];
      console.log(`格子${conflictPoint.cell1}: ${cell1.name} - ${cell1.content ? '有内容' : '空'}`);
      console.log(`格子${conflictPoint.cell2}: ${cell2.name} - ${cell2.content ? '有内容' : '空'}`);
    }

    console.log(`对应的矛盾数据:`, conflict);
    console.log('========================================\n');

    if (conflict) {
      this.setData({
        currentConflict: conflict,
        showModal: true
      });
    } else {
      wx.showToast({
        title: '该矛盾不存在（格子可能为空）',
        icon: 'none'
      });
    }
  },

  // 根据按钮ID查找对应的矛盾
  findConflictByButtonId: function(buttonId) {
    const conflicts = this.data.conflicts;
    const buttonToPairMap = {
      1: ['pastSuper', 'pastSystem'],
      2: ['pastSystem', 'pastSub'],
      3: ['currentSuper', 'center'],
      4: ['center', 'currentSub'],
      5: ['futureSuper', 'futureSystem'],
      6: ['futureSystem', 'futureSub'],
      7: ['pastSuper', 'currentSuper'],
      8: ['currentSuper', 'futureSuper'],
      9: ['pastSystem', 'futureSystem'],
      10: ['pastSub', 'currentSub'],
      11: ['currentSub', 'futureSub'],
      13: ['pastSuper', 'center'],
      14: ['center', 'futureSub'],
      15: ['pastSub', 'center'],
      16: ['center', 'futureSuper']
    };

    const pair = buttonToPairMap[buttonId];
    if (!pair) {
      console.log(`  按钮${buttonId}: 没有对应的格子对映射`);
      return null;
    }

    console.log(`  寻找格子对: [${pair[0]}, ${pair[1]}]`);

    const conflict = conflicts.find(c =>
      c.pair && c.pair.length === 2 &&
      ((c.pair[0] === pair[0] && c.pair[1] === pair[1]) ||
       (c.pair[0] === pair[1] && c.pair[1] === pair[0]))
    );

    if (conflict) {
      console.log(`  找到矛盾: ID=${conflict.id}, ${conflict.cell1Name} vs ${conflict.cell2Name}, 颜色=${conflict.bgColor}`);
    } else {
      console.log(`  未找到矛盾: 没有对应格子对的矛盾数据`);
    }

    return conflict || null;
  },

  // AI分析所有矛盾（逐个分析）
  analyzeAllConflictsWithAI: function() {
    const conflicts = this.data.conflicts.filter(c => !c.title || !c.description);

    if (conflicts.length === 0) {
      console.log('所有矛盾已分析完成');
      this.setData({ apiStatus: '分析完成' });
      return;
    }

    console.log(`需要分析的矛盾数量: ${conflicts.length}`);
    this.setData({ 
      aiLoading: true, 
      apiStatus: `AI正在分析 1/${conflicts.length}...`,
      analysisProgress: 0
    });

    this.analyzeConflictsSequentially(conflicts, 0);
  },

  // 逐个分析矛盾
  analyzeConflictsSequentially: function(conflicts, index) {
    if (index >= conflicts.length) {
      console.log('AI分析全部完成');
      this.setData({ 
        aiLoading: false, 
        apiStatus: '分析完成',
        analysisProgress: 100
      });
      return;
    }

    const conflict = conflicts[index];
    
    this.analyzeConflictWithAI(
      conflict.cell1Name,
      conflict.cell2Name,
      conflict.cell1Content,
      conflict.cell2Content,
      conflict.id,
      () => {
        const nextIndex = index + 1;
        const progress = Math.round((nextIndex / conflicts.length) * 100);

        this.setData({ 
          apiStatus: `AI正在分析 ${nextIndex}/${conflicts.length}...`,
          analysisProgress: progress
        });

        setTimeout(() => {
          this.analyzeConflictsSequentially(conflicts, nextIndex);
        }, 800);
      }
    );
  },

  // 单个矛盾AI分析（支持专业版和生活版）
  analyzeConflictWithAI: function(cell1Name, cell2Name, content1, content2, conflictId, doneCallback) {
    const conflicts = [...this.data.conflicts];
    const index = conflicts.findIndex(c => c.id === conflictId);

    if (index !== -1) {
      // 标记为正在分析，显示加载动画
      conflicts[index].aiAnalyzed = false;
      // 设置当前正在分析的ID
      this.setData({
        conflicts,
        currentAnalyzingId: conflictId
      });
      console.log(`[${this.data.version.toUpperCase()}] 开始分析 矛盾${conflictId}...`);
    }

    let prompt;

    if (this.data.version === 'lifestyle') {
      // 生活版prompt
      const cellA = {
        name: cell1Name,
        content: content1
      };
      const cellB = {
        name: cell2Name,
        content: content2
      };
      prompt = lifestylePrompts.conflicts.generateConflictDescription(cellA, cellB);
    } else {
      // 专业版prompt（原有）
      prompt = `你是一位TRIZ发明理论专家，正在分析九宫格中的技术矛盾。

矛盾对：
- ${cell1Name}：${content1}
- ${cell2Name}：${content2}

任务：识别其中的矛盾，分为"改善点"和"导致的劣化"两个方面。

【标题格式要求】
必须严格使用以下格式（不要添加任何其他文字）：
"用户想改善[改善点]，但不能这样做，因为会导致[劣化点]"

【标题示例】
- "用户想改善系统性能，但不能这样做，因为会导致成本上升"
- "用户想提高生产效率，但不能这样做，会导致质量下降"

【详细说明要求】
1. 解释为什么这两个方面之间存在矛盾
2. 说明改善一个方面会导致另一个方面劣化的技术原因
3. 150-200字，专业、准确、清晰

【返回格式】
必须只返回JSON格式，不要添加任何解释：

{
  "title": "用户想改善...，但不能这样做，因为会导致...",
  "description": "..."
}`;
    }

    console.log(`[${this.data.version.toUpperCase()}] Prompt准备完成，开始调用API...`);

    this.callGLMAPI(prompt, (response) => {
      if (response) {
        const conflicts = [...this.data.conflicts];
        const index = conflicts.findIndex(c => c.id === conflictId);

        if (index !== -1) {
          try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            let result;
            console.log(`[${this.data.version.toUpperCase()}] 矛盾${conflictId} AI原始响应:`, response);

            if (jsonMatch) {
              result = JSON.parse(jsonMatch[0]);
            } else {
              result = {
                title: '未命名矛盾',
                description: response
              };
            }

            // 处理生活版和生活版的格式差异
            if (this.data.version === 'lifestyle') {
              // 生活版格式：{conflictName, innerDrama, deepValues, intensity}
              // 映射到通用字段
              conflicts[index].title = result.conflictName || result.conflictName || '未命名矛盾';
              conflicts[index].description = result.innerDrama || result.description;
              conflicts[index].deepValues = result.deepValues || '';
              conflicts[index].intensity = result.intensity || 'medium';
            } else {
              // 专业版格式：{title, description}
              conflicts[index].title = result.title || '未命名矛盾';
              conflicts[index].description = result.description || '';
            }

            conflicts[index].aiAnalyzed = true;

            // 分析完成后清空currentAnalyzingId
            this.setData({
              conflicts,
              currentAnalyzingId: null
            });

            console.log(`[${this.data.version.toUpperCase()}] 矛盾${conflictId}分析完成:`, conflicts[index].title);
          } catch (error) {
            console.error('解析AI响应失败:', error);
            // 根据版本设置默认值
            if (this.data.version === 'lifestyle') {
              conflicts[index].title = '未命名困境';
              conflicts[index].description = '没能获取到AI分析，请稍后重试';
              conflicts[index].deepValues = '';
              conflicts[index].intensity = 'low';
            } else {
              conflicts[index].title = '未命名矛盾';
              conflicts[index].description = response;
            }
            conflicts[index].aiAnalyzed = true;
            // 分析完成后清空currentAnalyzingId
            this.setData({
              conflicts,
              currentAnalyzingId: null
            });
          }
        }
      }
      if (doneCallback) doneCallback();
    });
  },

  // 调用GLM API
  callGLMAPI: function(prompt, callback, retryCount = 0) {
    const MAX_RETRY = 3;

    if (this.data.testModeEnabled) {
      setTimeout(() => {
        const mockResponse = {
          title: `用户想改善自信心，但不能这样做，因为会导致技能被取代的风险`,
          description: `在当前AI技术快速发展的时代，提升自信心是用户的核心需求。但是如果过度依赖外部环境或工作成就来获得自信，一旦这些因素发生变化，自信心就会受到严重影响。这是一个典型的矛盾：需要内心的强大，但同时又受制于外部环境的变化。技术原因是，自信心本应建立在内在实力和自我认知的基础上，但在现代社会中，人们往往将自我价值与职业成就紧密挂钩。因此，需要找到一种平衡：既能提升自信心，又不完全依赖外部因素。`
        };
        callback(JSON.stringify(mockResponse));
      }, TEST_MODE.mockDelay);
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
              content: '你是一个TRIZ问题分析专家，擅长分析技术矛盾并提取矛盾标题。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.4,
          top_p: 0.6,
          stream: false
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices[0]) {
            const response = res.data.choices[0].message.content;
            callback(response);
          } else {
            console.error('API返回错误:', res);
            if (retryCount < MAX_RETRY) {
              console.log(`重试 (${retryCount + 1}/${MAX_RETRY})...`);
              setTimeout(() => {
                this.callGLMAPI(prompt, callback, retryCount + 1);
              }, 1000 * (retryCount + 1));
            } else {
              callback(null);
            }
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
          if (retryCount < MAX_RETRY) {
            console.log(`重试 (${retryCount + 1}/${MAX_RETRY})...`);
            setTimeout(() => {
              this.callGLMAPI(prompt, callback, retryCount + 1);
            }, 1000 * (retryCount + 1));
          } else {
            callback(null);
          }
        }
      });
    } catch (error) {
      console.error('API调用异常:', error);
      callback(null);
    }
  },

  // 隐藏矛盾详情
  hideModal: function() {
    this.setData({ showModal: false });
  },
  
  // 保存矛盾数据
  saveConflicts: function() {
    try {
      wx.setStorageSync('saved_conflicts', {
        data: this.data.conflicts,
        gridData: this.data.gridData,
        timestamp: Date.now()
      });
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      });
    }
  },
  
  // 下一步：解决方案
  nextStep: function() {
    // 保存选择的矛盾到全局数据
    const app = getApp();
    app.globalData.conflicts = this.data.conflicts;

    // solutions页面在tabBar中，使用switchTab跳转
    wx.switchTab({
      url: '/pages/solutions/solutions'
    });
  },

  // 加载应用版本
  loadAppVersion: function() {
    const app = getApp();
    const version = app.globalData.appVersion || 'professional';

    let config, openGuide, pageTitle, emptyText;

    if (version === 'lifestyle') {
      config = lifestyleConfig;
      openGuide = lifestyleConfig.conflictExtraction.openingGuide;
      pageTitle = lifestyleConfig.conflictExtraction.pageTitle;
      emptyText = lifestyleConfig.conflictExtraction.emptyConflict;
    } else {
      // 专业版（原有逻辑）
      config = {
        pageTitles: {
          conflicts: '矛盾分析矩阵',
          solutions: '创新解决方案',
          questionnaire: 'TRIZ问题分析',
          profile: '我的九宫格'
        },
        openGuide: '',
        pageTitle: '矛盾分析矩阵',
        emptyText: '暂无矛盾数据'
      };
    }

    this.setData({
      version,
      config,
      openGuide,
      pageTitle,
      emptyText,
      themeClass: version === 'lifestyle' ? 'theme-lifestyle' : 'theme-professional'
    });
  },

  // 调用GLM API（支持生活版prompt）
  callGLMAPI: function(prompt, callback, retryCount = 0) {
    const MAX_RETRY = 3;

    // 注意：conflicts.js中有testModeEnabled但没有定义，需要添加
    if (this.testModeEnabled) {
      setTimeout(() => {
        let mockResponse;

        if (this.data.version === 'lifestyle') {
          // 生活版mock响应
          mockResponse = {
            conflictName: '自主的渴望 vs 归属的安全',
            innerDrama: '我既想在这个城市扎根、建立归属感，但又害怕失去探索其他可能性...内心很纠结，既想稳定下来，又怕错过外面的世界。',
            deepValues: '这个困境的核心冲突是"自由"与"安全"，既想追求个人成长，又渴望稳定的生活环境。',
            intensity: 'medium'
          };
        } else {
          // 专业版mock响应（原有）
          mockResponse = {
            title: `用户想改善自信心，但不能这样做，因为会导致技能被取代的风险`,
            description: `在当前AI技术快速发展的时代，提升自信心是用户的核心需求。但是如果过度依赖外部环境或工作成就来获得自信，一旦这些因素发生变化，自信心就会受到严重影响。这是一个典型的矛盾：需要内心的强大，但同时又受制于外部环境的变化。技术原因是，自信心本应建立在内在实力和 self-knowledge 的基础上，但在现代社会中，人们往往将 self-worth 与职业成就紧密挂钩。因此，需要找到一种平衡：既能提升自信心，又不完全依赖外部因素。`
          };
        }

        console.log(`[TEST MODE ${this.data.version.toUpperCase()}] Mock响应:`, mockResponse);
        callback(JSON.stringify(mockResponse));
      }, TEST_MODE.mockDelay);
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
              content: this.data.version === 'lifestyle' 
                ? '你是一位敏锐的生活教练，擅长识别人的生活两难困境。'
                : '你是一个TRIZ问题分析专家，擅长分析技术矛盾并提取矛盾标题。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.7,
          stream: false
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices[0]) {
            const hint = res.data.choices[0].message.content;
            console.log('成功获取AI提示:', hint);
            callback(hint);
          } else {
            console.error('API响应格式错误:', res.data);
            this.setData({ apiStatus: 'API错误', aiLoading: false });
            callback(null);
          }
        },
        fail: (err) => {
          console.error('网络请求失败:', err);
          if (retryCount < MAX_RETRY) {
            console.log(`重试 (${retryCount + 1}/${MAX_RETRY})...`);
            setTimeout(() => {
              this.callGLMAPI(prompt, callback, retryCount + 1);
            }, 1000 * (retryCount + 1));
          } else {
            callback(null);
          }
        }
      });
    } catch (error) {
      console.error('API调用异常:', error);
      callback(null);
    }
  },

  // 重新渲染页面内容（版本切换时调用）
  renderPageContent: function() {
    this.loadAppVersion();
    this.loadTheme();
  },

  // 页面显示时重新加载
  onShow: function() {
    this.loadAppVersion();
    this.loadTheme();
  },

  // 系统主题切换回调
  onThemeChanged(newTheme) {
    this.loadTheme();
  }
});
