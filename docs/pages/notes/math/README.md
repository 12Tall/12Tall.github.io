---
title: 数学原理  
sidebar: auto  
tags:  
    - 傅里叶  

---


# 数学原理  
此模块主要记录一些感兴趣的，或者会用到的数学工具及其推导过程。  
先给自己看明白，然后能给别人看明白  

## 目录  
1. [傅里叶变换](./傅里叶变换.md)  



## Latex    
### Latex 符号  

| 符号             | 标记                 | 解释   |
| ---------------- | -------------------- | ------ |
| $c = a+b$        | `$c = a+b$`          | inline |
| $c= \frac{a}{b}$ | `$$c= \frac{a}{b}$$` | block  |
| $\int$           | `$\int$`             | 积分   |
| $\sum$           | `$\sum$`             | 累加   |
| $\mathscr{X}$    | `$$\mathscr{X}$$`    | 花体   |

因为在表格内无法渲染块级元素，所以有些符号看起来会变样，如：$\sum_{n=1}^{\infty}$，其实应该是  
$$\sum_{n=1}^{\infty}$$

### Vuepress 配置
`vuepress` 中`Latex` 插件的配置：  
```js{9,20-22}
// 首先安装 @iktakahiro/markdown-it-katex
// yarn add @iktakahiro/markdown-it-katex
// docs/.vuepress/config.js
module.exports = {
    // ...
    head: [
        // ...
        // latex support
        // ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css' }],  // 非必须        
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
}  

```