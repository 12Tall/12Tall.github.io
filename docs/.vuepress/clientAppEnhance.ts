import { defineClientAppEnhance } from '@vuepress/client'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

export default defineClientAppEnhance(({ app, router, siteData }) => {
    app.use(ElementPlus)
})