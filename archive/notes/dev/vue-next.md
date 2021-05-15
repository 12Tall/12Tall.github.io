---
title: vue-next  
sidebar: auto  
tags:  
    - vue  
    - vue3  
    - reactivity  
---   
# vue-next  
## Reactivity  
响应性基础  
### 需求  
假设有变量`a`、`b`，要求`b` 总是等于`a*10`  
```js
let a =3;
let b = a * 10;  

console.log(b);  // 需要有一种方法来保证b 与a 同步更新

// 1. 要给a 添加一个update 事件
// 2. 在a update 时，自动执行一个匿名函数anonymous function  
onAChanged(()=>{  // on A Change, 为a 的update 注册一个事件处理器
    b = a* 10;
})

// 3. 原理实现  
let update;  // 事件处理器  
const onStateChanged = _update => {  // 注册新的事件处理器
    update = _update;
}
const setState = newState => {  // 重写state 变量(a) 的setter 方法  
    state = newState;
    update();
}

// 4. Proxy 核心  
// vue 中会将对象转化为响应性的. ES5 中利用defineProperty、ES6 中理由Proxy  
function reactive(data){
    if( typeof data !== 'object' || data === null){
        return data;
    }

    // 利用Proxy 在对象外层添加拦截器
    const observed = new Proxy(data, {
        get(target, key, receiver){
            console.log(`获取${key}：${Reflect.get(target, key, receiver)}`);
            // 1. 利用函数式获取对象默认内部属性
            // 2. Reflect 与Proxy 的方法具有一一对应的关系  

            const val = Reflect.get(target, key, receiver);

            // 递归地添加拦截器
            return typeof val === 'object' ? reactive(val) : val;
        },

        set(target, key, value, receiver){
            console.log(`设置${key}：${value}`);
            return Reflect.set(target, key, value, receiver);
        },

        deleteProperty(target, key){
            console.log(`删除${key}`);
            return Reflect.deleteProperty(target, key, value, receiver);
        }

    });

    return observed;
}

```  

## 参考资料  
1. [【开课吧哩堂】vue3.0学习之道-03 数据响应式革新-Yang村长](https://www.bilibili.com/video/BV1Ut4y127qu)
2. [ECMAScript 6 入门 -- Proxy](https://es6.ruanyifeng.com/#docs/proxy)
3. [ECMAScript 6 入门 -- Reflect](https://es6.ruanyifeng.com/#docs/reflect)