App({
  globalData: {
    // 九宫格数据
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
    // 矛盾对数据
    conflicts: [],
    // 解决方案数据
    solutions: [],
    // TRIZ 40个原理
    trizPrinciples: [
      { id: 1, name: '分割', description: '将物体分成独立的部分' },
      { id: 2, name: '抽取', description: '从物体中抽出产生负面影响的部分' },
      { id: 3, name: '局部质量', description: '将均匀的物体结构变为不均匀的' },
      { id: 4, name: '增加不对称性', description: '将对称物体变为不对称的' },
      { id: 5, name: '组合', description: '将相同或相似的物体组合在一起' },
      { id: 6, name: '多用性', description: '使物体具有多种功能' },
      { id: 7, name: '嵌套', description: '将一个物体放入另一个物体中' },
      { id: 8, name: '重量补偿', description: '通过与其他物体的相互作用抵消重量' },
      { id: 9, name: '预先反作用', description: '预先施加反作用力' },
      { id: 10, name: '预先作用', description: '预先对物体进行处理' },
      { id: 11, name: '预先应急措施', description: '预先准备好应对可能的问题' },
      { id: 12, name: '等势', description: '改变工作条件，消除需要提升的必要性' },
      { id: 13, name: '逆向思维', description: '将问题反转，从相反的角度考虑' },
      { id: 14, name: '曲面化', description: '将线性结构改为曲线结构' },
      { id: 15, name: '动态化', description: '使物体或其环境能够自动调整' },
      { id: 16, name: '不足或超额行动', description: '如果难以100%达到，就尝试做得更多或更少' },
      { id: 17, name: '空间维数变化', description: '将物体从一维变为二维或三维' },
      { id: 18, name: '机械振动', description: '使用振动或震荡' },
      { id: 19, name: '周期性动作', description: '将连续动作改为周期性动作' },
      { id: 20, name: '有效作用的连续性', description: '保持物体持续工作，消除空闲时间' },
      { id: 21, name: '紧急行动', description: '快速执行有害或危险的操作' },
      { id: 22, name: '变害为利', description: '利用有害因素获得有益效果' },
      { id: 23, name: '反馈', description: '引入反馈机制' },
      { id: 24, name: '中介物', description: '使用中间物体传递或转换能量' },
      { id: 25, name: '自服务', description: '使物体能够自我服务或自我修复' },
      { id: 26, name: '复制', description: '使用简单、便宜的复制品代替复杂、昂贵的物体' },
      { id: 27, name: '一次性用品', description: '用一次性物体代替长期使用的物体' },
      { id: 28, name: '机械系统替代', description: '用感官系统或其他系统替代机械系统' },
      { id: 29, name: '气压和液压结构', description: '使用气体或液体的压力' },
      { id: 30, name: '柔性外壳和薄膜', description: '使用柔性外壳或薄膜' },
      { id: 31, name: '多孔材料', description: '使物体多孔或添加多孔元素' },
      { id: 32, name: '颜色改变', description: '改变物体或其环境的颜色' },
      { id: 33, name: '同质性', description: '使物体与环境具有相同的材料' },
      { id: 34, name: '抛弃与修复', description: '抛弃或修复物体的部分' },
      { id: 35, name: '参数变化', description: '改变物体的物理或化学参数' },
      { id: 36, name: '相变', description: '利用物质的相变' },
      { id: 37, name: '热膨胀', description: '利用热膨胀或收缩' },
      { id: 38, name: '强氧化剂', description: '使用富氧空气或纯氧' },
      { id: 39, name: '惰性环境', description: '创建惰性环境' },
      { id: 40, name: '复合材料', description: '使用复合材料' }
    ],
    // 知识库数据
    knowledgeBase: [],
    // 主题风格：'simple' 或 'dopamine'
    theme: 'simple',
    // 应用版本：'professional' 或 'lifestyle'
    appVersion: 'lifestyle',
    // 当前九宫格ID（用于关联解决方案）
    currentGridId: null,
    // 语言配置
    language: 'zh-CN',
    // AI回复语言：强制中文
    aiLanguage: '中文'
  },

  onLaunch: function () {
    console.log('TRIZ问题分析小程序启动');
    // 加载本地存储的数据
    this.loadLocalData();
    // 加载主题
    this.loadTheme();
    // 加载应用版本
    this.loadAppVersion();
  },

  // 加载本地存储的数据
  loadLocalData: function() {
    try {
      const knowledgeBase = wx.getStorageSync('knowledgeBase');
      if (knowledgeBase) {
        this.globalData.knowledgeBase = knowledgeBase;
      }
    } catch (e) {
      console.error('加载本地数据失败:', e);
    }
  },

  // 加载主题
  loadTheme: function() {
    try {
      const savedTheme = wx.getStorageSync('theme');
      if (savedTheme && (savedTheme === 'simple' || savedTheme === 'dopamine')) {
        this.globalData.theme = savedTheme;
      }
    } catch (e) {
      console.log('加载主题失败');
    }
  },

  // 加载应用版本
  loadAppVersion: function() {
    try {
      const savedVersion = wx.getStorageSync('app_version');
      if (savedVersion && (savedVersion === 'professional' || savedVersion === 'lifestyle')) {
        this.globalData.appVersion = savedVersion;
      }
    } catch (e) {
      console.log('加载版本失败');
    }
  },

  // 保存数据到本地存储
  saveLocalData: function() {
    try {
      wx.setStorageSync('knowledgeBase', this.globalData.knowledgeBase);
    } catch (e) {
      console.error('保存本地数据失败:', e);
    }
  },

  // 添加矛盾-原理配对到知识库
  addToKnowledgeBase: function(conflict, principles) {
    const pair = {
      conflict: conflict,
      principles: principles,
      usageCount: 1,
      timestamp: new Date().getTime()
    };
    this.globalData.knowledgeBase.push(pair);
    this.saveLocalData();
  },

  // 根据矛盾推荐原理
  recommendPrinciples: function(conflict) {
    // 简单的推荐算法：查找相似矛盾的原理
    const similarPairs = this.globalData.knowledgeBase.filter(pair =>
      pair.conflict.includes(conflict) || conflict.includes(pair.conflict)
    );

    // 按使用次数排序
    similarPairs.sort((a, b) => b.usageCount - a.usageCount);

    // 返回推荐的原理ID
    const recommendedPrincipleIds = similarPairs.slice(0, 3).map(pair => pair.principles).flat();
    return recommendedPrincipleIds;
  },

  // 切换主题
  switchTheme: function(newTheme) {
    this.globalData.theme = newTheme;
    wx.setStorageSync('theme', newTheme);

    // 刷新所有页面
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page.onThemeChanged) {
        page.onThemeChanged(newTheme);
      }
    });
  }
});
