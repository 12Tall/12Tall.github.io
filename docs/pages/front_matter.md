---
title: Front Matter
lang: en-US
sidebar: auto  
prev: /pages/About.md
next: false
tags: 
    - 配置
    - 搜索  
    - 标签
---  

## 预定义变量   

```yaml  
---
title: string  # 当前页面的标题
# h1_title || siteConfig.title

lang: string  # 当前页面的语言
# en-US  

description: string  # 当前页面的描述
# siteConfig.description

layout: string  # 当前页面的布局组件
# Layout

permalink: string  # 
# siteConfig.permalink,
# https://www.vuepress.cn/guide/permalinks.html

metaTitle: string  # 重写默认的 meta title
# `${page.title} | ${siteConfig.title}`

meta: array  # 额外的要注入的 meta 标签
# undefined  
    - name: description
      content: hello
    - name: keywords
      content: super duper SEO
---
```  

## 默认主题的预定义变量  

```yaml
---
navbar: boolean  # 导航栏  
# undefined

navbar: boolean|'auto'  # 侧边栏  
# undefined
# auto 生成针对当前页面的侧边栏  

prev: boolean|string  
# undefined  
# prev: ./some-other-page

next: boolean|string  
# undefined  

search: boolean  # 启用内置搜索  
# undefined  

tags: array  # 优化搜索标签
    - 配置
    - 主题
    - 标签
---
```