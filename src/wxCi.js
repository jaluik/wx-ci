const { program, command } = require('commander');
const projectConfig = require('../package.json');
const { validate } = require('schema-utils');
const schema = require('./schema.json');
const { checkConfigFile, warn, info, success, fail } = require('../utils');

const defaultVersion = '1.0.1';
const defaultDesc = `${
  new Date().getMonth() + 1
}月${new Date().getDate()}日更新`;

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
  async deploy() {
    try {
      if (!checkConfigFile()) {
        warn("配置文件不存在，请执行 'wx-ci init'生成配置文件");
        return;
      }
      const config = require(path.resolve(`${process.cwd}`, 'wxci.config.js'))
        .default;
      const baseConfig = require('./wxci.config').default;
      //完整配置文件
      const completeConfig = { ...baseConfig, ...config };
      validate(schema, completeConfig);

      const questions = [
        {
          type: 'input',
          name: 'version',
          message: '请输入版本号',
          default: function () {
            return config.version || defaultVersion;
          },
        },
        {
          type: 'input',
          name: 'desc',
          message: '请输入上传描述',
          default: function () {
            return config.desc || defaultDesc;
          },
        },
      ];
      info(completeConfig.desc);
      const answer = await inquirer.prompt(questions);
      const { version, desc } = answer;
      const spinner = ora({ text: '正在安装依赖\n', spinner: 'moon' }).start();
      const packageSpinner = ora({ text: '正在打包中\n', spinner: 'moon' });

      const {
        appid,
        type,
        projectPath,
        privateKeyPath,
        setting,
        preCommand,
      } = completeConfig;

      await new Promise((resolve, reject) => {
        childProcess.exec('yarn', { cwd: process.cwd() }, (e) => {
          if (e === null) {
            spinner.succeed('安装依赖包成功');
            packageSpinner.start();
            resolve();
          } else {
            reject(e.message);
          }
        });
      });

      await new Promise((resolve, reject) => {
        childProcess.exec('yarn build', { cwd: process.cwd() }, (e) => {
          if (e === null) {
            packageSpinner.succeed('打包成功');
            resolve();
          } else {
            reject(e.message);
          }
        });
      });
      info('正在上传中');
      const project = new ci.Project({
        appid,
        type,
        projectPath,
        privateKeyPath,
      });
      await ci.upload({
        project,
        version,
        desc,
        setting,
      });
      success('上传成功');
    } catch (e) {
      fail(e.message);
    }
  }
}

module.exports = WxCi;
