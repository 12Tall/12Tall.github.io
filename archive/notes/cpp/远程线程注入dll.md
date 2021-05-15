---
title: 远程线程注入dll  
sidebar: auto  
tags:  
    - dll
    - 注入  
    - 远程线程  
---   

# 远程线程注入dll  
## 开启远程线程  
文中代码多摘自[链接一](https://www.cnblogs.com/DarkBright/p/10820582.html)，仅作部分注释      
```c
// =========== //
// 宿主进程源码 //
// =========== //
#include <windows.h>
#include <stdio.h>

void Fun(void)
{
    for(size_t i = 0; i < 10; i++){
        // 打印函数地址
        // __FUNCTION__: 获取函数名
        // __FILE__: 获取文件名
        // __LINE__: 获取行号
        printf("%s addr:0x%p\r\n", __FUNCTION__, Fun);
    }         
}

int main(int argc, char* argv[])
{
    Fun();
    //MessageBox(NULL, TEXT("执行完成!"), TEXT("提示"), MB_OK);

    getchar();  // 暂停
    return 0;
}

// =================== //
// 主程序：开启远程线程 //
// =================== //
#include <windows.h>
#include <stdio.h>

// 宿主进程中打印的函数地址
#define FUN_ADDR 0x0000000000401550

DWORD getPid(LPTSTR name);
int main(int argc, char *argv[])
{

    HANDLE hProcess = 0;
    HANDLE hThread;
    DWORD dwThread = 0;

    // 打开进程，第三个参数是进程目标进程ID
    hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, 8684);

    if (hProcess == NULL)
    {
        printf("can not open process");
        return -1;
    }

    // 开启远程线程
    hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)FUN_ADDR, NULL, 0, &dwThread);  
    /**
    * hProcess：目标进程的句柄
    * lpThreadAttributes：安全描述符的结构体指针，填 NULL 即可
    * dwStackSize：要创建的远程线程的堆栈大小，一般填 0 使用默认大小
    * lpStartAddress：远程线程的执行体，也就是创建的线程要执行的过程函数
    * lpParameter：远程线程执行体的参数，与lpStartAddress 配合使用
    * dwCreationFlags：创建标志，一般填0
    * lpThreadId：线程ID的指针，用于接收远程线程创建成功后的ID
    */

    if (hThread == NULL)
    {
        printf("can not create remote thread");
        return -1;
    }

    CloseHandle(hProcess);
    CloseHandle(hThread);
    return 0;
}

```

## 注入dll  
目标进程仍然是上文中的`host.exe`  

### dll 源码
```c
// mydll.c
#include <windows.h>
#include <stdio.h>

void func1()
{
    // 输出函数名及其地址
    printf("%s addr:0x%p\n", __FUNCTION__, func1);
}

BOOL APIENTRY DllMain(HMODULE hModule,
                      DWORD ul_reason_for_call,
                      LPVOID lpReserved)
{
    switch (ul_reason_for_call)
    {
    case DLL_PROCESS_ATTACH:
        MessageBox(NULL, TEXT("DLL inject successfully"), TEXT("Warning:"), MB_OK);
        func1();
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
// 执行 gcc .\mydll.c -shared -o mydll.dll 以生成动态链接库  
```  

### 程序主体  
```c
#include <windows.h>
#include <stdio.h>

// 进程id  
#define Pid 26036
// dll 可以用绝对路径，也可以用相对路径  
// 但最好还是用绝对路径
#define DLL_NAME "mydll.dll"

int main(int argc, char *argv[])
{
    HANDLE hProcess = 0;
    HANDLE hThread;
    DWORD dwThread = 0;

    // 打开进程  
    hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, Pid);
    if (hProcess == NULL)
    {
        printf("can not open process");
        return -1;
    }

    // 在进程内存入dll 路径字符串  
    // 即将`my_dll.dll` 字符串保存至进程空间
    PVOID pDllName = VirtualAllocEx(hProcess, NULL, strlen(DLL_NAME) + 1, MEM_COMMIT, PAGE_READWRITE);
    if (pDllName == NULL)
    {
        printf("can not allocate memory for dll");
        return -1;
    }
    // 写入dll 名称
    SIZE_T lenDll = 0;
    WriteProcessMemory(hProcess, pDllName, (BYTE *)DLL_NAME, strlen(DLL_NAME) + 1, &lenDll);
    
    // 获取Kernal32.dll 中的`LoadLibraryA` 方法
    HMODULE hModule = GetModuleHandle(TEXT("Kernel32.dll"));
    if (hModule == NULL)
    {
        printf("can not get ");
        return -1;
    }
    FARPROC func1 = GetProcAddress(hModule, "LoadLibraryA");
    
    // 在开启远程线程时，执行LoadLibraryA，加载my_dll.dll
    hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)func1, pDllName, 0, &dwThread);
    if (hThread == NULL)
    {
        printf("can not create remote thread");
        return -1;
    }

    CloseHandle(hProcess);
    CloseHandle(hThread);
    return 0;
}
```

由以上程序，即可在进程中开启远程线程，注入`dll`，并且执行了`dll` 的入口函数。而`dll` 文件则可由`C/C++`、`C#` 等语言开发。  
本文唯一的不足是不能直接根据进程名获取到进程ID，可以采用[链接三](https://www.cnblogs.com/zhangxuechao/p/11709366.html)的方法进行获取。  

```c
// get_pid.c
#include <Windows.h>
#include <stdio.h>
#include <TlHelp32.h>

DWORD GetPid(const char *strProcessName);

int main()
{
    GetPid("host.exe");
    return 0;
}

DWORD GetPid(const char *strProcessName)
{
    PROCESSENTRY32 pe32;
    pe32.dwSize = sizeof(PROCESSENTRY32);

    HANDLE hProcessSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hProcessSnap == INVALID_HANDLE_VALUE)
    {
        printf("CreateToolhelp32Snapshot 调用失败.\n");
        return -1;
    }

    BOOL bMore = Process32First(hProcessSnap, &pe32);

    while (bMore)
    {
        // 打印所有进程信息
        // printf("Process Name: %s\n", pe32.szExeFile); 
        // printf("Process Id: %u\n\n", pe32.th32ProcessID);
        if (lstrcmp(pe32.szExeFile, strProcessName) == 0)
        {
            break;
        }

        bMore = Process32Next(hProcessSnap, &pe32);
    }
    CloseHandle(hProcessSnap);

    return pe32.th32ProcessID;
}
```  

## 注意事项  
1. 对于32 位的目标进程，应当将源码编译为32 位的可执行程序然后注入。否则不会有任何结果；  
2. 对于MinGW 来说，仅支持32 位gcc；而Mingw64 仅支持64 位。虽然可以通过`-m[32|64]` 指定编译时的目标架构，但是会报异常。  

## 参考连接  
1. [Win32创建远程线程](https://www.cnblogs.com/DarkBright/p/10820582.html)
2. [远程线程注入DLL](https://www.cnblogs.com/DarkBright/p/10821038.html)  
3. [Windows 获取进程ID](https://www.cnblogs.com/zhangxuechao/p/11709366.html)  