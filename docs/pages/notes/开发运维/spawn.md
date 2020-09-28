---
title: spawn  
sidebar: auto
tags:  
    - spawn  
    - node  
    - multiple  
    - process
---  

# spawn  
## 示例  
```js
const { spawn } = require("child_process");

let proc = spawn('cmd.exe', { stdio: 'pipe' });


proc.stdout.on('data', data => {  // 控制台的输出在data 事件中
    console.log(`stdout: \n ${data} \n`)
});

proc.stderr.on('data', data => {
    console.log(`stdout: \n ${data} \n`)
});

proc.stdin.write('dir\n');  // 运行环境即为当前脚本的运行环境
```