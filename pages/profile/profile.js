Page({
  data: {
    savedGrids: [],
    currentGridName: '',
    themeClass: 'simple-theme',
    themeName: '朴素风',
    expandedIndex: -1,
    version: 'professional',
    themeClass: ''
  },

  onLoad: function() {
    this.loadAppVersion();
    this.loadSavedGrids();
    this.loadTheme();
  },

  onShow: function() {
    this.loadAppVersion();
    this.loadSavedGrids();
    this.loadTheme();
  },

  // 加载应用版本
  loadAppVersion: function() {
    const app = getApp();
    const version = app.globalData.appVersion || 'professional';
    this.setData({
      version,
      themeClass: version === 'lifestyle' ? 'theme-lifestyle' : 'theme-professional'
    });
  },

  // 加载主题
  loadTheme: function() {
    const app = getApp();
    const theme = app.globalData.theme || 'simple';
    this.setData({
      themeClass: theme + '-theme',
      themeName: theme === 'simple' ? '朴素风' : '多巴胺风'
    });
  },

  // 主题切换回调
  onThemeChanged: function(newTheme) {
    this.setData({
      themeClass: newTheme + '-theme',
      themeName: newTheme === 'simple' ? '朴素风' : '多巴胺风'
    });
  },

  // 切换应用版本
  switchVersion: function(e) {
    const type = e.currentTarget.dataset.type;
    const app = getApp();

    if (app.globalData.appVersion === type) return;

    app.globalData.appVersion = type;
    try {
      wx.setStorageSync('app_version', type);
    } catch (e) {
      console.error('保存版本失败:', e);
    }

    this.setData({
      version: type,
      themeClass: type === 'lifestyle' ? 'theme-lifestyle' : 'theme-professional'
    });

    wx.showToast({
      title: '已切换',
      icon: 'success'
    });
  },

  // 切换主题
  toggleTheme: function() {
    const app = getApp();
    const newTheme = app.globalData.theme === 'simple' ? 'dopamine' : 'simple';
    app.switchTheme(newTheme);
  },

  // 加载已保存的九宫格
  loadSavedGrids: function() {
    try {
      const savedGrids = wx.getStorageSync('savedGrids') || [];
      this.setData({ savedGrids });
    } catch (error) {
      console.error('加载九宫格失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 查看九宫格详情
  // 展开/收起九宫格
  toggleExpand: function(e) {
    const index = e.currentTarget.dataset.index;
    const newExpandedIndex = this.data.expandedIndex === index ? -1 : index;
    this.setData({ expandedIndex: newExpandedIndex });
  },

  viewGrid: function(e) {
    const index = e.currentTarget.dataset.index;
    const grid = this.data.savedGrids[index];

    const app = getApp();
    app.globalData.gridData = grid.gridData;
    app.globalData.currentGridName = grid.name;
    app.globalData.currentGridId = grid.id;

    wx.switchTab({
      url: '/pages/solutions/solutions'
    });
  },

  // 编辑九宫格名称
  editGridName: function(e) {
    const index = e.currentTarget.dataset.index;
    const savedGrids = [...this.data.savedGrids];
    const that = this;

    wx.showModal({
      title: '编辑名称',
      editable: true,
      placeholderText: savedGrids[index].name,
      success: function(res) {
        if (res.confirm && res.content.trim()) {
          savedGrids[index].name = res.content.trim();

          try {
            wx.setStorageSync('savedGrids', savedGrids);
            that.setData({ savedGrids });
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            });
          } catch (error) {
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 删除九宫格
  deleteGrid: function(e) {
    const index = e.currentTarget.dataset.index;
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个九宫格吗？',
      success: function(res) {
        if (res.confirm) {
          const savedGrids = [...that.data.savedGrids];
          savedGrids.splice(index, 1);

          try {
            wx.setStorageSync('savedGrids', savedGrids);
            that.setData({ savedGrids });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (error) {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 删除九宫格
  deleteGrid: function(e) {
    const index = e.currentTarget.dataset.index;
    const that = this;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个九宫格吗？',
      success: function(res) {
        if (res.confirm) {
          const savedGrids = [...that.data.savedGrids];
          savedGrids.splice(index, 1);

          try {
            wx.setStorageSync('savedGrids', savedGrids);
            that.setData({ savedGrids });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (error) {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 清空所有九宫格
  clearAll: function() {
    const that = this;

    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有已保存的九宫格吗？此操作不可恢复。',
      success: function(res) {
        if (res.confirm) {
          try {
            wx.removeStorageSync('savedGrids');
            that.setData({ savedGrids: [] });
            wx.showToast({
              title: '已清空',
              icon: 'success'
            });
          } catch (error) {
            wx.showToast({
              title: '清空失败',
              icon: 'none'
            });
          }
        }
      }
    });
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
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});
