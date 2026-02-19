# 微信小程序 CI 配置
# 用于命令行自动化编译

module.exports = {
  appid: 'wxdcda4656daed1b11',
  projectPath: process.cwd(),
  type: 'miniProgram',
  setting: {
    es6: true,
    minified: true,
    urlCheck: false,
    enhance: true,
  },
  ignoreUploadUnusedFiles: true,
  ignoreDevUnusedFiles: true,
};
