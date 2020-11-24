---
title: Mingw 制作dll  
sidebar: auto  
tags:  
    - mingw  
    - gcc  
    - g++  
    - dll  
    - windows  
---   

# Mingw 制作dll  
## 简单的dll  
在`mingw` 下生成dll 文件很简单    
```c
// my_dll.c  
#include<windows.h>
#include<stdio.h>

int add(int a, int b){
    return a+b;
}  

// dll 入口函数
BOOL APIENTRY DllMain( 
    HMODULE hModule,
    DWORD  ul_reason_for_call,
    LPVOID lpReserved)
{
    printf("my_dll is loaded\n");
    return TRUE;
}
```  
执行以下命令，将会在当前目录生成生成`my_dll.dll`    
```bash 
gcc ./my_dll.c -shared -o my_dll.dll
```
通过以下代码调用生成的动态链接库  
```c
#include <windows.h>
#include<stdio.h>

typedef int (*Add)(int ,int);  // 定义函数指针类型

int main(void){
    HMODULE hDll = LoadLibrary("my_dll.dll");
    if (hDll != NULL){
        // 从my_dll.dll 中取得函数  
        Add add = (Add)GetProcAddress(hDll, "add");  

        if (add != NULL){  // 执行函数
            printf("a+b=%d\n",add(a,b));  
        }

        FreeLibrary(hDll);  // 释放my_dll.dll
    }
}
```

## dll 入口函数    
```c
BOOL APIENTRY DllMain( 
    HMODULE hModule,  // 指向dll 本身的句柄
    DWORD  ul_reason_for_call,  // 被调用的原因(触发事件)
    LPVOID lpReserved  // 保留参数，无意义  
    )
{
    // DWORD  ul_reason_for_call
    switch(ul_reason_for_call){
        case DLL_PROCESS_ATTACH: break;  // dll 第一次被进程加载
        case DLL_PROCESS_DETACH: break;  // 释放dll 
        case DLL_THREAD_ATTACH: break;   // 当进程创建线程时
        case DLL_THREAD_DETACH: break;   // 当进程销毁线程时
    }
    return TRUE;
}

```  

## 参考链接  
1. [使用mingw制作dll文件](https://www.cnblogs.com/tonghaolang/p/9253995.html)