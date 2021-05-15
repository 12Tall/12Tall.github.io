---
title: VM  
sidebar: auto
tags:  
    - 虚拟机  
    - x86  
    - C  
    - 调用栈  
    - 栈帧
    - 编译
---

## 内存  

1. 代码段（text）用于存放代码（指令）  
2. 数据段（data）用于存放初始化了的数据，如`int i = 10;`
3. 未初始化数据段（bss）用于存放未初始化的数据，如`int i[1000];`  
4. 栈（stack）用于处理函数调用相关的数据，如调用帧（calling frame）  
5. 堆（heap）用于为程序动态分配内存  

其分布如下图：
```
+------------------+
|    stack   |     |      high address
|    ...     v     |
|                  |
|                  |
|                  |
|                  |
|    ...     ^     |
|    heap    |     |
+------------------+
| bss  segment     |
+------------------+
| data segment     |
+------------------+
| text segment     |      low address
+------------------+
```

简单起见，本文只实现三个：代码段、数据段以及栈。其中，数据段只用于存放字符串    

理论上虚拟机需要维护一个堆用于内存分配，因为堆是属于操作系统管理的，而在底层不一定有堆的概念。所以引入一个指令`MSET` 来直接使用编译器中的内存。  

于是可在全局定义：  
```c
int *text,     // 代码段
    *oldtext,  // 代码段镜像
    *stack;    // 栈
char *data;    // 数据段，只用来存放字符串
```

在`main()` 方法中进行初始化：  
```c
int main() {
    close(fd);
    ...

    // 为虚拟机分配内存
    if (!(text = old_text = malloc(poolsize))) {
        printf("could not malloc(%d) for text area\n", poolsize);
        return -1;
    }
    if (!(data = malloc(poolsize))) {
        printf("could not malloc(%d) for data area\n", poolsize);
        return -1;
    }
    if (!(stack = malloc(poolsize))) {
        printf("could not malloc(%d) for stack area\n", poolsize);
        return -1;
    }

    // 初始化
    memset(text, 0, poolsize);
    memset(data, 0, poolsize);
    memset(stack, 0, poolsize);

    ...
    program();
}
```  

## 寄存器  

本文中只涉及四个寄存器：  
1. `PC` 程序计数器，存放着下一跳待执行指令的地址  
2. `SP` 堆栈寄存器，永远指向当前的栈顶  
3. `BP` 基数指针寄存器，与`SP` 联合使用，用于校准`SP`，又被称作`帧指针`  
   `SP` 不能改变，但是可以通过赋值给`BP` 来指向栈中数据
4. `AX` 通用寄存器

寄存器定义：  
```c
int *pc, 
    *bp, 
    *sp,  // 上述寄存器存放的都是地址（指针）
    ax,   // 通用寄存器可以存放任何类型的数据
    cycle
```

寄存器的初始化：  
```c
memset(stack, 0, poolsize);
...

bp = sp = (int *)((int)stack + poolsize);
ax = 0;

...
program();
```  

## CPU 指令集  

本文虚拟机支持以下CPU 指令：  
```c
// 按有无参数排序
enum { 
    LEA ,    
    IMM ,    
    JMP ,    CALL,
    JZ  ,    JNZ ,    ENT ,    ADJ ,
    LEV ,    LI  ,    LC  ,    SI  ,
    SC  ,    
    PUSH,    // POP ?
    OR  ,    XOR ,    AND ,
    EQ  ,    NE  ,    LT  ,    GT  ,    LE  ,    GE  ,
    SHL ,    SHR ,    ADD ,    SUB ,    MUL ,    DIV ,    MOD ,
    OPEN,    READ,    CLOS,    PRTF,    MALC,    MSET,    MCMP,
    EXIT 
};
```  

### MOV  

X86 架构中，`MOV dst, src` ，可以将一个立即数、寄存器、或内存地址的内容从`src` 拷贝到`dst`  

但是在本文中将其拆分为5 条独立的指令：  
1. `IMM <num>` 将立即数放入`AX`  
2. `LC` 将地址中的字符载入`AX` 中的**地址**  
3. `LI` 将地址中的整数载入`AX` 中的**地址**  
4. `SC` 将`AX` 中的数据作为字符放入**栈顶的地址**  
5. `SI` 将`AX` 中的数据作为整数放入**栈顶的地址**  

