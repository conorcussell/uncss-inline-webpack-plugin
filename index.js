const uncss = require('uncss');

const IGNORED_RULES = ['.nav-item--active'];

function UncssInlinePlugin(options) {}

/**
 * generate HTML string with inlined CSS
 * @param {Object} data
 * @param {Function} callback
 */
UncssInlinePlugin.prototype.generate = function(data, callback) {
  let options = {
    csspath: 'build',
    ignore: IGNORED_RULES
  };

  let html = data.html;

  // ignore scripts for uncss;
  let uncssHtml = data.html.replace(/<script async src="(.*?)"><\/script>/, '');

  uncss(uncssHtml, options, function(error, output) {
    if (error) {
      throw new Error(err);
    }

    html = html.replace(
      /<link rel="stylesheet" href="(.*?)">/,
      `<style>${output}</style>`
    );

    data.html = html;
    callback(null, data);
  });
};

/**
 * apply Webpack Plugin
 * @param {Object} compiler
 */
UncssInlinePlugin.prototype.apply = function(compiler) {
  compiler.plugin('compilation', compilation => {
    // get html data after its been processed
    compilation.plugin(
      'html-webpack-plugin-after-html-processing',
      (htmlPluginData, callback) => {
        this.generate(htmlPluginData, callback);
      }
    );
  });
};

module.exports = UncssInlinePlugin;
