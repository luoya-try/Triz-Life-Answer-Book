// 主题配置文件 - 统一管理所有版本的文案和配置
// 后续新增版本（如学生版、产品运营版等）只需在此文件添加配置即可

export const themeConfig = {
  professional: {
    // 页面标题
    pageTitles: {
      questionnaire: 'TRIZ问题分析',
      conflicts: '矛盾分析矩阵',
      solutions: '创新解决方案',
      profile: '我的九宫格'
    },
    // 按钮文字
    buttons: {
      next: '下一步',
      prev: '上一步',
      save: '保存',
      delete: '删除',
      import: '导入',
      export: '导出',
      generate: '生成解决方案',
      analyze: '智能分析',
      continue: '继续'
    },
    // 占位文字
    placeholders: {
      answer: '请输入您的回答...',
      question: '请详细描述您遇到的技术问题'
    },
    // 状态文字
    statuses: {
      loading: 'AI 分析中...',
      complete: '生成完成',
      aiThinking: 'AI思考中...',
      aiGuidance: 'AI智能引导'
    },
    // 其他文案
    progress: '第 {current} 题 / 共 {total} 题',
    aiAutoFill: 'AI自动帮你分类填入九宫格',
    aiAutoFillDone: 'AI已自动填充 {filled}/{total} 格，点击查看',
    expand: '展开',
    collapse: '收起'
  },
  lifestyle: {
    // 页面标题
    pageTitles: {
      questionnaire: '填写你的纠结清单',
      conflicts: '你的纠结清单',
      solutions: '破解方案',
      profile: '我的纠结'
    },
    // 按钮文字
    buttons: {
      next: '继续',
      prev: '返回',
      save: '保存起来',
      delete: '不要了',
      import: '导入旧记录',
      export: '导出',
      generate: '帮我想想办法',
      analyze: 'AI帮你填',
      continue: '继续呀'
    },
    // 占位文字
    placeholders: {
      answer: '用你自己的话说吧...',
      question: '把你遇到的问题，用你自己的话说出来吧'
    },
    // 状态文字
    statuses: {
      loading: '🤔 正在帮你思考...',
      complete: '✨ 想到了！',
      aiThinking: 'AI在想...',
      aiGuidance: '💭 小提示'
    },
    // 其他文案
    progress: '第 {current} 步 / 共 {total} 步',
    aiAutoFill: '点击一下，AI自动帮你填好～',
    aiAutoFillDone: 'AI已经帮你填好 {filled} 格啦～',
    expand: '看看怎么办',
    collapse: '先收起来吧'
  }
};

