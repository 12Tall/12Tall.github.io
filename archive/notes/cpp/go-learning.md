---
title: Golang 学习  
sidebar: auto  
---   


# Golang 学习
Golang 学习  
- 尝试封装一些WIN32 api  
- 学习一些常用框架  
  - macaron  
  - xorm  


## 从面向对象的角度理解  
Golang 中没有类，可以以结构来完成面向对象的绝大多数功能。
Golang 中没有继承，子类与父类的关系更像是包含与被包含，属于一对多的关系。一个子类可以有许多父类做属性。同时，Golang 好像舍弃了`this` 指针，成员方法的定义看起来更像是C 风格。  
面向对象的示例均以`Student` 类来说明：  
```go
package oo

// Student 学生结构体
type Student struct {
	name string // goulang 在定义结构体的时候好像不能赋初值
	// Tag 标签在反射时有用，比如Json 序列化/反序列化等
	Age  int `key1:"value1" key2:"value2" key3:"value3"`
}
```  

### 初始化  
Golang 中初始化结构的方法有很多，但无外乎两类：  
```go
// 返回结构本身  
type stu1 oo.Student  
stu2 := oo.Student{Age:1}  

// 返回结构的指针  
stu3 := new(oo.Student)
stu4 := &oo.Student{Age:1}

// 需要注意的是，结构中小写的属性不能在初始化时赋值
```

### Get-Set 方法  
Golang 中默认以首字母大写导出属性即可。如果必须使用Get/Set 方法则可以采用导出公开方法的形式实现：  
```go
// Name Get() 方法
func (stu *Student) Name() string {
	return stu.name
}

// SetName 一般直接将属性首字母大写导出就行了
func (stu *Student) SetName(name string) {
	stu.name = name
}
```

### 实例方法  
对于实例方法的定义分为`值接收`和`引用接收`两种，主要区别：值接收的方法传入的参数是结构的一个副本；引用接收传入的是结构的指针。在引用接收中修改结构会反映到结构本身
```go
// Update 值接收
func (stu Student) UpdateAge() {
	stu.Age++
}
// stu.UpdateAge() 不会改变stu 中Age 的值

// Update2 引用接收
func (stu *Student) UpdateAge2() {
	stu.Age++
}
// stu.UpdateAge2() 会改变stu 中Age 的值
```

### 静态方法  
Golang 本身不支持静态方法。就用普通的函数来代替就好了  

### 重载与可变参数  
同样的，Golang 本身也不支持方法的重载，不过可以定义可变参数的函数  
```go
func fun1(argv ...int){
    // argv 可以看作一个切片
}

// 也可以使用...将切片当作可变参数传入  
num := []int{1,2}
fun1(num...)
```
下面截取一段`macaron` 的`重载`的实现。可以看到，这个世界上压根就不存在重载，而是利用反射去手动匹配不同的方法。  
```go
// validateAndWrapHandler makes sure a handler is a callable function, it panics if not.
// When the handler is also potential to be any built-in inject.FastInvoker,
// it wraps the handler automatically to have some performance gain.
func validateAndWrapHandler(h Handler) Handler {
	// 如果参数不是函数类型，直接报异常
	if reflect.TypeOf(h).Kind() != reflect.Func {
		panic("Macaron handler must be a callable function")
	}

	// 如果函数不是inject.FastInvoker 类型，
	// 则会分别去匹配预设的类型
	// 并封装为 inject.FastInvoker 封装
	if !inject.IsFastInvoker(h) {
		// golang中x.(type)只能在switch中使用
		// 且要求参数必须为interface{}
		switch v := h.(type) {  
		case func(*Context):  // 参见后面的实现
			return ContextInvoker(v)
		case func(*Context, *log.Logger):
			return LoggerInvoker(v)
		case func(http.ResponseWriter, *http.Request):
			return handlerFuncInvoker(v)
		case func(http.ResponseWriter, error):
			return internalServerErrorInvoker(v)
		}
	}
	return h
}
// 下面是一种包装的实现
// 定义函数类型
// ContextInvoker is an inject.FastInvoker wrapper of func(ctx *Context).
type ContextInvoker func(ctx *Context)  

// 函数的方法...
// Invoke implements inject.FastInvoker which simplifies calls of `func(ctx *Context)` function.
func (invoke ContextInvoker) Invoke(params []interface{}) ([]reflect.Value, error) {
	invoke(params[0].(*Context))
	return nil, nil
}
```

