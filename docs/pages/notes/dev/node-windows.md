---
title: node-windows  
sidebar: auto  
tags: 
    - service  
    - windows  
    - node
--- 

# node-windows  
`node-windows` 可以将`.js` 代码安装为服务，且可以随时更新`.js` 代码，之后只需重启下服务即可。

## 安装服务  
### install_service.js
代码中的`logger` 请参考[log4js](./../log4js/README.md)的用法  
```js
// install_service.js
const logger = require('logger'),
path = require('path');

const Service = require('node-windows').Service;

let srv = new Service({
    name: 'server monitor',
    description: 'detect whether the servers available',
    script: path.join(__dirname,'src/index.js')
})

srv.on('install',()=>{
    logger.info('Service installed')
    srv.start();
})

srv.install();
```   

### 安装  
```bash  
# 切换至项目根目录
node ./install_service.js
```

## 卸载服务    

### remove_service.js 
卸载与安装的源码几乎一模一样   
```js
const logger = require('logger'),
    path = require('path');

const Service = require('node-windows').Service;

let srv = new Service({
    name: 'server monitor',
    description: 'detect whether the servers available',
    script: path.join(__dirname, 'src/index.js')
})

srv.on('uninstall', () => {
    logger.info('Uninstall compelete.')
    logger.info(`The service exists: ${srv.exists}`)
})

srv.uninstall();
```

### 卸载
```bash
node ./remove_service.js
```

## logger.js  

```js
var log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'console' },
        srv: {
            type: 'dateFile',
            filename: `${__dirname}/logs/log`,
            keepFileExt:false,
            "pattern": "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['out', 'srv'], level: 'all' },
    }
})

const logger = log4js.getLogger();

module.exports = logger;
```

## 参考资料  
1. [node-windows](https://www.npmjs.com/package/node-windows)  