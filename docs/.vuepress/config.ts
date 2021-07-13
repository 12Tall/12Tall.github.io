const { path } = require('@vuepress/utils')

module.exports = {
    '/': {
        lang: 'zh-CN',
        title: '(｡･∀･)ﾉﾞ',
        description: "欢迎光临12tall 的空间"
    },
    head: [
        ['meta', { charset: 'utf-8' }],
        // 禁用浏览器缓存，否则可能会导致Edge 热更新异常
        ['meta', { "http-equiv": "Expires", content: "0" }],
        ['meta', { "http-equiv": "Cache-Control", content: "no-cache" }],
        ['meta', { "http-equiv": "Pragma", content: "no-cache" }],
        // 资源文件的根目录在public
        // markdown 中文件的绝对路径也在public  
        // ['link', { rel: 'icon', href: '/imges/logo.png' }]
    ],

    // 主题配置
    themeConfig: {
        home: '/',  // 首页的路径
        navbar: [
            {
                text: 'C/C++',
                children: ['/c_cpp/win32.md','/c_cpp/dll-injection.md','/c_cpp/vc-inline-asm.md'],
            },
            {
                text: 'NodeJS',
                children: ['/nodejs/n-api.md'],
            },
            {
                text: '神经网络',
                link: '/neural-network/'
            },
            {
                text: '关于',
                link: '/about.md'
            },
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