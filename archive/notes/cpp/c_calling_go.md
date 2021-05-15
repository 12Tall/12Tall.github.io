---
title: Windows 下C 调用Golang  
sidebar: auto  
tags:  
    - C  
    - windows  
    - dll
    - go
---  

# Windows 下C 调用Golang   

在很多专业软件里面会提供C/C++，的接口，但是C 语言的内存管理操作过于复杂。于是想到是否可以通过C 做胶水语言，实际上调用golang 来完成任务。不过golang 导出到C 的数据，也是需要手工回收的，但是只需对接口交换的数据处理一次就够了。  

## 准备工作  
安装Golang、MinGW，这里要注意的是Golang 与MinGW 的位宽一定要是一致的，否则在编译时会出错。本文选择的都是64 位的程序。  

### 变量类型  
通过引入`'C'` 包，可以使用C 兼容的变量类型。
| C                      | Golang         | 宽度             |
| ---------------------- | -------------- | ---------------- |
| char                   | C.char         | byte             |
| signed char            | C.schar        | int8             |
| unsigned char          | C.uchar        | uint8            |
| short int              | C.short        | int16            |
| short unsigned int     | C.ushort       | uint16           |
| int                    | C.int          | int              |
| unsigned int           | C.uint         | uint32           |
| long int               | C.long         | int32 or int64   |
| long unsigned int      | C.ulong        | uint32 or uint64 |
| long long int          | C.longlong     | int64            |
| long long unsigned int | C.ulonglong    | uint64           |
| float                  | C.float        | float32          |
| double                 | C.double       | float64          |
| wchar_t                | C.wchar_t      |                  |
| void *                 | unsafe.Pointer |                  |

在使用时注意内存的释放  
```go
cs := C.CString("PN")
// ...
C.free(unsafe.Pointer(cs))
```

## 示例代码  
示例包含两个文件：`trj.go` 和`main.c`。  
需要注意的是，golang 中需要有特殊的注释来声明导出函数。  

### trj.go 源码  
```go{3,17,22,27,34}
package main

// #include <stdlib.h>
import "C"

// 添加C 库的支持，用于类型转换
// 使用C.free 时，必须按照上面格式引入C 语言的头文件。

import (
	"fmt"
	"unsafe"
)

// 下面的注释是必须的，声明该函数会被导出
// export 前后分别必须只有0 个和1 个空格

//export PrintBye
func PrintBye() {
	fmt.Println("bye")
}

//export Sum
func Sum(a C.int, b C.int) C.int {
	return a + b
}

//export GetStr
func GetStr() *C.char {
	var a = "1"
	var b = "2"
	return C.CString(a + b)
}

//export FreeStr
func FreeStr(str unsafe.Pointer) {
	C.free(str)
}

func main() {
    // main 方法是必须的
}
```  

### main.c 源码

```c{11,13,14,17,23-25,34}
#include <Windows.h>
#include <stdio.h>

typedef void (*LPPrintBye)();
typedef int (*Sum)(int, int);
typedef char *(*GetStr)();
typedef void (*FreeStr)(void *);

int main()
{
    HMODULE hTrj = LoadLibrary("trj.dll");
    printf("dll addr: %p\n", hTrj);
    LPPrintBye printBye = (LPPrintBye)GetProcAddress(hTrj, "PrintBye");
    Sum sum = (Sum)GetProcAddress(hTrj, "Sum");
    printf("Sum addr: %p\n", sum);
    printf("1+2 = %d\n", sum(1, 2));
    GetStr getStr = (GetStr)GetProcAddress(hTrj, "GetStr");
    printf("GetStr addr: %p\n", getStr);
    char *str = getStr();
    printf("str = %p\n", str);
    printf("str addr: %s\n", str);

    FreeStr freeStr = (FreeStr)GetProcAddress(hTrj, "FreeStr");
    printf("FreeStr addr: %p\n", freeStr);
    freeStr(str);
    
    // 注意这里字符串已经被回收了，但是指针的指向还没变
    printf("----- free str -----\n");
    printf("str = %p\n", str);
    printf("str addr: %s\n", str);
    str = NULL; // 指针指向安全位置

    printBye();
    FreeLibrary(hTrj);
    return 0;
}
```

### 编译执行
编译命令很简单，编译后会产生`.dll` 和`.h` 两个文件    
```bash
go build -ldflags "-s -w" -buildmode=c-shared -o trj.dll trj.go  
# -s, -w 用于减小动态链接库的体积  
# -s 压缩  
# -w 去掉调试信息  

# 但是一般用更简单的命令 
go build -buildmode=c-shared -o trj.dll trj.go

# 当然，也可以生成静态链接库文件  
go build -buildmode=c-archive trj.go    
# 此命令会生成`.a` 和`.h` 文件


gcc .\main.c  

.\a.exe # 即可看到执行的结果  
```


## 参考链接  
1. [Go和C类型对应关系](https://studygolang.com/articles/6798)
2. [golang之cgo一---go与C基本类型转换](https://www.cnblogs.com/adjk/p/9469845.html)
3. [golang C.CString 必须Free](https://my.oschina.net/u/1431106/blog/188646?p={{currentPage-1}})  
4. [Golang编写Windows动态链接库(DLL)及C调用范例](https://www.cnblogs.com/Kingram/p/12088087.html)
5. [golang —— 语言交互性](https://www.cnblogs.com/zhance/p/10135142.html)