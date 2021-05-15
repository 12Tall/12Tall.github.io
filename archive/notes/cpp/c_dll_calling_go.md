---
title: 通过远程线程加载golang 生成的dll  
sidebar: auto  
tags:  
    - golang  
    - dll  
    - remote  
    - thread  
    - c
    - DllMain  
    - inject  
--- 

# 通过远程线程加载golang 生成的dll 

事情的起因是~~我想学黑~~，最近在看dll 远程线程注入的文章。迫于C/C++ 写起来太过繁琐，结合[Windows 下C 调用Golang](./c_calling_go.md)，就想着能不能通过C 调用golang 编译的dll，进而将C 作为胶水语言使用。于是就有了本文。  

目标：在`notepad.exe` 上启动一个简单的http 服务。  
环境：`Win10 Pro 64 位`、`MinGW-w64`、`golang 15.6`

## 直接调用  
因为直接从头到尾开发的话，可能会让人看得一头雾水，我准备先从较小的模块开始写起。这也是一次完整的实践流程。  
### golang 编写http 服务  
代码参考自简书[go实现简单的http服务](https://www.jianshu.com/p/8f208a6596f7)，这里稍作修改：  
```go{19-29}  
// http.go
package main

import "C"
import (
	"fmt"
	"net/http"
)

// http 请求处理函数
func sayHello(w http.ResponseWriter, r *http.Request) {
	_, _ = w.Write([]byte("Hello World!"))
}

// 导出函数。在编译成DLL 后可被调用者发现  
// 下面的注释必须有 //export 函数名  
// 其中导出函数名最好与原函数名保持一致 

//export StartHttp
func StartHttp() {
	http.HandleFunc("/", sayHello)

	err := http.ListenAndServe("127.0.0.1:9999", nil)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	fmt.Printf("Listening: http://127.0.0.1:9000")
}

func main() {
    // StartHttp();  // 调试时取消这一行的注释  
    // 编译时main 函数最好为空
}
```  
通过以下命令进行调试：  
```bash
# 注意调试时需要取消掉main 方法里面的注释
go run .\http.go  # 如果不出意外，访问`http://localhost:9999` 就能看到`Hello World!` 了  

# 编译  
go build -buildmode=c-shared -o http.dll .\http.go
```
编译好后待用。

### C 编写dll  
如果我们需要从远程线程注入上面的`http.dll` 是不行的，因为它没有显式的入口函数。需要用C/C++ 开发一个带入口函数的`loader.dll` 来包装一下。注入`loader.dll`，在`loader.dll` 初始化的过程中，加载并获取`http.dll` 内`StartHttp()` 函数的地址。注意，只获取地址就行了，不要执行，因为一旦执行就会引发程序死锁。这是本文的重点一。  

#### dll 参数传递  
因为加载dll 时不能传入参数，所以我们需要在`loader.dll` 中开辟一块共享内存来存放从`http.dll` 获取到的`StartHttp()` 函数的句柄（可以理解为指针）。为什么要用共享内存，因为同一个dll 加载到不同的进程中的地址可能也是不一样的。这也是本文的重点二。  

```c{4-13,47-51}
#include <windows.h>
#include <stdio.h>

// 开辟共享内存的宏命令
#ifdef __GNUC__
HANDLE k __attribute__((section(".shared"), shared)) = NULL;
#endif
#ifdef _MSC_VER
#pragma data_seg(".shared")
HANDLE k = NULL;
#pragma data_seg()
#pragma comment(linker, "/section:.shared,RWS")
#endif

typedef void (*StartHttp)();  // 函数类型定义

HMODULE hHttp = NULL;  // 用来存放http.dll 句柄

BOOL APIENTRY DllMain(HMODULE hModule,
                      DWORD ul_reason_for_call,
                      LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
    {
        // 简化了一些一场判断
        hHttp = LoadLibrary("http.dll");
        StartHttp startWorker = (StartHttp)GetProcAddress(hHttp, "StartHttp");
        k = startWorker;  // 将http.dll 中的StartHttp() 的句柄（指针）放入共享内存
        break;
    }

    case DLL_PROCESS_DETACH:
    {
        FreeLibrary(hHttp);  // 进程结束时释放http.dll
        break;
    }
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    default:
        break;
    }
    return TRUE;
}

