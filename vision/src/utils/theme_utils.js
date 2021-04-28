const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题颜色
    titleColor: '#ffffff',
    // 页面顶部的边框图片
    headerBorderSrc: 'header_border_dark.png',
    // 切换主题按钮的图片路径
    themeSrc: 'qiehuan_dark.png'
  },

  vintage: {
    backgroundColor: '#eee',
    titleColor: '#000000',
    headerBorderSrc: 'header_border_light.png',
    themeSrc: 'qiehuan_light.png'

  }
}

export function getThemeValue(themeName){
  return theme[themeName]
}