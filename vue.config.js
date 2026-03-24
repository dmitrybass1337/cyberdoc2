const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/cyberdoc2/' : '/',
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'КиберДОК', // <-- сюда укажите нужный заголовок
    },
  }, // добавлена запятая
})
