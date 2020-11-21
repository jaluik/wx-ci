#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var commander = require('commander');
var ci = require('miniprogram-ci');
var childProcess = require('child_process');
var ora = require('ora');
var projectConfig = require('../package.json');
var schemaUtils = require('schema-utils');
var minimist = require('minimist');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var ci__default = /*#__PURE__*/_interopDefaultLegacy(ci);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var projectConfig__default = /*#__PURE__*/_interopDefaultLegacy(projectConfig);
var minimist__default = /*#__PURE__*/_interopDefaultLegacy(minimist);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var type = "object";
var properties = {
	appid: {
		description: "小程序appid",
		type: "string"
	},
	projectPath: {
		description: "小程序生成目录",
		type: "string"
	},
	privateKeyPath: {
		description: "小程序钥匙目录",
		type: "string"
	},
	preCommand: {
		description: "上传前执行脚本",
		type: "array",
		items: {
			type: "object",
			properties: {
				command: {
					description: "执行命令",
					type: "string"
				},
				desc: {
					description: "执行命令的说明文字",
					desc: "string"
				}
			}
		}
	}
};
var additionalProperties = true;
var schema = {
	type: type,
	properties: properties,
	additionalProperties: additionalProperties
};

var checkConfigFile = function () {
    var configPath = path__default['default'].resolve("" + process.cwd(), 'wxci.config.js');
    return fs__default['default'].existsSync(configPath);
};
var info = function (text) {
    console.log(text);
};
var success = function (text) {
    ora__default['default']().succeed(text);
};
var warn = function (text) {
    ora__default['default']().warn(text);
};
var fail = function (text) {
    ora__default['default']().fail(text);
};

var defaultVersion = '1.0.0';
var defaultDesc = new Date().getMonth() + 1 + "\u6708" + new Date().getDate() + "\u65E5\u66F4\u65B0";
var WxCi = (function () {
    function WxCi() {
        commander.program
            .version(projectConfig__default['default'].version, '-v, --version', '输出当前版本号')
            .option('-y, --yes', '以默认值初始化配置文件');
        commander.program.parse(process.argv, { from: 'user' });
    }
    WxCi.prototype.run = function (command) {
        if (!command) {
            this.deploy();
            return;
        }
        if (command === 'init') {
            this.generateDefault();
        }
    };
    WxCi.prototype.execPreCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var promiseFn, _i, promiseFn_1, fn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseFn = command.map(function (item) { return function () {
                            return new Promise(function (resolve, reject) {
                                var spinner = ora__default['default']({
                                    text: "\u6B63\u5728" + item.desc + "\n",
                                    spinner: 'moon',
                                }).start();
                                childProcess__default['default'].exec(item.command, { cwd: process.cwd() }, function (e) {
                                    if (e === null) {
                                        spinner.succeed(item.desc + "\u6210\u529F\n");
                                        resolve();
                                    }
                                    else {
                                        throw e;
                                    }
                                });
                            });
                        }; });
                        _i = 0, promiseFn_1 = promiseFn;
                        _a.label = 1;
                    case 1:
                        if (!(_i < promiseFn_1.length)) return [3, 4];
                        fn = promiseFn_1[_i];
                        return [4, fn()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    WxCi.prototype.generateDefault = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info('正在生成配置文件');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, new Promise(function (resolve, reject) {
                                var rs = fs__default['default'].createReadStream(path__default['default'].resolve(__dirname, '../src/wxci.config.js'));
                                var ws = fs__default['default'].createWriteStream(path__default['default'].resolve(process.cwd(), 'wxci.config.js'));
                                rs.pipe(ws);
                                ws.on('close', resolve);
                                ws.on('error', reject);
                            })];
                    case 2:
                        _a.sent();
                        success('生成配置文件成功');
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        fail('生成配置文件失败');
                        fail(err_1.message);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    WxCi.prototype.generateConfig = function () {
        console.log('询问生成');
    };
    WxCi.prototype.deploy = function () {
        return __awaiter(this, void 0, void 0, function () {
            var config, baseConfig, completeConfig_1, questions, answer, version, desc, appid, type, projectPath, privateKeyPath, setting, _a, preCommand, project, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!checkConfigFile()) {
                            warn("配置文件不存在，请执行 'wx-ci init'生成配置文件");
                            return [2];
                        }
                        config = require(path__default['default'].resolve("" + process.cwd(), 'wxci.config.js'));
                        baseConfig = require('./wxci.config');
                        completeConfig_1 = __assign(__assign({}, baseConfig), config);
                        schemaUtils.validate(schema, completeConfig_1);
                        console.log(completeConfig_1.title);
                        questions = [
                            {
                                type: 'input',
                                name: 'version',
                                message: '请输入版本号',
                                default: function () {
                                    return completeConfig_1.version || defaultVersion;
                                },
                            },
                            {
                                type: 'input',
                                name: 'desc',
                                message: '请输入上传描述',
                                default: function () {
                                    return completeConfig_1.desc || defaultDesc;
                                },
                            },
                        ];
                        info(completeConfig_1.desc);
                        return [4, inquirer__default['default'].prompt(questions)];
                    case 1:
                        answer = _b.sent();
                        version = answer.version, desc = answer.desc;
                        appid = completeConfig_1.appid, type = completeConfig_1.type, projectPath = completeConfig_1.projectPath, privateKeyPath = completeConfig_1.privateKeyPath, setting = completeConfig_1.setting, _a = completeConfig_1.preCommand, preCommand = _a === void 0 ? [] : _a;
                        return [4, this.execPreCommand(preCommand)];
                    case 2:
                        _b.sent();
                        info('正在上传中');
                        project = new ci__default['default'].Project({
                            appid: appid,
                            type: type,
                            projectPath: projectPath,
                            privateKeyPath: privateKeyPath,
                        });
                        return [4, ci__default['default'].upload({
                                project: project,
                                version: version,
                                desc: desc,
                                setting: setting,
                            })];
                    case 3:
                        _b.sent();
                        success('上传成功');
                        return [3, 5];
                    case 4:
                        e_1 = _b.sent();
                        fail(e_1.message);
                        return [3, 5];
                    case 5: return [2];
                }
            });
        });
    };
    return WxCi;
}());

var argv = minimist__default['default'](process.argv.slice(2));
var wxCi = new WxCi();
var command = argv._[0];
wxCi.run(command);
