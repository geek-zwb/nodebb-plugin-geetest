$(function() {
    var pluginName = 'geetest';
    var readyTimeoutId = null;

    function onRecaptachaArgsReady (callback) {
        if (window.plugin && plugin[pluginName] && plugin[pluginName].geetestArgs && $('#' + plugin[pluginName].geetestArgs.targetId).length) {
            clearTimeout(readyTimeoutId);
            return callback();
        }
        readyTimeoutId && clearTimeout(readyTimeoutId);
        readyTimeoutId = setTimeout(function () { onRecaptachaArgsReady(callback); }, 350);
    }

    function onRegisterPage () {
        onRecaptachaArgsReady(function () {
            if (! $('script[src*="static.geetest.com/static/tools/gt.js"]').length) {
                injectScript('//static.geetest.com/static/tools/gt.js?_t=' + new Date().getTime(), {
                    onload: window.__nodebbGreetestCreateCaptcha__
                });
            } else if (initGeetest) {
                window.__nodebbGreetestCreateCaptcha__();
            }
        });
    }

    function injectScript (src, options) {
        options || (options = {});
        injectTag('script', {src: src, type: 'text/javascript', async: true, defer: '', charset: 'utf-8' }, options);
    }

    function injectTag (tagName, attrs, options) {
        options || (options = {});

        var tag = document.createElement(tagName);
        tag.onload = options.onload || null; // @ie8; img.onload cannot be undefined

        var setAttr = tag.setAttribute
            ? function(tag, key, value) { tag.setAttribute(key, value); return tag;}
            : function(tag, key, value) { tag[key] = value; return tag;};

        Object.keys(attrs).forEach(function(key) {
            tag = setAttr(tag, key, attrs[key]);
        });

        if (options.insertBefore) {
            options.insertBefore.parentNode.insertBefore(tag, options.insertBefore);
        } else if (options.appendChild) {
            options.appendChild.appendChild(tag);
        } else {
            var scripts = document.getElementsByTagName('script');
            scripts[scripts.length - 1].parentNode.appendChild(tag);
        }
    }

    $(window).on('action:ajaxify.end', function (evt, data) {
        switch (data.tpl_url) {
            case 'register':
                onRegisterPage(data);
                break;
            case 'login':
                //
                break;
            default:
                return void 0;
        }
    });
});

window.__nodebbGreetestCreateCaptcha__ = function () {
    var args = plugin['geetest'].geetestArgs;

    window.initGeetest(
        {
            gt: args.gt,
            challenge: args.challenge,
            https: true,
            product: 'bind',
            lang: 'en',
            sandbox:false,
            // width,
            offline: false,
            new_captcha: true,
        },
        function (captchaObj){
            window.greetestInstance = captchaObj;
        },
    )
};
