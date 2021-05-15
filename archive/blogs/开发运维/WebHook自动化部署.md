---
title: Auto Deploy  
sidebar: auto  
tags:  
    - 自动化  
    - 部署
    - webhook  
    - git  
    - node  
    - gogs
---  

## 流程  
其实就是Git 服务端在接收到`push` 事件后，向另一台服务器发送一个事件；另一台服务器接收到事件后，执行自动化脚本  
1. 监听`Git` 提交  
2. 运行指定脚本  

### 配置WebHook  
在`Gogs` 对应的仓库的`Setting` 中，选择添加`Web 钩子`，依次填写   
- 接收信息的`url`（GitHub 中需要有公网域名才行）  
- 数据格式：默认为`application/json`  
- 密钥`Secret`：用于`HMAC` 加密消息体，并将计算结果保存在在`X-Gogs-Signature`   

### 编写钩子  
#### 最小服务  
```js  
const http = require('http');
const crypto = require('crypto')


const server = http.createServer((req, res) => {
    let rawH = req.rawHeaders;
    let sign = rawH[rawH.indexOf("X-Gogs-Signature") + 1];
    let event = rawH[rawH.indexOf("X-Gogs-Event") + 1];
    req.on('data', data => {
        if(sign === HMAC(data)){
            console.log(event)  // 最重要的两个变量
            console.log(JSON.parse(data))  

            // 执行自动化脚本
        }
    });

    console.log("=============================");
    res.end("over")
});

server.listen(3000, () => {
    console.log('http://localhost:3000')
})

function HMAC(msg) {
    const Algorithm = 'sha256'
    const secret = '123'
    const hmac = crypto.createHmac(Algorithm, secret)
    hmac.update(msg)
    return hmac.digest('hex')
}

```  

#### 消息格式   

<details>  
<summary>以修改工单为例</summary>

```json  
// 原始消息头
rawHeaders: [
    "Host",
    "10.15.1.133:3000",
    "User-Agent",
    "GogsServer",
    "Content-Length",
    "1713",
    "Content-Type",
    "application/json",
    "X-Github-Delivery",
    "2a2ce199-fb15-447d-b7f2-a517e0b7ccf2",
    "X-Github-Event",
    "issues",
    "X-Gogs-Delivery",
    "2a2ce199-fb15-447d-b7f2-a517e0b7ccf2",
    "X-Gogs-Event",
    "issues",
    "X-Gogs-Signature",
    "e7ad70085c43871aac8f343039e53dbea25396c481d0116b23870e94ad214070",
    "Accept-Encoding",
    "gzip"
  ]

// 消息体
body:{
  "action": "edited",  // 动作
  "number": 48,  // 
  "issue": {
    "id": 49,  // 不知道额
    "number": 48,
    "user": {  // 用户信息
      "id": 1,
      "username": "12tall",
      "login": "12tall",
      "full_name": "12tall",
      "email": "12tall@12tall.com",
      "avatar_url": "http://{ip}:{port}/avatars/1"
    },
    // issue 信息
    "title": "测试web 钩子",  // issue 标题
    "body": "测试测试",  // issue 内容
    "labels": [],
    "milestone": null,
    "assignee": null,
    "state": "open",
    "comments": 0,
    "created_at": "2020-09-21T16:22:46+08:00",
    "updated_at": "2020-09-21T16:22:46+08:00",
    "pull_request": null
  },
  "changes": {  // issue 变更
    "body": {
      "from": "测试"
    }
  },
  "repository": {  // 仓库信息
    "id": 17,
    "owner": {  // 所有者
      "id": 9,
      "username": "{user}",
      "login": "{user}",
      "full_name": "",
      "email": "",
      "avatar_url": "http://{ip}:{port}/avatars/9"
    },
    "name": "{repo}",  
    "full_name": "{user}/{repo}",
    "description": "三年磨一剑\r\n",
    "private": true,
    "fork": false,
    "parent": null,
    "empty": false,
    "mirror": false,
    "size": 14571520,
    "html_url": "http://{ip}/{user}/{repo}",
    "ssh_url": "git@{ip}:{user}/{repo}.git",
    "clone_url": "http://{ip}:{port}/{user}/{repo}.git",
    "website": "",
    "stars_count": 0,
    "forks_count": 0,
    "watchers_count": 5,
    "open_issues_count": 5,
    "default_branch": "master",
    "created_at": "2018-08-24T13:30:26+08:00",
    "updated_at": "2020-04-13T14:14:55+08:00"
  },
  "sender": {
    "id": 1,
    "username": "12tall",
    "login": "12tall",
    "full_name": "12tall",
    "email": "12tall@12tall.com",
    "avatar_url": "http://{ip}:{port}/avatars/1"
  }
}
```
</details>
 

## 总结  

1. 学习了原生`http` 模块的`on()` 方法，与原始头部解析  
2. 学习了`Gogs` web 消息的格式  
3. `HMAC` 加密  

### 参考  
1. [Node + Git + Webhook 自动化部署](https://segmentfault.com/a/1190000013141840)  
2. [Web 钩子](https://gogs.io/docs/features/webhook)  
3. [使用node加密解密数据,创建Hash/HMAC，并生成签名与验证签名](https://blog.csdn.net/g1531997389/article/details/79995795)