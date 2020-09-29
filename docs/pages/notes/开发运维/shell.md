---
title: Shell  
sidebar: auto
tags:  
    - shell  
    - node  
    - multiple  
    - process
    - powershell  
    - user  
    - switch  
    - cmd  
    - runas
---  

# Shell  
## Spawn  
可以利用`spawn` 函数创建一个子进程，然后将其输入输出重定向至控制台，或者其他地方    
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

## 切换用户    
Linux 下通过终端`sudo` 容易切换用户，但是Windows 下会稍微复杂一些  
### CMD  
利用`runas` 通过管道运算符`|` 传递密码    
```bash
# cmd
echo password | runas /user:u1 cmd.exe
```

### Powershell  
这是在网络上搜索到的脚本，经过测试后可用，仅作记录  
```powershell
$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ($config_name, $secpasswd)
Start-Process powershell.exe -Credential $mycreds -NoNewWindow
```

## 参考资料  
1. [windows – 如何使用PowerShell切换当前用户？](http://www.voidcn.com/article/p-ryauqmix-byg.html)