### 匿名函数与闭包  
顾名思义匿名函数没有函数名，但是计算机底层也不是通过函数名来调用函数的，而是通过函数指针。闭包属于一种函数的高级用法，最常见的是将匿名函数作为函数的返回值：  
```go 
// TimesX 定义闭包，注意返回值要严格一致
func TimesX(x int) func(int) int {
	n := x  // 局部变量

	f := func(i int) int {
		return n * i
	}
	return f
}

// 可以看作是新生成一个函数
f := TimesX(2)
fmt.Printf("%d\n", f(2))

// 直到f 被释放掉，整个闭包（包括其中的变量）才会被释放
```


### 函数包装  
可以通过`type` 关键字定义函数类型，并且也可以通过将函数当成普通变量一样进行类型转换  
我们甚至可以为函数指定方法，这也是在看`macaron` 时看到的特性。这就很像`Javascript` 里面的原型了，或者是`函数是一等公民`？  
```go
package main
// ... 此处省略引用包的操作
func main() {

	Invoke := func() {
		log.Println("Hello World!")
	}
	// 函数类型转换（包装）
	// 函数类型转换，这样就可以为函数添加更多的属性
	f := Fun(Invoke)
	// 调用函数的Invoke 方法
	f.Invoke(2)
	// 调用函数自身
	f()
}

// Fun 定义函数类型
type Fun func()

// Invoke 函数的方法...
func (f Fun) Invoke(i int) {
	log.Printf("Invoke: %d\n", i)
}
```  

### 反射与泛型  
Golang 中可以通过`reflect.TypeOf()` 方法来获取参数的类型。而对于Golang 中的类型判断，则更像是`鸭子类型`。基本上所有的结构与空接口判断都会返回`true`

```go
type People interface {}

stu := oo.Student{}
s := reflect.TypeOf(stu)
_, ok := s.(People)
log.Println(ok)  // 返回true  
```  
同时，在使用Golang 模拟函数重载时，还有一个小技巧  
```go
// arg.(type) 只能用在switch 后面  
// 且要求形参类型需要时interface{}
func MultiPrint(arg interface{}) {
	switch v := arg.(type) {
	case int:
		log.Printf("int: %d", v)
	case float32:
		log.Printf("float32: %f", v)
	case string:
		log.Printf("string: %s", v)
	default:
		log.Printf("%+v", v)
	}
}
```  

### ### interface{} 做形参  
`interface{}` 可以作为`Any` 或者是`Object` 类型在Golang 中使用。也可以用来作为函数的形参。  
```go
// 调用时可以传入指针，也可以传入值 
// Test 测试
func Test(stu interface{}) {
	// 类型断言，虽然可以接收指针和值类型，但是这里只识别指针类型
	s := stu.(*Stu)
	s.Name = "12tall"
	fmt.Printf("stu.(*Stu): %+v\n", s)
}

// Test2 测试
func Test2(stu interface{}) {
	// 类型断言，虽然可以接收指针和值类型，但是这里只识别值类型
	s := stu.(Stu)
	s.Name = "12tall"
	fmt.Printf("stu.(Stu): %+v\n", s)
} 

// 但是如果如下定义  
// 则任何参数都会出错
// Test3 测试
func Test3(stu *interface{}) {
	fmt.Printf("%+v", stu)
}

```


