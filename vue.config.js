module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/'
        : '/',
    outputDir: '../../Public/VueGenerated/',
    filenameHashing: false,
    configureWebpack: {
      performance: {
        hints: false,
      },
    },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.delete('html')
      config.plugins.delete('prefetch')
      config.plugins.delete('preload')
    }

    }
  }