// 导出函数，用于调用者获取共享内存中的变量
HANDLE GetHttpStarter()
{
    return k;
}
```

如果是直接调用`http.dll` 的话，是不需要这个C 语言中间层的。编译备用  
```bash
gcc .\loader.c -shared -o .\loader.dll
```

### 调试  
下面是通过C 语言调用`loader.dll` 进而调用`http.dll` 的例子。
```c{15-18}
// client.c  
#include <windows.h>
#include <stdio.h>
#include <memory.h>

typedef void (*StartHttp)();  // http.dll 中的到处方法类型
typedef HMODULE (*GetHttpStarter)();  // loader.dll 中的导出方法类型

int main()
{
    char *dllPath = "loader.dll";
    HMODULE hLoader = NULL;

    hLoader = LoadLibrary("loader.dll");
    GetHttpStarter getHttpStarter = (GetHttpStarter)GetProcAddress(hLoader, "GetHttpStarter");
    // 获取loader.dll 中的到处方法
    StartHttp startHttp = (StartHttp)getHttpStarter();
    // 获取http.dll 中的导出方法
    startHttp();  // 启动http 服务
    printf("^^\n");
    FreeLibrary(hLoader);
    return 0;
}

```  
编译，并且将`loader.dll`、`http.dll` 放在同一目录，然后执行  
```bash
gcc .\client.c -o .\client.exe  

.\client.exe 
# 正常来说，访问`http://localshost:9999` 也是能看到`Hello World!` 的
```

## 远程线程注入
一般来说，`LoadLibrary` 函数会默认加载同目录下的dll 文件。由于我们是在目标进程中开启远程线程，那么在加载dll 文件时的默认目录就需要手工指定了，最好是绝对目录。  
参考[远程线程注入dll](./远程线程注入dll.md)。我们可以修改`client.c`   

::: details Client.c 
```c{15-19,}
// client.c  
#include <windows.h>
#include <stdio.h>
#include <TlHelp32.h>
#include <string.h>

typedef void (*StartHttp)();
typedef HMODULE (*GetHttpStarter)();

DWORD GetProcIdByName(const char *sProcName);
void InjectDll(DWORD nPid, const char *sDllName);

int main(int argc, char *argv[])
{
    // 获取loader.dll 的绝对路径
    char dllPath[MAX_PATH],
        *dllName = "\\loader.dll";
    GetCurrentDirectory(MAX_PATH, dllPath);
    strncat(dllPath, dllName, strlen(dllName));

    // 获取目标进程
    char *sTarget = argv[1];
    int nPid = 0;
    if (0 == (nPid = GetProcIdByName(sTarget)))
    {
        printf("There is no process named %s\n", sTarget);
        exit(1);
    }
    // 第一次开启远程线程，注入loader.dll  
    // 自动加载http.dll  
    InjectDll(nPid, dllPath);
    
    // 客户端加载loader.dll 通过共享内存获取http.dll 中函数的实际位置
    HMODULE hLoader = LoadLibrary(dllPath);
    GetHttpStarter getHttpStarter = (GetHttpStarter)GetProcAddress(hLoader, "GetHttpStarter");
    StartHttp startHttp = (StartHttp)getHttpStarter();

    // 第二次开启远程线程  
    // 启动http 服务
    HANDLE hProcess =OpenProcess(PROCESS_ALL_ACCESS, FALSE, nPid);
    HANDLE hThread;
    DWORD dwThread = 0;
    hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)startHttp, NULL, 0, &dwThread);    
    CloseHandle(hProcess);
    CloseHandle(hThread);
    
    printf("^^\n");
    FreeLibrary(hLoader);
    return 0;
}


// 通过进程名获取进程Id
DWORD GetProcIdByName(const char *sProcName)
{
    PROCESSENTRY32 pe32;
    pe32.dwSize = sizeof(PROCESSENTRY32);

    HANDLE hProcessSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hProcessSnap == INVALID_HANDLE_VALUE)
    {
        return -1;
    }

    BOOL bMore = Process32First(hProcessSnap, &pe32);

    while (bMore)
    {
        if (strcasecmp(pe32.szExeFile, sProcName) == 0)
        {
            return pe32.th32ProcessID;
        }
        bMore = Process32Next(hProcessSnap, &pe32);
    }
    CloseHandle(hProcessSnap);
    return 0;
}

