const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function() {
  return process.env.NODE_ENV !== 'production'
    ? {
        plugins: [
          new CopyWebpackPlugin([
            {
              from: 'public/config',
              to: '_config',
              transform(content) {
                return content
                  .toString('utf-8')
                  .replace(/{{ .Env.([a-zA-Z0-9_-]*) }}/g, function(match, p1) {
                    return process.env[p1];
                  });
              },
            },
          ]),
        ],
      }
    : {};
};
