Page({
  data: {
    themeClass: 'simple-theme'
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

  // 开始分析按钮点击事件
  startQuestionnaire: function() {
    wx.navigateTo({
      url: '../questionnaire/questionnaire'
    });
  }
});