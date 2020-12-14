---
title: 在网页中加载文件  
sidebar: auto  
tags:  
    - load  
    - file  
    - js  
    - html  
    - event 
    - blob
---
# 在网页中加载文件  
## 获取文件  
1. Change 事件   
   - 通过`<input type="file">` 标签的`onchange(event)` 方法  
   - 通过`.addEventListener("change",(event)=>{})` 方法  
   - 可以通过`elem.click()` 来模拟调用`<input type="file">` 的单击事件  
2. 文件信息：`File` 对象（继承了`Blob`）
   - `lastModified`  
   - `lastModifiedDate`  
   - `name`  
   - `size` 字节  
   - `webkitRelativePath `  
   - `type` MIME Type  
   - `.slice()` 从`Blob` 继承的方法 
   - 事件处理函数的`this` 会包含一个`files` 属性   
3. 拖放  
   1. 创建一个拖放区域  
   2. 添加事件处理  
      - `dragenter`  
      - `dragover`  
      - `drop` 真正重要的事件  
   3. 获取文件`drop(event)`。文件存在于`event.dataTransfer.files`  
   4. 利用`window.URL.createObjectURL(file)` 生成可以被直接引用的url(`base64`)
   
## FileReader  
### 事件  
- 构造函数：`var reader = new FileReader();`  
- `.onabort`
- `.onerror`
- `.onload` 加载完成时  
- `.onloadstart` 开始加载时
- `.onloadend` 读取结束（包括失败）
- `.onprogress` 读取时，可用来获取进度？

### 属性
- `error` 发生错误  
- `readyState`  
  - `EMPTY 0`
  - `LOADING 1`
  - `DONE 2`  
- `result` 文件内容  

### 方法  
- `.abort()`
- `.readAsArrayBuffer()` byte array
- `.readAsBinaryString()` 已废除
- `.readAsDataURL()` Base64  
- `.readAsText()` 以字符串读取  

### 示例  
打印文件中的文本
```js
function printFile(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    console.log(e.target.result);
  };
  reader.readAsText(file);
}
```

## 参考  
1. [在web应用程序中使用文件](https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications)  
2. [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)  
3. [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)