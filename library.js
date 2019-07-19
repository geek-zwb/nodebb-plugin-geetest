'use strict';
var Geetest = require('gt3-sdk');
var winston = require.main.require('winston');
var Meta = require.main.require('./src/meta');

var pluginData = require('./plugin.json');

var plugin = {};
var geetestIns;

plugin.init = function (params, callback) {
    Meta.settings.get('geetest', function (err, settings) {
        winston.info('[plugins geetest] Settings loaded');
        if (settings.recaptchaEnabled === 'on') {
            if (settings.geetestId && settings.geetestKey) {
                geetestIns = new Geetest({
                    geetest_id: '48a6ebac4ebc6642d68c217fca33eb4d',
                    geetest_key: '4f1c085290bec5afdc54df73535fc361'
                });
            }
        }
        params.router.get('/admin/plugins/geetest', params.middleware.admin.buildHeader, plugin.renderAdmin)
        params.router.get('/api/admin/geetest', plugin.renderAdmin);
        callback();
    });
}
plugin.addCaptcha = function (data, callback) {
    winston.info('[plugins geetest] geetestIns' + geetestIns);
    if (geetestIns) {
        // 向极验申请每次验证所需的challenge
        geetestIns.register({
            client_type: 'unknown',
            ip_address: 'unknown'
        }, function (err, resp) {
            winston.info('[plugins geetest] register resp' + resp);
            if (err) {
                winston.error(err);
                return;
            }

            if (!resp.success) {
                // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
                // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

                // 为以防万一，你可以选择以下两种方式之一：

                // 1. 继续使用极验提供的failback备用方案
                data.req.session.fallback = true;
                // res.send(resp);
                let captcha = {
                    label: '[[nodebb-plugin-geetest:label]]',
                    html: '<div id="geetest"></div>' +
                        '<script id="geetest-script">window.plugin=window.plugin || {};plugin.geetest = window.plugin.geetest || {};plugin.geetest.geetestArgs = ' + JSON.stringify(resp.data) + '</script>',
                    styleName: 'geetest'
                };

                if (data.templateData.regFormEntry && Array.isArray(data.templateData.regFormEntry)) {
                    data.templateData.regFormEntry.push(captcha);
                } else {
                    data.templateData.captcha = captcha;
                }

                // 2. 使用自己提供的备用方案
                // todo

            } else {
                // 正常模式
                data.req.session.fallback = false;
                // res.send(resp);
                let captcha = {
                    label: '[[nodebb-plugin-geetest:label]]',
                    html: '<div id="geetest"></div>' +
                        '<script id="geetest-script">window.plugin=window.plugin || {};plugin.geetest = window.plugin.geetest || {};plugin.geetest.geetestArgs = ' + JSON.stringify(resp.data) + '</script>',
                    styleName: 'geetest'
                };
                if (data.templateData.regFormEntry && Array.isArray(data.templateData.regFormEntry)) {
                    data.templateData.regFormEntry.push(captcha);
                } else {
                    data.templateData.captcha = captcha;
                }
            }

            callback(null, data);
        });
    }
}
plugin.checkRegistration = function (data, callback) {
    // 对ajax提供的验证凭证进行二次验证
    geetestIns.validate(data.req.session.fallback, {

        geetest_challenge: data.req.body.geetest_challenge,
        geetest_validate: data.req.body.geetest_validate,
        geetest_seccode: data.req.body.geetest_seccode

    }, function (err, success) {

        if (err) {
            // 网络错误
            winston.verbose('[plugins/geetest]' + err)
            callback(new Error(err));
        } else if (!success) {

            // 二次验证失败
            callback(new Error('[[nodebb-plugin-geetest:failed]]'));
        } else {
            callback(null, data);
        }
    });
}

// hooks filter:admin.header.build
plugin.addAdminNavigation = function (header, callback) {
    header.plugins.push({
        route: '/plugins/geetest',
        icon: 'fa-shield',
        name: 'Geetest'
    });

    callback(null, header);
};

plugin.renderAdmin = function(req, res) {
    res.render('admin/plugins/geetest', pluginData || {});
}

module.exports = plugin;