// 问卷问题配置
export const questionsConfig = {
  professional: [
    {
      text: '当前你最迫切的问题是什么？',
      shortText: '核心问题',
      hint: '好的，让我们开始吧。首先，请告诉我您当前最迫切想要解决的问题是什么？这将是我们整个分析的核心起点。',
      position: 'center'
    },
    {
      text: '过去的超系统是什么？',
      shortText: '超系统（过去）',
      hint: '超系统是包含您的系统的更大环境。请描述一下，在您这个核心问题出现之前，当时的外部环境、背景或条件是怎样的？',
      position: 'past-super'
    },
    {
      text: '过去的系统是什么？',
      shortText: '系统（过去）',
      hint: '系统是指问题所在的主体。请描述在问题出现之前，系统本身的状态、结构或功能是怎样的。',
      position: 'past-system'
    },
    {
      text: '过去的子系统是什么？',
      shortText: '子系统（过去）',
      hint: '子系统是指系统的组成部分。请描述在问题出现之前，系统内部的关键组件或元素是怎样的。',
      position: 'past-sub'
    },
    {
      text: '当前的超系统是什么？',
      shortText: '超系统（当前）',
      hint: '请描述当前与问题相关的外部环境、背景或条件，这些因素如何影响问题的发展。',
      position: 'current-super'
    },
    {
      text: '当前的子系统是什么？',
      shortText: '子系统（当前）',
      hint: '请描述当前系统内部的关键组件或元素的状态，这些部分如何与问题相互作用。',
      position: 'current-sub'
    },
    {
      text: '未来的超系统是什么？',
      shortText: '超系统（未来）',
      hint: '请设想在理想情况下，未来与问题相关的外部环境、背景或条件应该是怎样的。',
      position: 'future-super'
    },
    {
      text: '未来的系统是什么？',
      shortText: '系统（未来）',
      hint: '请设想在理想情况下，未来系统本身的状态、结构或功能应该是怎样的。',
      position: 'future-system'
    },
    {
      text: '未来的子系统是什么？',
      shortText: '子系统（未来）',
      hint: '请设想在理想情况下，未来系统内部的关键组件或元素应该是怎样的。',
      position: 'future-sub'
    }
  ],
  lifestyle: [
    {
      text: '说说你遇到什么纠结了吧',
      shortText: '💭 核心难题',
      hint: '好啦，咱们开始吧。先告诉我，最近你最纠结的一件事是什么？比如工作啦、学习啦、生活里的事都行~',
      position: 'center'
    },
    {
      text: '之前的环境是怎样的呢？',
      shortText: '🌈 之前的环境',
      hint: '嗯～想想看，在这个问题出现之前，周围的环境大概是怎样的呀？比如有什么特别的背景或条件？',
      position: 'past-super'
    },
    {
      text: '之前的状态是什么样的？',
      shortText: '📋 之前的状态',
      hint: '嗯～那问题还没出现的时候，这件事本身的模样是什么样的？比如它是什么样子的、怎么运作的？',
      position: 'past-system'
    },
    {
      text: '之前里面有哪些部分？',
      shortText: '⚙️ 之前的细节',
      hint: '嗯～那里面有哪些关键的部分呢？比如有什么重要的组件或元素？',
      position: 'past-sub'
    },
    {
      text: '现在的环境怎么样呀？',
      shortText: '🌤️ 现在的环境',
      hint: '嗯～现在呢？周围有哪些情况或者条件呀？它们对你这个问题有啥影响？',
      position: 'current-super'
    },
    {
      text: '现在里面有哪些部分？',
      shortText: '🔧 现在的细节',
      hint: '嗯～现在里面有哪些关键的部分呢？它们是怎么和这个问题互动的？',
      position: 'current-sub'
    },
    {
      text: '希望未来环境变成什么样？',
      shortText: '🌟 想要的环境',
      hint: '嗯～想像一下，最理想的情况下，你希望周围的环境是怎样的呢？',
      position: 'future-super'
    },
    {
      text: '希望它变成什么样子？',
      shortText: '🎯 想要的样子',
      hint: '嗯～那你希望这件事最终变成什么样子呢？比如它应该有什么功能、什么特点？',
      position: 'future-system'
    },
    {
      text: '希望里面有哪些更棒的部分？',
      shortText: '⚡ 更棒的细节',
      hint: '嗯～最后想想，未来里面的那些部分应该是什么样的呢？',
      position: 'future-sub'
    }
  ]
};

// 样式变量配置（对应的CSS变量名）
export const styleConfig = {
  professional: {
    '--primary-color': '#2c3e50',
    '--primary-light': '#34495e',
    '--accent-color': '#3498db',
    '--success-color': '#27ae60',
    '--warning-color': '#f39c12',
    '--danger-color': '#e74c3c',
    '--bg-color': '#f5f6fa',
    '--card-bg': '#ffffff',
    '--text-primary': '#2c3e50',
    '--text-secondary': '#7f8c8d',
    '--border-color': '#ecf0f1',
    '--shadow': '0 2rpx 8rpx rgba(0,0,0,0.08)',
    '--border-radius': '16rpx',
    '--btn-radius': '20rpx'
  },
  lifestyle: {
    '--primary-color': '#e67e22',
    '--primary-light': '#f39c12',
    '--accent-color': '#ff6f91',
    '--success-color': '#6ab04c',
    '--warning-color': '#f9ca24',
    '--danger-color': '#eb4d4b',
    '--bg-color': '#fff8f0',
    '--card-bg': '#ffffff',
    '--text-primary': '#2c3e50',
    '--text-secondary': '#e67e22',
    '--border-color': '#ffeaa7',
    '--shadow': '0 4rpx 16rpx rgba(230,126,34,0.15)',
    '--border-radius': '20rpx',
    '--btn-radius': '25rpx'
  }
};

// 获取当前版本配置
export function getThemeConfig(version) {
  return themeConfig[version] || themeConfig.professional;
}

// 获取问题配置
export function getQuestionsConfig(version) {
  return questionsConfig[version] || questionsConfig.professional;
}

// 获取样式配置
export function getStyleConfig(version) {
  return styleConfig[version] || styleConfig.professional;
}

export default themeConfig;
