const { program, command } = require('commander');
const projectConfig = require('../package.json');

class WxCi {
  constructor() {
    program
      .version(projectConfig.version)
      .option('-y, --yes', '以默认值初始化配置文件');
    program.parse(process.argv, { from: 'user' });
  }

  /**
   * 根据参数初始化
   */
  run(command) {
    if (!command) {
      this.deploy();
      return;
    }
    if (command === 'init') {
      if (program.yes) {
        //以生成默认配置文件夹
        this.generateDefault();
      } else {
        //询问的方式生成配置
        this.generateConfig();
      }
    }
  }

  /**
   * 生成配置文件
   */
  generateDefault() {
    console.log('生成默认');
  }

  /**
   * 生成配置文件
   */
  generateConfig() {
    console.log('询问生成');
  }

  /**
   * 执行上传打包脚本
   */
  deploy() {
    console.log('正在部署');
  }
}

module.exports = WxCi;
