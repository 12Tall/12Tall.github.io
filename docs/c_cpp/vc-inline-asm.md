---
title: VC 内联汇编  
tags:  
    asm
    inline
    calling convention
---  

## 缘起  
在Windows 下开发[N-API](../nodejs/n-api.md)插件时，有时候会遇到回调函数的问题。WIN32 的API 给约定好了回调函数传递的参数类型和数量。如果我们需要添加额外的参数时，应该怎么办呢？  
```js
// 为方便理解，以JS 代替C 来做说明  
BOOL EnumWindows(
  WNDENUMPROC lpEnumFunc,  // 回调函数lpEnumFunc 接受两个参数
  // BOOL CALLBACK EnumWindowsProc(_In_ HWND hwnd, _In_ LPARAM lParam);
  LPARAM      lParam
);


// 下面是JS 演示的闭包的用法  
function closure(int a){
    // 返回一个函数
    return (_In_ HWND hwnd, _In_ LPARAM lParam)=>{
        a = 1;
        // 函数内部可以访问外层函数的局部变量
    }
}

EnumWindows(closure(1),0);  // 传递生成的回调函数
```

可惜的是，这种混合风格的代码在C 语言中并未得到支持。而网络上比较流行的关于C 语言实现闭包的方法是通过[libffi](https://github.com/libffi/libffi) 来实现，本质上是通过汇编语言，按照不同平台下的函数调用约定来动态构造函数。在谷歌了许久之后，发现网络上并没有很易懂的原理说明，遂放弃继续研究，因为看别人写的源码实在是太麻烦了，尤其是汇编语言。不得不说，汇编似乎是唯一的选择，而我们知道许多C 编译器都支持内联汇编，那我们能不能通过内联汇编来实现我们的需求呢？  

## 函数调用约定  
函数的调用约定主要是函数参数传递的约定，例如在x86 VC中，函数传递参数的方式如下：  
```c
// 代码取自官方文档：
// https://docs.microsoft.com/zh-cn/cpp/assembler/inline/calling-c-functions-in-inline-assembly?view=msvc-160
// InlineAssembler_Calling_C_Functions_in_Inline_Assembly.cpp
// processor: x86
#include <stdio.h>

char format[] = "%s %s\n";
char hello[] = "Hello";
char world[] = "world";
int main( void )
{
    // printf( format, hello, world );
   __asm
   {
      mov  eax, offset world  // 参数从右至左依次压栈
      push eax
      mov  eax, offset hello
      push eax
      mov  eax, offset format
      push eax
      call printf            // 调用函数
      //clean up the stack so that main can exit cleanly
      //use the unused register ebx to do the cleanup
                             // 函数调用之后参数出栈，使得堆栈平衡
      pop  ebx
      pop  ebx
      pop  ebx
   }
}
```

那我们很容易想到，在调用函数之前，我们提前将某些参数放入堆栈，然后再在函数体中取得这些参数，不就可以不受函数签名的限制了嘛？事实证明，这么做是可行的，只是稍微有些麻烦。  

## 简易实现  
为了减少其他因素的影响，这里推荐使用VS 来开发调试，因为VS 调试时支持查看汇编代码，这样会方便不少，而且不需要配置编译器环境等信息。  
```c
#include<stdio.h>

int add(int a) {
	__asm {
	    int val = 0;
        // 3. 在汇编语言中获取参数，可以直接将形参名当作地址用
        // 函数内部的局部变量应该都可以通过这种方式获取
		mov eax, dword ptr[a + 0x04];  // 4. 取得我们手动压入的参数
                                       // 这里有意思的一点就是，我们手动压入的参数地址都大于第一个形参
		mov dword ptr[val], eax;       // 5. 因为内存间不能直接赋值，我们采用eax 作为中转
                                       // 不用担心eax 受到污染，因为我们的代码是在函数最前面的
	}
	// 似乎只要变量未使用，就不会提前占用寄存器
	return a + val;
}

int main(void) {
	int i = 5;
	__asm push dword ptr[i];  // 1. 手动压入参数
	int a = add(3);           // 2. 调用函数
	__asm add esp, 0x04;      // 6. 平衡堆栈，即恢复原先的栈顶指针，也可以用pop 指令
	return a;                 // 7. 这里a 等于8，验证我们的想法是正确的
}

// y由上述代码，也可以看出，VC 内联汇编主要有两种方式：  
// 1. __asm 单条汇编指令  
// 2. __asm{ 汇编代码块 }  
// 而在汇编语言中要取得C 代码中的变量，也是非常简单，dword ptr[a] 就可以得到数值了   
// 需要注意的是，针对不同的目标平台，有不同的调用约定，这里只针对于x86 Windows
```

## 参考阅读  
1. [Can anyone help me interpret this simple disassembly from WinDbg?](https://stackoverflow.com/questions/4024492/can-anyone-help-me-interpret-this-simple-disassembly-from-windbg)