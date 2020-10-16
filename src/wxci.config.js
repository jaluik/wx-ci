module.exports = {
  /** ---基础配置-- */
  //显示上传标题语句
  title: '----------正在上传小程序----------',
  //小程序appid
  appid: '',
  type: 'miniProgram',
  //小程序生成目录
  projectPath: `${process.cwd()}/dist`,
  //小程序钥匙目录
  privateKeyPath: `${process.cwd()}/miniprogram.upload.key`,
  /** ---上传前执行脚本-- */
  preCommand: [
    {
      command: 'yarn',
      desc: '安装依赖',
    },
    {
      command: 'yarn build',
      desc: '打包',
    },
  ],
  /** ---上传配置-- */
  //小程序自定义版本号
  version: '',
  //小程序自定义备注
  desc: '',
  //编译设置
  setting: {
    //对应于微信开发者工具的 "es6 转 es5"
    es6: true,
    //对应于微信开发者工具的 "增强编译"
    es7: false,
    //上传时压缩 JS 代码
    minifyJS: false,
    //上传时压缩 WXML 代码
    minifyWXML: false,
    //上传时压缩 WXSS 代码
    minifyWXSS: false,
    //上传时压缩所有代码，对应于微信开发者工具的 "上传时压缩代码"
    minify: true,
    //对应于微信开发者工具的 "上传时进行代码保护"
    codeProtect: false,
    //对应于微信开发者工具的 "上传时样式自动补全"
    autoPrefixWXSS: false,
  },
};