调用示例：  
```c
void eval() {
    int op, *tmp;
    while (1) {
        if (op == IMM)       
            {ax = *pc++;}                  // 因为立即数顺序上紧随指令，所以*pc 既是立即数
        else if (op == LC)   
            {ax = *(char *)ax;}            // 将AX 地址中的数据载入AX
        else if (op == LI)   
            {ax = *(int *)ax;}             // 
        else if (op == SC)   
            {ax = *(char *)*sp++ = ax;}    // *sp++ 相当于POP 出栈
        else if (op == SI)   
            {*(int *)*sp++ = ax;}          // 
    }

    ...
    return 0;
}
```

### PUSH  

因为只有一个寄存器`AX`，所以`PUSH` 操作可简化为下列情景：  
```c
else if (op == PUSH) {*--sp = ax;}    // PUSH 操作
```

### JMP  

无条件跳转  

```c
else if (op == JMP)  {pc = (int *)*pc;}  // 修改程序计数器，下一个时钟周期跳转
```

### JNZ  

判断`AX` 是否为`0`  
```c
else if (op == JZ)   {pc = ax ? pc + 1 : (int *)*pc;}  
else if (op == JNZ)  {pc = ax ? (int *)*pc : pc + 1;}
// pc+1, 跨过立即数地址
```  

### 子函数调用  

汇编中最难理解的部分，牵扯的指令有`CALL`、`ENT`、`ADJ`、`LEV`  

- `CALL <addr>` 和`RET`。函数调用与直接跳转的最大区别实惠保留堆栈信息    
    ```c
    else if (op == CALL) {
        *--sp = (int)(pc+1);   // 将即将执行的指令地址压栈
        pc = (int *)*pc;  // 将程序计数器修改为目标函数地址
    }
    /**
    * else if (op == RET)  {
    *   pc = (int *)*sp++;  // 将之前保存的指令地址出栈
    * }
    **/
    ```
    `RET` 后面将被`LEV` 指令替代。  

### C 语言函数调用标准

1. 由调用者将参数入栈  
2. 调用结束时，由调用者将参数出栈  
3. 参数逆序入栈  

```c
// 本文中的参数是顺序入栈的  
int callee(int, int, int);

int caller(void)
{
	int i, ret;

	ret = callee(1, 2, 3);
	ret += 5;
	return ret;
}
```  

