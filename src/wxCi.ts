import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { Command, Argument } from 'commander';
import ci from 'miniprogram-ci';
import childProcess from 'child_process';
import ora from 'ora';
import projectConfig from '../package.json';
import { validate } from 'schema-utils';
import schema from './schema.json';
import { checkConfigFile, warn, info, success, fail } from '../utils';
import { Schema } from 'schema-utils/declarations/validate';
const shell = require('shelljs');

const getDefaultDesc = () => {
  let _cmd = `git log -1 \
  --date=iso --pretty=format:'{"commit": "%h","author": "%aN <%aE>","date": "%ad","message": "%s"},' \
  $@ | \
  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
  perl -pe 's/},]/}]/'`;
  return new Promise((resolve, reject) => {
    shell.exec(
      _cmd,
      { silent: true },
      (code: number, stdout: any, stderr: any) => {
        if (code) {
          reject(stderr);
        } else {
          resolve(JSON.parse(stdout)[0]);
        }
      }
    );
  });
};

const defaultVersion = '1.0.0';

class WxCi {
  readonly program;
  private action: 'preview' | 'upload' | 'init';
  private options: {
    file?: string;
    quiet?: boolean;
  };

  constructor() {
    const program = new Command();
    program
      .addArgument(
        new Argument('<action>', 'preview:开发版, upload:体验版').choices([
          'preview',
          'upload',
          'init',
        ])
      )
      .version(projectConfig.version, '-v, --version', '输出当前版本号')
      .helpOption('-h, --help', '查看帮助信息')
      .option('-q, --quiet', '不提示输入直接上传')
      .option('-f, --file <file>', '指定配置文件')
      .action((action, options) => {
        this.action = action;
        this.options = options;
      });

    this.program = program;
    this.program.parse();
  }

  /**
   * 根据参数初始化
   */
  run() {
    if (this.action === 'upload') {
      //默认为部署
      this.upload();
      return;
    }
    if (this.action === 'preview') {
      //默认为部署
      this.preview();
      return;
    }

    if (this.action === 'init') {
      this.generateDefault();
      return;
    }
  }

  /** 是否为静默模式 */
  silentMode() {
    return Boolean(this.options.quiet);
  }

  /**
   * 生成执行上传前的命令数组
   */
  async execPreCommand(command: { desc: string; command: string }[]) {
    const promiseFn = command.map((item) => () => {
      return new Promise((resolve, reject) => {
        const spinner = ora({
          text: `正在${item.desc}\n`,
          spinner: 'moon',
        }).start();
        childProcess.exec(item.command, { cwd: process.cwd() }, (e: Error) => {
          if (e === null) {
            spinner.succeed(`${item.desc}成功\n`);
            resolve(void 0);
          } else {
            throw e;
          }
        });
      });
    });
    for (let fn of promiseFn) {
      await fn();
    }
  }

  /**
   * 生成默认配置文件
   */
  async generateDefault() {
    info('正在生成配置文件');
    try {
      const sourcePath = path.resolve(__dirname, '../lib/wxci.config.js');
      const distPath = path.resolve(process.cwd(), 'wxci.config.js');
      await fs.copyFile(sourcePath, distPath);
      success('生成配置文件成功');
    } catch (err) {
      fail('生成配置文件失败');
      fail(err.message);
    }
  }

  /** 获取完整的配置文件 */
  async getCompleteConfig() {
    try {
      const filePath = this.options.file || 'wxci.config.js';
      if (!checkConfigFile(filePath)) {
        warn("配置文件不存在，请执行 'wx-ci init'生成配置文件");
        process.exit(1);
      }
      const config = require(path.resolve(`${process.cwd()}`, filePath));
      const baseConfig = require(path.resolve(
        __dirname,
        '../lib/wxci.config.js'
      ));
      //完整配置文件
      const completeConfig = { ...baseConfig, ...config };
      validate(schema as Schema, completeConfig);
      if (!completeConfig.desc) {
        completeConfig.desc = await getDefaultDesc()
          .then(
            ({ commit, author, date, message }) =>
              `提交：${commit}, 作者：${author}, 日期: ${date}, ${message}`
          )
          .catch(() => Promise.resolve('提交'));
      }

      if (this.silentMode()) {
        completeConfig.version = completeConfig.version || defaultVersion;
        completeConfig.desc = completeConfig.desc;
        return completeConfig;
      }
      const questions = [
        {
          type: 'input',
          name: 'version',
          message: '请输入版本号',
          default: function () {
            return completeConfig.version || defaultVersion;
          },
        },
        {
          type: 'input',
          name: 'desc',
          message: '请输入上传描述',
          default: function () {
            return completeConfig.desc;
          },
        },
      ];
      info(completeConfig.desc);
      const { version, desc } = await inquirer.prompt(questions);
      completeConfig.version = version;
      completeConfig.desc = desc;
      return completeConfig;
    } catch (e) {
      fail(e.message);
      process.exit(1);
    }
  }

  /** 上传 */
  async upload() {
    try {
      const completeConfig = await this.getCompleteConfig();
      const {
        appid,
        type,
        robot,
        projectPath,
        privateKeyPath,
        setting,
        version,
        desc,
        preCommand = [],
      } = completeConfig;

      await this.execPreCommand(preCommand);
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
        robot,
      });
      success('上传成功');
    } catch (e) {
      fail(e.message);
      process.exit(1);
    }
  }

  /** 执行上传打包脚本*/
  async preview() {
    try {
      const completeConfig = await this.getCompleteConfig();
      const {
        appid,
        type,
        version,
        projectPath,
        privateKeyPath,
        robot,
        qrcodeFormat,
        qrcodeOutputDest,
        pagePath,
        searchQuery,
        desc,
        setting,
        preCommand = [],
      } = completeConfig;

      await this.execPreCommand(preCommand);
      const srcProjectConfigPath = path.resolve(
        process.cwd(),
        'project.config.json'
      );
      const distProjectConfigPath = path.resolve(process.cwd(), projectPath);
      if (
        fs.existsSync(srcProjectConfigPath) &&
        !fs.existsSync(distProjectConfigPath)
      ) {
        await fs.copyFile(srcProjectConfigPath, distProjectConfigPath);
      }

      info('正在上传中');
      const project = new ci.Project({
        appid,
        type,
        projectPath,
        privateKeyPath,
      });
      await ci.preview({
        project,
        version,
        desc,
        setting,
        robot,
        qrcodeFormat,
        qrcodeOutputDest,
        pagePath,
        searchQuery,
      });
      success('上传预览成功');
    } catch (e) {
      fail(e.message);
      process.exit(1);
    }
  }
}

export default WxCi;