// 将dll 注入目标进程
void InjectDll(DWORD nPid, const char *sDllName)
{
    HANDLE hProcess = 0;
    HANDLE hThread;
    DWORD dwThread = 0;

    hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, nPid);
    if (hProcess == NULL)
    {
        printf("open process failed\n");
        CloseHandle(hProcess);
        exit(1);
    }

    PVOID pDllName = VirtualAllocEx(hProcess, NULL, strlen(sDllName) + 1, MEM_COMMIT, PAGE_READWRITE);
    if (pDllName == NULL)
    {
        printf("allocate memory for dll failed\n");
        CloseHandle(hProcess);
        exit(1);
    }

    SIZE_T lenDll = 0;
    WriteProcessMemory(hProcess, pDllName, (BYTE *)sDllName, strlen(sDllName) + 1, &lenDll);

    // 获取Kernal32.dll 中的`LoadLibraryA` 方法
    HMODULE hModule = GetModuleHandle(TEXT("Kernel32.dll"));
    if (hModule == NULL)
    {
        printf("Load Kernel32.dll failed\n");
        CloseHandle(hProcess);
        exit(1);
    }
    FARPROC func1 = GetProcAddress(hModule, "LoadLibraryA");

    hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)func1, pDllName, 0, &dwThread);
    
    if (hThread == 0)
    {
        printf("create remote thread failed");
        CloseHandle(hProcess);
        CloseHandle(hThread);
        exit(1);
    }

    CloseHandle(hProcess);
    CloseHandle(hThread);
}
```
:::  

同时`loader.dll` 在加载`http.dll` 时也需要绝对路径。  

::: details loader.c
```c{29-35}
#include <windows.h>
#include <stdio.h>

#ifdef __GNUC__
HANDLE k __attribute__((section(".shared"), shared)) = NULL;
#endif
#ifdef _MSC_VER
#pragma data_seg(".shared")
HANDLE k = NULL;
#pragma data_seg()
#pragma comment(linker, "/section:.shared,RWS")
#endif

typedef void (*StartHttp)();

HMODULE hHttp = NULL;
char dllPath[MAX_PATH],
    *dllName = "loader.dll",
    *workerName = "http.dll";

BOOL APIENTRY DllMain(HMODULE hModule,
                      DWORD ul_reason_for_call,
                      LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
    {
        // 获取http.dll 的绝对路径
        int nameLen = strlen(dllName) - 1;
        GetModuleFileName(hModule, dllPath, strlen(dllPath) - 1);
        int fullLen = strlen(dllPath) - 1;
        memset(dllPath + fullLen - nameLen, '\0', nameLen);
        strncat(dllPath, workerName, strlen(workerName));
        hHttp = LoadLibrary(dllPath);

        // hHttp = LoadLibrary("http.dll");
        StartHttp startWorker = (StartHttp)GetProcAddress(hHttp, "StartHttp");
        k = startWorker;
        break;
    }

    case DLL_PROCESS_DETACH:
    {
        FreeLibrary(hHttp);
        break;
    }
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    default:
        break;
    }
    return TRUE;
}

HANDLE GetHttpStarter()
{
    return k;
}
```
:::

重新编译，先启动`notepad.exe`，再执行`.\client.exe`。就能在`notepad.exe` 进程上创建一个`http` 服务，访问`http://localhost:9999/` 将会看到`Hello World!` 字样。大功告成！

本文可以说是这三天思考的成果，也可以说是这两年一直想搞定的东西（~~干坏事儿~~）。因为C 语言虽然执行效率比较高，但是开发效率却是太低了，对开发人员要求比较高。而很多专业工具只提供了C/C++（对，没有python） 的接口，如果用C 做胶水，而实际工作用其他带GC 的高级语言，则开发效率也会高不少。

## 参考链接  
1. [Is it possible to load a go-dll in c-dll on Windows?](https://stackoverflow.com/questions/65304131/is-it-possible-to-load-a-go-dll-in-c-dll-on-windows?noredirect=1#comment115450808_65304131)
2. [Dynamic-Link Library Best Practices](https://docs.microsoft.com/en-us/windows/win32/dlls/dynamic-link-library-best-practices)
3. [Shared memory segment in a C++ Class Library (DLL) using #pragma data seg](https://forum.pellesc.de/index.php?topic=4725.0)