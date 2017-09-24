'use strict';
const path = require('path');
const Render = require('fast-ftl').Render;
const makeErrorHtml = require('./makeErrorHTML');

module.exports = function(config) {
    const render = Render({
        root: path.resolve(config.templateRoot),
        paths: config.moduleFtlPathes,
        defaultEncoding: 'utf-8', // 默认 encoding
        urlEscapingCharsetSet: 'utf-8', // URLEscapingCharset
        numberFormat: '0.##########', // 数字格式化方式
    });
    return function(tpl, cb, dataObject) {
        if (tpl.startsWith('/')) tpl = tpl.slice(1);
        render.parse(tpl, dataObject)
            .then(cb)
            .catch((e) => {
                console.info(`渲染出错:${tpl}`);
                try {
                    cb(makeErrorHtml(tpl, e));
                } catch (e) {
                    console.info(e);
                }
            });
    };
};
