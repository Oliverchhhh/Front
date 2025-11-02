module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:24107',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // 添加以下配置来处理 favicon.ico 请求
    before: function(app) {
      app.get('/favicon.ico', function(req, res) {
        res.status(204);
        res.end();
      });
    }
  }
} 