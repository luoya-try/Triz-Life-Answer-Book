const { API_CONFIG, TEST_MODE } = require('../questionnaire/config.js');
const lifestyleConfig = require('../../utils/lifestyleConfig.js');
const lifestylePrinciples = require('../../utils/lifestylePrinciples.js');
const lifestylePrompts = require('../../utils/lifestylePrompts.js');

Page({
  data: {
    conflicts: [],
    conflictOptions: [],
    selectedConflictIds: [],
    selectedConflicts: [],
    selectedConflict: null,
    trizPrinciples: [],
    lifestylePrinciples: [],
    recommendedPrinciples: [],
    selectedPrinciples: [],
    selectedPrincipleWithNames: [],
    solution: '',
    solutions: [],
    featuredPrincipleIds: [1, 13, 23, 9, 5, 24, 2, 15, 19, 22],
    principleExpandedDescs: {
      1: '化整为零，把复杂问题拆解成很容易解决的小问题。',
      13: '当常规思路遇到阻碍时，可以思考一下相反的方向或方法，打破"理所当然"的思维定势。',
      19: '通过"回头看结果"来"调整下一步动作"，形成一个信息循环回路，让系统能够自我修正、持续优化。',
      9: '预先施加反作用，以抵消事后可能出现的不利结果。',
      5: '在空间上合并相似物体或操作，使其并行工作。',
      22: '使用中介物传递或执行作用，或临时连接易移动物体。',
      2: '从物体中抽出产生负面影响的部分或仅抽出必要部分。',
      15: '使物体或其环境能自动调整至最优状态，或分成可相对移动的部分。',
      19: '持续工作，使所有部分一直满负荷，消除空转和间歇。',
      22: '利用有害因素获得积极效果，或结合多个有害因素消除它们。'
    },
    principlesExpanded: false,
    featuredPrinciples: [],
    remainingPrinciples: [],
    displayedPrinciples: [],
    showTooltip: false,
    tooltipText: '',
    tooltipPosition: null,
    tooltipTimer: null,
    tooltipFadeOut: false,
    aiLoading: false,
    apiStatus: '',
    testModeEnabled: TEST_MODE.enabled,
    themeClass: 'simple-theme',
    showSaveModal: false,
    tempSolution: '',
    version: 'professional',
    config: lifestyleConfig,
    pageTitle: '解决方案',
    openGuide: '',
    viewIndex: -1
  },

  loadAppVersion: function() {
    const app = getApp();
    const version = app.globalData.appVersion || 'professional';
    
    console.log('【解决方案页面】当前appVersion:', version);
    
    this.setData({ version: version });
    
    if (version === 'lifestyle') {
      console.log('【解决方案页面】加载生活版配置');
      this.setData({
        pageTitle: lifestyleConfig.pageTitles.solutions,
        openGuide: lifestyleConfig.solution.openingGuide,
        lifestylePrinciples: lifestylePrinciples,
        config: lifestyleConfig
      });
    } else {
      console.log('【解决方案页面】加载专业版配置');
      this.setData({
        pageTitle: '解决方案',
        openGuide: '',
        config: {}
      });
    }
  },

  onLoad: function() {
    this.loadAppVersion();
    
    console.log('===解决方案页面 onLoad 开始===');
    const app = getApp();
    const conflicts = app.globalData.conflicts || [];
    const trizPrinciples = app.globalData.trizPrinciples;
    const version = this.data.version;

    console.log('【解决方案页面】全局 conflicts 数量:', conflicts.length);
    console.log('【解决方案页面】全局 conflicts 数据:', conflicts);
    console.log('【解决方案页面】当前版本:', version);
    console.log('【解决方案页面】全局 trizPrinciples 数量:', trizPrinciples ? trizPrinciples.length : 0);

    if (!conflicts || conflicts.length === 0) {
      console.warn('【解决方案页面】警告：onLoad 中没有矛盾数据');
      this.setData({
        apiStatus: '请先完成问卷和矛盾提取流程'
      });
    }

    if (!trizPrinciples || trizPrinciples.length === 0) {
      console.warn('【解决方案页面】警告：没有 TRIZ 原理数据');
    }

    const conflictOptions = conflicts.map(c => ({
      id: c.id,
      name: c.title || c.conflictName || `${c.cell1Name} vs ${c.cell2Name}`,
      cell1Name: c.cell1Name,
      cell2Name: c.cell2Name
    }));

    console.log('【解决方案页面】生成的 conflictOptions 数量:', conflictOptions.length);

    let principles = version === 'lifestyle' ? lifestylePrinciples : trizPrinciples;
    const featuredPrincipleIds = this.data.featuredPrincipleIds;
    const featuredPrinciples = principles.filter(p =>
      featuredPrincipleIds.includes(p.id)
    );
    const remainingPrinciples = principles.filter(p =>
      !featuredPrincipleIds.includes(p.id)
    );

    this.setData({
      conflicts: conflicts,
      conflictOptions: conflictOptions,
      trizPrinciples: version === 'lifestyle' ? [] : trizPrinciples,
      lifestylePrinciples: version === 'lifestyle' ? lifestylePrinciples : [],
      featuredPrinciples: featuredPrinciples,
      remainingPrinciples: remainingPrinciples,
      displayedPrinciples: featuredPrinciples,
      solutions: app.globalData.solutions || [],
      themeClass: (app.globalData.theme || 'simple') + '-theme'
    });

    console.log('===解决方案页面 onLoad 结束===');
  },

  onShow: function() {
    this.loadAppVersion();
    
    const app = getApp();
    const theme = app.globalData.theme || 'simple';
    this.setData({ themeClass: theme + '-theme' });

    const conflicts = app.globalData.conflicts || [];
    const trizPrinciples = app.globalData.trizPrinciples;
    const version = this.data.version;

    console.log('===解决方案页面 onShow 开始===');
    console.log('【解决方案页面】全局 conflicts 数量:', conflicts.length);
    console.log('【解决方案页面】当前版本:', version);

    if (!conflicts || conflicts.length === 0) {
      console.warn('【解决方案页面】警告：没有矛盾数据');
      this.setData({
        apiStatus: '请先完成问卷和矛盾提取流程'
      });
      return;
    }

    const conflictOptions = conflicts.map(c => ({
      id: c.id,
      name: c.title || c.conflictName || `${c.cell1Name} vs ${c.cell2Name}`,
      cell1Name: c.cell1Name,
      cell2Name: c.cell2Name
    }));

    console.log('【解决方案页面】生成的 conflictOptions 数量:', conflictOptions.length);

    let principles = version === 'lifestyle' ? this.data.lifestylePrinciples : trizPrinciples;
    const featuredPrincipleIds = this.data.featuredPrincipleIds;
    const featuredPrinciples = principles.filter(p =>
      featuredPrincipleIds.includes(p.id)
    );
    const remainingPrinciples = principles.filter(p =>
      !featuredPrincipleIds.includes(p.id)
    );

    this.setData({
      conflicts: conflicts,
      conflictOptions: conflictOptions,
      featuredPrinciples: featuredPrinciples,
      remainingPrinciples: remainingPrinciples,
      displayedPrinciples: featuredPrinciples,
      solutions: app.globalData.solutions
    });

    console.log('===解决方案页面 onShow 结束===');
  },

  // 主题切换回调
  onThemeChanged: function(newTheme) {
    this.setData({ themeClass: newTheme + '-theme' });
  },

  // 跳转到问卷页面
  gotoQuestionnaire: function() {
    wx.switchTab({
      url: '/pages/questionnaire/questionnaire'
    });
  },

  onConflictCheckboxChange: function(e) {
    const selectedConflictId = parseInt(e.detail.value);

    if (!selectedConflictId) {
      this.setData({
        selectedConflictIds: [],
        selectedConflicts: [],
        selectedConflict: null,
        selectedPrinciples: [],
        selectedPrincipleWithNames: [],
        solution: '',
        viewIndex: -1
      });
      return;
    }

    const selectedConflict = this.data.conflicts.find(c => c.id === selectedConflictId);

    if (!selectedConflict) {
      console.error('选中的矛盾不存在:', selectedConflictId);
      return;
    }

    this.setData({
      selectedConflictIds: [selectedConflictId],
      selectedConflicts: [selectedConflict],
      selectedConflict: selectedConflict,
      selectedPrinciples: [],
      selectedPrincipleWithNames: [],
      solution: '',
      viewIndex: -1
    });

    this.recommendPrinciplesWithAI(selectedConflict);
  },

  isConflictSelected: function(id) {
    return this.data.selectedConflictIds.includes(id);
  },
  
  recommendPrinciplesWithAI: function(conflict) {
    this.setData({ aiLoading: true, apiStatus: 'AI正在分析推荐原理...' });
    
    const version = this.data.version;
    let prompt;
    
    console.log('【解决方案页面】recommendPrinciplesWithAI，版本:', version);
    
    if (version === 'lifestyle') {
      const conflictDescription = conflict.innerDrama ? 
        `${conflict.conflictName}\n内心戏：${conflict.innerDrama}\n深层价值：${conflict.deepValues}` :
        `${conflict.cell1Name} vs ${conflict.cell2Name}\n描述：${conflict.description}`;
      
      prompt = lifestylePrompts.solutions.recommendPrinciples(conflictDescription);
      console.log('【解决方案页面】使用生活版prompts');
    } else {
      prompt = `你是一位TRIZ发明理论专家，正在分析技术矛盾并推荐最合适的TRIZ发明原理。

技术矛盾：${conflict.description}
矛盾对：${conflict.cell1Name} vs ${conflict.cell2Name}

任务：从TRIZ的40个发明原理中，选择最适合解决这个矛盾的3-5个原理。

要求：
1. 根据矛盾的技术特征，选择3-5个最相关的原理
2. 只返回原理编号（用逗号分隔），不要其他文字

示例：1,15,35

请直接返回原理编号，用逗号分隔。`;
      console.log('【解决方案页面】使用专业版prompts');
    }
    
    this.callGLMAPI(prompt, (result) => {
      let principleIds;
      
      if (version === 'lifestyle') {
        try {
          const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;
          principleIds = parsedResult.recommendedPrinciples || [];
        } catch (e) {
          console.error('【解决方案页面】解析生活版推荐结果失败:', e);
          principleIds = [1, 5, 12, 22, 35].slice(0, 5);
        }
      } else {
        principleIds = result ? result.split(/[,，]/).map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0 && n <= 40) : [];
      }
      
      const principles = version === 'lifestyle' ? this.data.lifestylePrinciples : this.data.trizPrinciples;
      const recommendedPrinciples = principleIds.length > 0 
        ? principles.filter(p => principleIds.includes(p.id)).slice(0, 2)
        : principles.slice(0, 2);

      const selectedPrinciples = recommendedPrinciples.map(p => p.id);
      const selectedPrincipleWithNames = recommendedPrinciples.map(p => ({
        id: p.id,
        name: p.name
      }));

      this.setData({
        recommendedPrinciples,
        selectedPrinciples,
        selectedPrincipleWithNames,
        aiLoading: false,
        apiStatus: version === 'lifestyle' ? '✨ 已为你挑选合适的透镜' : 'AI推荐完成'
      });
      
      console.log('【解决方案页面】推荐完成，推荐数量:', recommendedPrinciples.length);
    });
  },
  
  callGLMAPI: function(prompt, callback) {
    const version = this.data.version;
    
    if (this.data.testModeEnabled) {
      setTimeout(() => {
        if (version === 'lifestyle') {
          callback(JSON.stringify({
            recommendedPrinciples: [1, 5].slice(0, 2),
            reasoning: '基于你的困境，这些透镜能帮你从不同角度看待问题。'
          }));
        } else {
          callback('1,15');
        }
      }, TEST_MODE.mockDelay);
      return;
    }
    
    try {
      const systemContent = version === 'lifestyle' 
        ? '你是一位熟悉40个人生引导原理的生活教练，擅长分析生活困境并推荐合适的引导原理。'
        : '你是一个TRIZ发明理论专家，擅长分析矛盾并推荐合适的发明原理。';
      
      console.log('【解决方案页面】callGLMAPI，版本:', version);
      
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
              content: systemContent
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: version === 'lifestyle' ? 300 : 100,
          temperature: 0.3,
          top_p: 0.3,
          stream: false
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices[0]) {
            const result = res.data.choices[0].message.content.trim();
            console.log('【解决方案页面】API返回内容:', result.substring(0, 100) + '...');
            callback(result);
          } else {
            console.error('【解决方案页面】API返回异常:', res);
            callback(null);
          }
        },
        fail: (err) => {
          console.error('【解决方案页面】API调用失败:', err);
          callback(null);
        }
      });
    } catch (error) {
      console.error('【解决方案页面】API调用异常:', error);
      callback(null);
    }
  },

  callGLMAPIForSolution: function(prompt, callback) {
    const version = this.data.version;
    const conflict = this.data.selectedConflict;
    const selectedPrinciples = this.data.selectedPrinciples;
    
    if (this.data.testModeEnabled) {
      setTimeout(() => {
        if (version === 'lifestyle') {
          const principles = this.data.lifestylePrinciples.filter(p => selectedPrinciples.includes(p.id));
          const conflictInfo = conflict.innerDrama 
            ? `困境：${conflict.conflictName}\n内心戏：${conflict.innerDrama}\n深层价值：${conflict.deepValues}`
            : `矛盾：${conflict.cell1Name} vs ${conflict.cell2Name}`;
          
          const principleNames = principles.map(p => p.name).join('、');
          
          callback(JSON.stringify({
            contradiction: `你把"获得${conflict.cell1Name}"与"${conflict.cell2Name}"完全对立，认为鱼与熊掌不可兼得。`,
            
            principleLens: `${principleNames}透镜揭示：你对${conflict.cell2Name}的恐惧，本质上是一种过度保护机制。${conflict.cell2Name}并不像你想象的那么脆弱或不可失去，它实际上可以在新的框架下被重新定义和满足。`,
            
            insight: `${conflict.cell1Name}与${conflict.cell2Name}不是非此即彼的选择。真正的安全感和成长，可以在小范围的${conflict.cell2B2Name}测试中同时获得。带着恐惧行动，不是冒险，而是用最小的代价验证恐惧是否真实。`,
            
            action: `从今天起，每当出现"我必须...否则就..."的想法时，停顿3秒。写下："如果我大胆尝试，最坏的结果是什么？这个结果真的会发生吗？历史上类似情况的结果如何？"然后做一件相关但风险微小的事，完成后记录真实结果。`,
            
            anchor: '改变的第一个信号，往往不是恐惧的消失，而是你觉察到它却依然向前迈出的那一小步。'
          }));
        } else {
          const principles = this.data.trizPrinciples.filter(p => selectedPrinciples.includes(p.id));
          const principleDesc = principles.map(p => p.description.substring(0, 50)).join('；');
          
          callback(`【矛盾深度剖析】
在${conflict.cell1Name} vs ${conflict.cell2Name}矛盾中，改善${conflict.cell1Name}会导致${conflict.cell2Name}劣化的根本原因是：在现有技术架构下，${conflict.cell2Name}作为固有约束，限制了${conflict.cell1Name}的优化空间。所有试图改善${conflict.cell1Name}的技术手段，必然占用${conflict.cell2Name}的资源配额。
比如在续航技术中，提升能量密度必然增加电极物质密度，这会直接导致：锂离子传输距离缩短导致内阻增大（能量损耗增加），热集中加剧导致电解质分解风险提升（安全性下降），热管理需求增加导致占用更多体积和重量（空间约束加剧）。这种相互制衡的本质是：在"固定结构"的电池设计架构下，能量密度、安全性和成本形成了不可突破的三角约束。

【创新性应用】
应用${principleNames}原理的核心思想是：不要在"优化参数"的思维框架下工作，而是"重新定义系统"。这个原理的根本性突破在于：它揭示了问题的关键不是"如何让电池密度更高"，而是"改变用户使用电池的方式"。具体应用方式包括：1) 模块化设计将电池拆解为多个独立模块，改变"电池是固定整体"的思维；2) 快换网络重构了"续航"的概念，续航不再是固定属性而是可扩展服务。

【实施路径】
1. 重构系统架构：设计"模块能量单元"，每个单元50-80km续航，通过快速更换实现灵活续航。这打破了续航是电池固有属性的假设。
2. 创新性应用：建立"能量交换网络"，在主要城市布局换电站。这把续航问题从技术问题转变为运营问题，降低了技术风险。
 3. 实施验证：先在出租车/网约车等商业车辆试点，快速验证商业模式和技术可靠性，然后逐步扩展到乘用车市场。`);
        
        }
      }, TEST_MODE.mockDelay);
      return;
    }
    
    try {
      const systemContent = version === 'lifestyle' 
        ? '你是一位融合了智慧与温暖的人生策略顾问，擅长运用人生引导原理为生活困境生成富有启发性的行动地图。'
        : '你是一个TRIZ发明理论专家，擅长深度分析技术矛盾并生成创新性的具体解决方案。';
      
      console.log('【解决方案页面】callGLMAPIForSolution，版本:', version);
      
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
              content: systemContent
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: version === 'lifestyle' ? 800 : 1000,
          temperature: 0.7,
          top_p: 0.8,
          stream: false
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices && res.data.choices[0]) {
            const result = res.data.choices[0].message.content.trim();
            console.log('【解决方案页面】API返回内容长度:', result.length);
            callback(result);
          } else {
            console.error('【解决方案页面】API返回异常:', res);
            callback(null);
          }
        },
        fail: (err) => {
          console.error('【解决方案页面】API调用失败:', err);
          callback(null);
        }
      });
    } catch (error) {
      console.error('【解决方案页面】API调用异常:', error);
      callback(null);
    }
  },
   
  selectPrinciple: function(e) {
    const id = e.currentTarget.dataset.id;
    const isSelected = this.isPrincipleSelected(id);
    
    let selectedPrinciples = [...this.data.selectedPrinciples];
    if (isSelected) {
      // 如果已选中，则取消选择
      selectedPrinciples = selectedPrinciples.filter(p => p !== id);
    } else {
      // 如果未选中，检查是否已达到2个上限
      if (selectedPrinciples.length >= 2) {
        wx.showToast({
          title: '最多只能选择2个原理',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      selectedPrinciples.push(id);
    }
    
    // 更新带名称的原理列表（根据版本选择正确的principles）
    const principles = this.data.version === 'lifestyle' 
      ? this.data.lifestylePrinciples 
      : this.data.trizPrinciples;
    
    const selectedPrincipleWithNames = selectedPrinciples.map(id => {
      const principle = principles.find(p => p.id === id);
      return principle ? { id: principle.id, name: principle.name } : { id: id, name: '' };
    });
    
    this.setData({ 
      selectedPrinciples,
      selectedPrincipleWithNames
    });
  },
  
  isPrincipleSelected: function(id) {
    return this.data.selectedPrinciples.includes(id);
  },

  removeSelectedPrinciple: function(e) {
    const id = e.currentTarget.dataset.id;
    const selectedPrinciples = this.data.selectedPrinciples.filter(p => p !== id);
    
    // 更新带名称的原理列表（根据版本选择正确的principles）
    const principles = this.data.version === 'lifestyle' 
      ? this.data.lifestylePrinciples 
      : this.data.trizPrinciples;
    
    const selectedPrincipleWithNames = selectedPrinciples.map(id => {
      const principle = principles.find(p => p.id === id);
      return principle ? { id: principle.id, name: principle.name } : { id: id, name: '' };
    });
    
    this.setData({ 
      selectedPrinciples,
      selectedPrincipleWithNames
    });
    
    wx.showToast({
      title: '已移除原理',
      icon: 'none',
      duration: 1000
    });
  },

  selectPrincipleAndShowTooltip: function(e) {
    const id = e.currentTarget.dataset.id;
    const isSelected = this.isPrincipleSelected(id);

    let selectedPrinciples = [...this.data.selectedPrinciples];
    if (isSelected) {
      selectedPrinciples = selectedPrinciples.filter(p => p !== id);
    } else {
      // 检查是否已达到2个上限
      if (selectedPrinciples.length >= 2) {
        wx.showToast({
          title: '最多只能选择2个原理',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      selectedPrinciples.push(id);
    }

    // 更新带名称的原理列表（根据版本选择正确的principles）
    const principles = this.data.version === 'lifestyle' 
      ? this.data.lifestylePrinciples 
      : this.data.trizPrinciples;
    
    const selectedPrincipleWithNames = selectedPrinciples.map(id => {
      const principle = principles.find(p => p.id === id);
      return principle ? { id: principle.id, name: principle.name } : { id: id, name: '' };
    });

    this.setData({
      selectedPrinciples,
      selectedPrincipleWithNames
    });

    this.showPrincipleTooltip(e);
  },

  showPrincipleTooltip: function(e) {
    let id = e.currentTarget.dataset.id;
    const version = this.data.version;

    let tooltipText;

    if (version === 'lifestyle') {
      const principle = this.data.lifestylePrinciples.find(p => p.id === id);

      if (principle) {
        tooltipText = `【${principle.name}（${principle.tag}）】\n${principle.description}\n\n应用：${principle.application}`;
      } else {
        tooltipText = this.data.principleExpandedDescs[id] || '透镜暂时不可用';
      }
    } else {
      const principle = this.data.trizPrinciples.find(p => p.id === id);
      tooltipText = this.data.principleExpandedDescs[id] || (principle ? principle.description : '原理描述不可用');
    }

    this.setData({
      showTooltip: true,
      tooltipText: tooltipText,
      tooltipFadeOut: false
    });

    if (this.data.tooltipTimer) {
      clearTimeout(this.data.tooltipTimer);
    }

    let timer = setTimeout(() => {
      this.setData({ tooltipFadeOut: true });

      setTimeout(() => {
        this.setData({
          showTooltip: false,
          tooltipText: '',
          tooltipFadeOut: false
        });
      }, 300);
    }, 2500);

    this.setData({ tooltipTimer: timer });
  },

  togglePrinciplesExpand: function() {
    const expanded = !this.data.principlesExpanded;
    const displayedPrinciples = expanded
      ? [...this.data.featuredPrinciples, ...this.data.remainingPrinciples]
      : this.data.featuredPrinciples;

    this.setData({
      principlesExpanded: expanded,
      displayedPrinciples: displayedPrinciples
    });
  },

  toggleSolution: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      viewIndex: this.data.viewIndex === index ? -1 : index
    });
  },
  
  onSolutionInput: function(e) {
    this.setData({ solution: e.detail.value });
  },
  
  generateSolution: function() {
    if (!this.data.selectedConflict) {
      wx.showToast({ title: '请选择矛盾对', icon: 'none' });
      return;
    }
    
    if (this.data.selectedPrinciples.length === 0) {
      wx.showToast({ title: '请选择1-2个原理', icon: 'none' });
      return;
    }
    
    this.setData({ isGenerating: true });
    
    const app = getApp();
    const conflict = this.data.selectedConflict;
    const selectedPrinciples = this.data.selectedPrinciples;
    const version = this.data.version;
    const config = this.data.config;
    
    let prompt;
    
    console.log('【解决方案页面】generateSolution，版本:', version);
    
    if (version === 'lifestyle') {
      const principles = this.data.lifestylePrinciples.filter(p => selectedPrinciples.includes(p.id));
      const conflictDescription = conflict.innerDrama ? 
        `困境名称：${conflict.conflictName}\n内心戏：${conflict.innerDrama}\n深层价值：${conflict.deepValues}` :
        `${conflict.cell1Name} vs ${conflict.cell2Name}\n描述：${conflict.description}`;
      
      const userBackground = `困境涉及维度：${conflict.cell1Name} vs ${conflict.cell2Name}`;
      
      prompt = lifestylePrompts.solutions.generateActionMap(principles, conflictDescription, userBackground);
      console.log('【解决方案页面】使用生活版prompts生成行动地图');
    } else {
      const principles = this.data.trizPrinciples.filter(p => selectedPrinciples.includes(p.id));
      const principleNames = principles.map(p => p.name).join('、');

      prompt = `你是一位经验丰富的TRIZ发明理论专家，正在为技术矛盾寻找创新性解决方案。请深入分析矛盾的内在机制，提供具体的解决思路。

【矛盾信息】
矛盾描述：${conflict.description}
涉及要素：${conflict.cell1Name} vs ${conflict.cell2Name}

【选中的TRIZ原理】
${principles.map(p => `${p.id}. ${p.name}：${p.description}`).join('\n')}

【你的任务】
生成一份800字以上的深度解决方案。核心要求：
1. 深入剖析矛盾：为什么改善${conflict.cell1Name}会导致${conflict.cell2Name}劣化？具体的技术机制是什么？这个矛盾的根源是什么？是否存在行业思维桎梥？
2. 具体应用原理：${principleNames}原理如何具体应用到这个矛盾中？不要只是罗列原理名称，而要说明它们如何重新定义问题，打破传统的思维框架，实现突破性的解决方案。
3. 提供具体的实施路径：给出具体的解决思路，包括思维转变、方法创新和实施策略。

【输出要求】
• 请严格按照以下3个部分输出，每个部分都必须用【】开头作为标题
• 【矛盾深度剖析】深入分析问题的本质，揭示隐含的约束条件和思维桎梥
• 【创新性应用】具体说明如何应用${principleNames}原理，以及这个应用如何颠覆传统认知
• 【实施路径】给出3个具体的操作步骤，包括思维转变、方法创新和验证方法
• 必须包含具体的技术细节或案例，不能泛泛而谈
• 语言专业、有深度，让读者能够获得"原来问题可以这样解决！"的顿悟`;
      console.log('【解决方案页面】使用专业版prompts生成解决方案');
    }
    
    this.callGLMAPIForSolution(prompt, (solutionText) => {
      console.log('【解决方案页面】收到 solutionText 长度:', solutionText ? solutionText.length : 0);
      console.log('【解决方案页面】原始内容:', solutionText.substring(0, 200));
      
      if (solutionText) {
        if (version === 'lifestyle') {
          let actionMap;
          try {
            // 清理AI返回的markdown格式（去除 ```json 和 ``` 标记）
            let cleanText = solutionText.trim();
            cleanText = cleanText.replace(/^```json\s*\n?/i, '').replace(/\n?\s*```$/i, '');
            cleanText = cleanText.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '');
            
            console.log('【解决方案页面】清理后内容:', cleanText.substring(0, 200));
            
            actionMap = JSON.parse(cleanText);

            // 认知转换式格式
            const formattedSolution = `💡 矛盾剖析\n${actionMap.contradiction}\n\n👁️ 原理透镜\n${actionMap.principleLens}\n\n🔄 认知跃迁\n${actionMap.insight}\n\n🚀 最小行动\n${actionMap.action}\n\n✨ ${actionMap.anchor}`;

            this.setData({
              solution: formattedSolution,
              isGenerating: false
            });
            console.log('【解决方案页面】已设置认知转换式方案, 长度:', formattedSolution.length);
          } catch (e) {
            console.error('【解决方案页面】解析生活版action map失败:', e);
            // 使用降级方案
            const principles = this.data.lifestylePrinciples.filter(p => selectedPrinciples.includes(p.id));
            let fallbackSolution = `💡 矛盾剖析\n你正面临${conflict.cell1Name}与${conflict.cell2Name}之间的内在冲突。\n\n`;
            fallbackSolution += `👁️ 原理透镜\n${principles.map(p => `${p.name}透镜`).join('、')}提供全新的审视视角，帮助你重新理解这个困境。\n\n`;
            fallbackSolution += `🔄 认知跃迁\n试着把"我在失去什么"换成"我在获得什么"，\n你会发现世界其实没那么糟糕。\n\n`;
            fallbackSolution += `🚀 最小行动\n今天先做一个小小的尝试，给 自己一个机会重新认识自己。\n\n`;
            fallbackSolution += `✨ 改变的第一个信号，往往不是恐惧的消失，而是你觉察到它却依然向前迈出的那一小步。`;

            this.setData({
              solution: fallbackSolution,
              isGenerating: false
            });
          }
        } else {
          console.log('【解决方案页面】完整内容:', solutionText);
          this.setData({
            solution: solutionText,
            isGenerating: false
          });
          console.log('【解决方案页面】已设置专业版solution, 长度:', solutionText.length);
        }
        } else {
          if (version === 'lifestyle') {
            const principles = this.data.lifestylePrinciples.filter(p => selectedPrinciples.includes(p.id));
            let fallbackSolution = `💡 矛盾剖析\n你正面临${conflict.cell1Name}与${conflict.cell2Name}之间的内在冲突。\n\n`;
            fallbackSolution += `👁️ 原理透镜\n${principles.map(p => `${p.name}透镜`).join('、')}提供全新的审视视角。\n\n`;
            fallbackSolution += `🔄 认知跃迁\n试着从"我在失去什么"转向"我可能获得什么"。\n\n`;
            fallbackSolution += `🚀 最小行动\n今天先做一个小小的尝试，看看会有什么不同。\n\n`;
            fallbackSolution += `✨ 改变的第一个信号，往往不是恐惧的消失，而是你觉察到它却依然向前迈出的那一小步。`;

            this.setData({
              solution: fallbackSolution,
              isGenerating: false
            });
        } else {
          const principles = this.data.trizPrinciples.filter(p => selectedPrinciples.includes(p.id));
          let solutionText = `基于矛盾：${conflict.cell1Name} vs ${conflict.cell2Name}\n`;
          solutionText += `应用原理：${principles.map(p => p.name).join('、')}\n\n`;
          solutionText += `解决方案：\n`;
          principles.forEach(principle => {
            solutionText += `- ${principle.name}：应用${principle.description}来解决${conflict.cellName}的问题\n`;
          });

          this.setData({
            solution: solutionText,
            isGenerating: false
          });
        }
      }
    });
  },
  
  openSaveModal: function() {
    if (!this.data.selectedConflict || this.data.selectedPrinciples.length === 0 || !this.data.solution) {
      wx.showToast({ title: '请选择矛盾对、原理并生成解决方案', icon: 'none' });
      return;
    }
    this.setData({
      showSaveModal: true,
      tempSolution: this.data.solution
    });
  },

  deleteSolution: function(e) {
    const index = e.currentTarget.dataset.index;
    const solutions = [...this.data.solutions];
    solutions.splice(index, 1);

    this.setData({ solutions });

    const app = getApp();
    app.globalData.solutions = solutions;

    try {
      wx.setStorageSync('saved_solutions', solutions);
    } catch (e) {}

    wx.showToast({ title: '解决方案已删除', icon: 'success' });
  },

  closeSaveModal: function() {
    this.setData({ showSaveModal: false });
  },

  onEditInput: function(e) {
    this.setData({ tempSolution: e.detail.value });
  },

  confirmSave: function() {
    const app = getApp();
    const conflict = this.data.selectedConflict;
    const selectedPrinciples = this.data.selectedPrinciples;
    const solution = this.data.tempSolution;
    let currentGridId = app.globalData.currentGridId;
    const gridData = app.globalData.gridData;

    const now = Date.now();

    const newSolution = {
      id: now,
      conflict: `${conflict.cell1Name} vs ${conflict.cell2Name}`,
      conflictId: conflict.id,
      conflictName: conflict.name || conflict.title || `${conflict.cell1Name} vs ${conflict.cell2Name}`,
      principles: selectedPrinciples.map(id => {
        const principle = app.globalData.trizPrinciples.find(p => p.id === id) ||
                         app.globalData.lifestylePrinciples?.find(p => p.id === id);
        return principle ? principle.name : id;
      }),
      principleIds: selectedPrinciples,
      content: solution,
      timestamp: now,
      time: new Date().toLocaleString(),
      gridId: currentGridId
    };

    const solutions = [...this.data.solutions, newSolution];
    app.globalData.solutions = solutions;

    try {
      // 获取已保存的九宫格
      const savedGrids = wx.getStorageSync('savedGrids') || [];
      
      // 如果没有currentGridId，尝试通过gridData找到匹配的九宫格
      if (!currentGridId && gridData) {
        const centerContent = gridData.center || gridData.centerContent || '';
        const existingGrid = savedGrids.find(g => 
          g.gridData && g.gridData.center === centerContent
        );
        if (existingGrid) {
          currentGridId = existingGrid.id;
          app.globalData.currentGridId = currentGridId;
          newSolution.gridId = currentGridId;
        }
      }

      // 如果仍然没有九宫格，自动保存九宫格
      if (!currentGridId && gridData) {
        const newGrid = {
          id: now,
          name: (gridData.center || gridData.centerContent || '未命名九宫格').substring(0, 50),
          gridData: gridData,
          timestamp: now,
          solutions: [newSolution]
        };
        
        savedGrids.push(newGrid);
        wx.setStorageSync('savedGrids', savedGrids);
        
        currentGridId = newGrid.id;
        app.globalData.currentGridId = currentGridId;
        newSolution.gridId = currentGridId;
        
        console.log('【解决方案】已自动保存九宫格:', newGrid.name);
      } else if (currentGridId) {
        // 找到已有九宫格并添加解决方案
        const gridIndex = savedGrids.findIndex(g => g.id === currentGridId);
        
        if (gridIndex !== -1) {
          if (!savedGrids[gridIndex].solutions) {
            savedGrids[gridIndex].solutions = [];
          }
          savedGrids[gridIndex].solutions.push(newSolution);
          wx.setStorageSync('savedGrids', savedGrids);
          console.log('【解决方案】已关联到九宫格:', savedGrids[gridIndex].name);
        }
      }
      
      wx.setStorageSync('saved_solutions', solutions);
    } catch (e) {
      console.error('【解决方案】保存失败:', e);
    }

    this.setData({
      solutions,
      solution: solution,
      showSaveModal: false
    });
    wx.showToast({ title: '方案已保存', icon: 'success' });
  }
});
