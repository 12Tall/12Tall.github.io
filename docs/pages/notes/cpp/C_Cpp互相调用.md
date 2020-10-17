---
title: C 与 C++ 互相调用  
sidebar: auto  
tags:  
    - C  
    - C++  
    - call 
    - extern
--- 
# C 与 C++ 互相调用   
*因为`+` 在路由解析中有特殊含义，故后面用`cpp` 代替`c++`*
## Cpp 调用C  
在C++ 调用C 语言函数时，只需在C++ 声明C 函数时加上`extern "C" `关键字就行了，例如：  

#### 文件结构  
```txt
+ folder
    + c_code.c  
    + cpp_code.cpp  
    + makefile
```

#### C 代码  
一个简单的加法函数，接受两个整型参数，并返回它们的和  
```c 
// c_code.c
int add(int a, int b)
{
    return a + b;
}
```  

#### Cpp 代码  
调用C 函数`add(1,2)`，并打印函数结果    
```cpp {4}
// cpp_code.cpp
#include <iostream>

extern "C" int add(int a, int b);

int main()
{
    std::cout << add(1, 2) << std::endl;
    return 0;
}
```

#### makefile  
```makefile
build_c: c_code.c  
	gcc -c c_code.c  

build_cpp: build_c cpp_code.cpp  
	g++ cpp_code.cpp c_code.o
```

执行`make build_cpp` 后会在当前目录生成`a.out` 文件，执行`./a.out` 会看到输出结果`3`  


## C 调用Cpp  
如果想在C 语言中调用C++ 函数，则需要：  
1. 在C++ 文件中将函数声明添加`extern "C" `关键字  

### 非成员函数  
非成员函数的调用比较简单，只需在C++ 函数声明时添加`extern "C" ` 关键字即可，文件结构同[C++ 调用C](#cpp-调用c)

#### C 代码  
调用C++ 函数`sub(1,2)`，并打印函数结果  
```c 
// c_code.c
#include <stdio.h>

int sub(int, int);

int main()
{
    printf("%d\n", sub(1, 2));
    return 0;
}
```  

#### C++ 代码    
一个简单的减法函数，接受两个整型参数，并返回它们的差  
```cpp {2}
// cpp_code.cpp
extern "C" int sub(int a, int b)
{
    return a - b;
}
```

#### makefile  
```makefile
build_cpp: cpp_code.cpp  
	g++ -c cpp_code.cpp  

build_c: build_cpp c_code.c  
	gcc c_code.c  *.o
```

执行`make build_c` 后会在当前目录生成`a.out` 文件，执行`./a.out` 会看到输出结果`-1`  

### 成员函数   
因为C 语言没有对象的概念，所有成员函数都需要写成`method(Obj *, int param)` 这种形式才行。所以，如果想在C 语言中调用C++ 中的成员函数，则需要提供（手写）一个`wrapper`，将其转化为C 风格，文件结构同[C++ 调用C](#cpp-调用c)

#### C 代码  
调用C++ 对象 
```c 
// c_code.c
#include <stdio.h>

void *Create(int);
int GetAge(void *stu);

int main()
{
    void *stu = Create(13);
    printf("%d\n", GetAge(stu));
    return 0;
}
```  

#### C++ 代码    
一个简单的学生类，仅有一个Age 属性 
```cpp 
// cpp_code.cpp
#include <iostream>
using namespace std;

class Student
{
public:
    int _age;
    Student(int age);
    ~Student();
};

Student::Student(int age)
{
    this->_age = age;
    cout << "age: " << age << endl;
}

extern "C" void *Create(int age)
{
    return new Student(age);
}

extern "C" int GetAge(void *stu)
{
    return ((Student *)stu)->_age;
}
```

#### makefile  
`makefile` 稍微有些特殊，需要添加`-lstdc++` 标记，否则`gcc` 不能识别C++ 的语法，从而引发异常  
```makefile {5}
build_cpp: cpp_code.cpp  
	g++ -c cpp_code.cpp  

build_c: build_cpp c_code.c  
	gcc c_code.c  *.o -lstdc++
```


执行`make build_c` 后会在当前目录生成`a.out` 文件，执行`./a.out` 会看到输出结果  
`age: 13`  
`13`   


### 重载函数  
重载函数同成员函数没有区别，只是需要额外的字符来区分返回值或者参数，一般会用宏命令来自动生成，不多赘述。  

## 参考  
1. [Bjarne Stroustrup's C++ Style and Technique FAQ](https://stroustrup.com/bs_faq2.html#callCpp)  
2. [gcc compiling C++ code: undefined reference to 'operator new...'](https://stackoverflow.com/questions/27390078/gcc-compiling-c-code-undefined-reference-to-operator-newunsigned-long-lon)