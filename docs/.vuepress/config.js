module.exports = {
    base: "/",  // 目录跟地址
    title: "(｡･∀･)ﾉﾞ Hi~",  // 网页标题栏
    description: "(｡･∀･)ﾉﾞ Hi there~",  // 用于SEO

    //浏览器的标签栏的网页图标,基地址/docs/.vuepress/public
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],

    markdown: {
        lineNumbers: true,   // 代码块左侧显示行号
        toc: {
            includeLevel: [1, 2, 3],
        },
    },

    themeConfig: {
        // search: false,
        // searchMaxSuggestions: 10,
        nav: [
            { text: 'Notes', link: '/pages/notes/' },
            { text: 'Blogs', link: '/pages/blogs/' },
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


        plugins: [
            '@vuepress/medium-zoom',    //zooming images like Medium（页面弹框居中显示）
            '@vuepress/nprogress',  //网页加载进度条
            '@vuepress/plugin-back-to-top', //返回页面顶部按钮
        ]
    }



}