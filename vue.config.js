const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint
  lintOnSave: false,
  //代理跨域
  devServer: {
    proxy: {
      '/api': {
        //要跨域的服务器地址
        target: 'http://gmall-h5-api.atguigu.cn',
        pathRewrite: { '^/api': '' }
      },
    }
  }
})