会生成如下汇编代码，可以结合下文[栈帧](#栈帧)理解：  

```nasm  
caller:                     
	push    ebp             ; 保存旧的调用帧
	mov     ebp, esp        ; 初始化新的调用帧

    sub     1, esp          ; esp 自减1，局部变量i
    
                            ; 参数入栈
	push    3
	push    2
	push    1

	                        ; 调用子函数 
                            ; 结果保留在ax 
	call    callee          ; CALL 指令保存了返回地址

	                        ; esp 自增12(3x4 byte)，相当于连续出栈3 次
	add     esp, 12

                            ; ax 自增5
	add     eax, 5
	                        ; 恢复堆栈
    mov     esp, ebp        ; 这里直接忽略掉了局部变量i，因为直接赋值省去了POP 操作
	pop     ebp
	                        ; return
	ret
``` 
    
### ENT  

`ENT <size>` 是指`enter`。用于实现`make new call frame` 的功能。  
- 保存当前的栈帧指针  
- 在栈上开辟空间，用以存放局部变量  

汇编代码:  
```nasm
; make new call frame
push    ebp
mov     ebp, esp
sub     1, esp       ; save stack for variable: i
```

实现如下：  
```c
else if (op == ENT)  {
    *--sp = (int)bp;    // 保存上一个栈帧
    bp = sp;            // 重新初始化栈帧
    sp = sp - *pc++;    // 局部变量空间<size> 个
} 
```  

### ADJ  

`ADJ <size>` 用于实现`remove arguments from frame`。在调用子函数时将压入栈的数据清除。因为当前虚拟机中`ADD` 指令能实现的功能有限。  

汇编代码：  
```nasm
; remove arguments from frame
add     esp, 12
```  

实现如下：  
```c
else if (op == ADJ)  {
    sp = sp + *pc++;    // 直接修改栈顶指针
} 
```

### LEV  

该指令的作用为：  
- 替代`POP`  
- 整合`RET`  

汇编代码：  
```nasm
; restore old call frame
mov     esp, ebp
pop     ebp
; return
ret
```  

### LEA  

为了在子函数中获取传入的参数，规定`LEA <offset>`。用于获取传入子函数的参数：
```
sub_function(arg1, arg2, arg3);

|    ....       | high address
+---------------+
| arg: 1        |    new_bp + 4
+---------------+
| arg: 2        |    new_bp + 3
+---------------+
| arg: 3        |    new_bp + 2
+---------------+
|return address |    new_bp + 1
+---------------+
| old BP        | <- new BP
+---------------+
| local var 1   |    new_bp - 1
+---------------+
| local var 2   |    new_bp - 2
+---------------+
|    ....       |  low address

```

```c
else if (op == LEA)  {
    ax = (int)(bp + *pc++);  // 参数是caller 压栈的，所以要网上偏移
    // 但是文中好像没有对地址压栈的伪代码
}
```

### 运算符指令  
假设所有的运算符都是与`AX` 寄存器运算
```c
else if (op == OR)  ax = *sp++ | ax;
else if (op == XOR) ax = *sp++ ^ ax;
else if (op == AND) ax = *sp++ & ax;
else if (op == EQ)  ax = *sp++ == ax;
else if (op == NE)  ax = *sp++ != ax;
else if (op == LT)  ax = *sp++ < ax;
else if (op == LE)  ax = *sp++ <= ax;
else if (op == GT)  ax = *sp++ >  ax;
else if (op == GE)  ax = *sp++ >= ax;
else if (op == SHL) ax = *sp++ << ax;
else if (op == SHR) ax = *sp++ >> ax;
else if (op == ADD) ax = *sp++ + ax;
else if (op == SUB) ax = *sp++ - ax;
else if (op == MUL) ax = *sp++ * ax;
else if (op == DIV) ax = *sp++ / ax;
else if (op == MOD) ax = *sp++ % ax;

```

### 内置函数  

```c
else if (op == EXIT) { printf("exit(%d)", *sp); return *sp;}
else if (op == OPEN) { ax = open((char *)sp[1], sp[0]); }
else if (op == CLOS) { ax = close(*sp);}
else if (op == READ) { ax = read(sp[2], (char *)sp[1], *sp); }
else if (op == PRTF) { tmp = sp + pc[1]; ax = printf((char *)tmp[-1], tmp[-2], tmp[-3], tmp[-4], tmp[-5], tmp[-6]); }
else if (op == MALC) { ax = (int)malloc(*sp);}
else if (op == MSET) { ax = (int)memset((char *)sp[2], sp[1], *sp);}
else if (op == MCMP) { ax = memcmp((char *)sp[2], (char *)sp[1], *sp);}
```

### 错误判断  
```c
else {
    printf("unknown instruction:%d\n", op);
    return -1;
}
```


## 其他  

### 栈帧  

每次函数调用，都会在调用栈上维护一个独立的`Stack Frame`。每个栈帧一般包括：  
- 函数的参数  
- 函数的返回地址  
- 临时变量  
- 函数调用的上下文  

栈是逆生长的，一个函数的栈帧用`SP` 和`BP` 来划定范围。`BP` 指向栈帧的底部，`SP` 始终指向栈顶。  

栈帧大概长下面这样  

```
              +-----------------+
              |   Prev FP       |
              +-----------------+
              |   Local 1       |
              |     ...         |
+             |   Local M       |
| Frame of    +-----------------+  <----+
| caller      |   Param N       |   Higher
|             |     ...         |
|             |   Param 0       |
|             +-----------------+
+------------>+   Return addr   |
              +-----------------+
+----> FP  +->+   Prev FP       |
|             +-----------------+
|     (FP=SP) |   Local 1       |
|             |     ...         |
| Frame of    |   Local M       |
| callee      +-----------------+
|             |   Param K       |
|             |     ...         |
|             |   Param 0       |
|             +-----------------+   Lower
+----> SP  +->+   Return addr   |  <----+
              +-----------------+

```


## 总结  

1. 栈帧与调用栈  
2. `*pc++` 指令与立即数参数的巧妙用法



摘自：<https://lotabout.me/2015/write-a-C-interpreter-2/>  

参考：  
1. [《C函数调用过程原理及函数栈帧分析》](https://segmentfault.com/a/1190000007977460)

