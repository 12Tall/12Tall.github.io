module.exports = {
    base: "/",  // 目录跟地址
    title: "(｡･∀･)ﾉﾞ Hi~",  // 网页标题栏
    description: "(｡･∀･)ﾉﾞ Hi there~",  // 用于SEO

    //浏览器的标签栏的网页图标,基地址/docs/.vuepress/public
    head: [
        // 波纹特效
        // ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js' }],
        // ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js' }],
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        // latex support
        // ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css' }],
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css' }]

    ],

    // https://prismjs.com/#supported-languages
    markdown: {
        lineNumbers: true,   // 代码块左侧显示行号
        toc: {
            includeLevel: [1, 2, 3],
        },
        // support Katex<inline latex>
        // https://www.vuepress.cn/guide/markdown.html#%E8%BF%9B%E9%98%B6%E9%85%8D%E7%BD%AE
        extendMarkdown: md => {
            md.use(require('@iktakahiro/markdown-it-katex'))
        }
    },

    themeConfig: {
        // search: false,
        // searchMaxSuggestions: 10,
        nav: [
            {
                text: 'Notes', items: [
                    { text: '开发', link: '/pages/notes/dev/' },
                    // { text: '运维', link: '/pages/notes/运维/' },
                    { text: 'C/C++/Go', link: '/pages/notes/cpp/' },
                    // { text: '数学', link: '/pages/notes/math/' },
                ]
            },
            { text: 'Blogs', link: '/pages/blogs/' },
            // { text: '自动控制原理', link: '/pages/notes/ctrl/' },
            { text: '关于', link: '/pages/about/' },
            // { text: 'Front Matter', link: '/pages/front_matter.md' }
        ],



        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: '12Tall/12tall.github.io.git',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'Github',
        // 以下为可选的编辑链接选项
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs/pages',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        smoothScroll: true, //页面滚动效果


    },

    plugins: [
        '@vuepress/medium-zoom',    //zooming images like Medium（页面弹框居中显示）
        '@vuepress/nprogress',  //网页加载进度条
        '@vuepress/plugin-back-to-top', //返回页面顶部按钮
        ['@vuepress/active-header-links', {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        }]
    ]


}