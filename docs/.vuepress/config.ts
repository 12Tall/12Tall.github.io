const { path } = require('@vuepress/utils')

module.exports = {
    '/': {
        lang: 'zh-CN',
        title: '(｡･∀･)ﾉﾞ',
        description: "欢迎光临12tall 的空间"
    },
    head: [
        // 资源文件的根目录在public
        // markdown 中文件的绝对路径也在public  
        // ['link', { rel: 'icon', href: '/imges/logo.png' }]
    ],

    // 主题配置
    themeConfig: {
        home: '/',  // 首页的路径
        navbar: [
            {
                text: '关于',
                link: '/about.md'
            }
        ],  // 导航栏
        logo: '/images/logo.png',  // 导航栏左端logo 图片
        repo: 'https://github.com/12Tall/12tall.github.io',
        repoLabel: 'Github',

    },
    bundler: '@vuepress/vite',

    plugins: [
        [
            '@vuepress/register-components',
            {
                componentsDir: path.resolve(__dirname, './components'),
            },
        ],
    ],
}