// 生活版配置文件 - 完整独立的文案和配置
// 用于"个人成长答案之书"模式

module.exports = {
  // 页面标题
  pageTitles: {
    questionnaire: '梳理你的故事',
    conflicts: '看见内心的拉扯',
    solutions: '点亮新的路径',
    profile: '我的答案'
  },

  // 按钮文字
  buttons: {
    next: '继续',
    prev: '返回',
    save: '保存起来',
    delete: '不要了',
    import: '导入旧记录',
    export: '导出',
    generate: '点亮新路径',
    analyze: 'AI解析填充',
    start: '开始梳理',
    continue: '继续呀'
  },

  // 占位文字
  placeholders: {
    answer: '用你自己的话说吧...',
    question: '把你内心的感受，用最真实的话写下来',
    aiInput: '请详细描述您当前面临的问题，包括涉及的人物、情境、时间线等...\n\n可以涵盖：\n- 问题的起源和发展\n- 相关的环境和背景\n- 你的感受和期望'
  },

  // 状态文字
  statuses: {
    loading: 'AI 正在思考...',
    complete: '✨ 想到了！',
    aiThinking: 'AI 在想...',
    aiGuidance: '💭 小提示'
  },

  // 其他文案
  progress: '第 {current} 步 / 共 {total} 步',
  aiAutoFill: '点击一下，AI自动帮你填好～',
  aiAutoFillDone: 'AI已经帮你填好 {filled} 格啦～',
  expand: '看看怎么办',
  collapse: '先收起来吧',

  // 九宫格开放引导词
  openingGuide: '让我们先花一点时间，从不同角度看看你面临的这件事。没有标准答案，只需写下你最先想到的、最真实的感受。',

  // 第一题固定引导语
  firstQuestionGuide: '描述你的现状：是什么样的情况？涉及哪些人？发生了什么？',

  // 九宫格九个问题（环境-自我-内心体系）
  questions: [
    {
      id: 'center',
      text: '此刻，你最想解开的一个心结或最渴望实现的一个改变是什么？',
      shortText: '💭 核心困扰',
      hint: '请用你自己的话描述它，不用在意格式，真实就好。',
      position: 'center'
    },
    {
      id: 'past-environment',
      text: '在更早的时候，是什么样的经历、信念或选择，为今天这个局面埋下了种子？',
      shortText: '🌈 过去的影响',
      hint: '回想一下，在这个问题出现之前，周围的环境是什么样的呢？比如有特别的背景或条件吗？',
      position: 'past-super'
    },
    {
      id: 'past-self',
      text: '那时候事情本身是什么样子的？',
      shortText: '📋 之前的状态',
      hint: '嗯，那问题还没出现的时候，这件事本身的状态是什么样的？比如它是什么样子的、怎么运作的？',
      position: 'past-system'
    },
    {
      id: 'past-inner',
      text: '过去的内部有哪些关键组成？',
      shortText: '⚙️ 内部组成（过去）',
      hint: '那内部有哪些关键的组成呢？比如有什么重要的组件或元素？',
      position: 'past-sub'
    },
    {
      id: 'current-environment',
      text: '现在周围有哪些情况或条件？',
      shortText: '🌤️ 现在的环境',
      hint: '现在呢，周围有哪些情况或条件？它们对你这个问题有什么影响？',
      position: 'current-super'
    },
    {
      id: 'current-self',
      text: '当下，你内心最主要的情绪是什么？（例如：焦虑、渴望、疲惫…）你为改变现状已经做了哪些努力？',
      shortText: '🔧 当前的自我',
      hint: '现在内部有哪些关键的部分呢？它们是怎么和这个问题互动的？',
      position: 'current-sub'
    },
    {
      id: 'future-environment',
      text: '你希望未来的环境变成什么样？',
      shortText: '🌟 想要的环境',
      hint: '想象一下，最理想的情况下，你希望周围的环境是怎样的呢？',
      position: 'future-super'
    },
    {
      id: 'future-self',
      text: '如果问题得以解决，你理想中半年或一年后的自己，会过着怎样的生活、有怎样的感觉？',
      shortText: '🎯 想要的样子',
      hint: '那你希望这件事最终变成什么样呢？比如它应该有什么功能、什么特点？',
      position: 'future-system'
    },
    {
      id: 'future-inner',
      text: '未来的内部结构应该怎样改进？',
      shortText: '⚡ 内部结构（未来）',
      hint: '想想看，未来的内部组成应该是什么样的？每个部分应该达到什么效果？',
      position: 'future-sub'
    }
  ],

  // 矛盾提取引导
  conflictExtraction: {
    pageTitle: '看见内心的拉扯',
    openingGuide: '我们的困扰，常常来源于内心两种同样重要价值的拉扯。让我们看清这份"纠结"的具体模样。',
    emptyConflict: '这里还空着呢，先去完成九宫格吧',
    conflictTitle: '困境名称',
    description: '内心戏',
    values: '深层价值'
  },

  // 解决方案引导
  solution: {
    pageTitle: '点亮新的路径',
    openingGuide: '每一种困境都对应着许多把"钥匙"。这里有一些思维与行动的透镜，选1-3个最触动你的，看看能照见什么新路径。',
    selectPrinciple: '选择最触动你的透镜',
    generateAction: '点亮新路径',
    emptyResult: '还没有生成过方案，选择透镜开始吧',
    // 行动地图的四个部分标题
    actionMap: {
      lens: '💡 透镜解读',
      thinking: '🧠 思维转换',
      action: '🚀 微小第一步',
      reminder: '💚 温和提醒'
    }
  }
};
