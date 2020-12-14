---
title: canvas
sidebar: auto
tags:  
    - canvas
---  

# Canvas  
`Canvas` 主要用于绘制`2D` 图形，而`WebGL` 可以用来绘制硬件加速的`2D` 和`3D` 的图形。  

所有内容摘自：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)

## 基础示例  
### 代码
```html
<canvas id="canvas"></canvas>

<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // 在md 中，jtml 标签内代码不要有空白行
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150, 100);
</script>
```  

## 绘图基础  
- Canvas 只有`width` 和`height` 两个属性  
- 默认大小是`300pix x 150pix`  
- 最好不要通过`CSS` 来设置Canvas 的大小，否则图像可能会出现扭曲  
- 替换内容`<canvas>该浏览器不支持canvas 元素</canvas>`，也可使一张图片或其他DOM 元素  
- `</canvas>` 结束标签不可省略  
  
### 渲染上下文  
- Canvas 默认是空白的，可以通过`getContext()` 来获取一个渲染上下文  
  - 默认参数：`getContext('2d')`  
  - `2d` 
  - `webgl` 创建三维渲染上下文对象  
  - `bitmaprenderer`  


#### 线型  
- `.lineWidth` 1.0     
- `.lineCap` 线末端的类型
  - `butt` (默认)
  - `round`
  - `square`      
- `lineJoin` 交点样式  
  - `miter` (默认)    
  - `round`     
  - `bevel`     
- `miterLimit` 斜面限制比例，默认10     
- `.getLineDash()`      
- `.setLineDash()`   
  - 虚线长度和间距的数组，会被不断重复  
  - 如果该数组有奇数个元素，则会自动复制成两倍长度
- `.lineDashOffset` 偏移量，以Dash 数组为参考    

#### 文本  
- `.font` 字体
- `.textAlign` 对齐方式  
  - `start` (默认)
  - `end`
  - `left`
  - `right`
  - `center` 一般在`x` 左边，一遍再`x` 右边
- `.textBaseline` 基线对齐设置
  - `alphabetic`(默认)
  - `top`
  - `hanging`
  - `middle`
  - `ideographic`
  - `bottom`
- `.direction` 文本方向  
  - `ltr`  
  - `rtl`  
  - `inherit` (默认)  

#### 描边和填充  
- `.strokeStyle`
  - `color` 颜色  
  - `gradient` 渐变  
  - `pattern` 可重复图像
- `.fillStyle` 同上  

#### 渐变和图案  
- `.createLinearGradient(st_x, st_y, ed_x, en_y)` 线性渐变  
  - `addColorStop(percent, color)` 设置渐变点
- `.createRadialGradient(x0, y0, r0, x1, y1, r1)` 放射性渐变  
- `.createPattern()`

#### 阴影  
- `.shadowBlur` 模糊程度，默认为0，可以设置为任何合法数值
- `.shadowColor`
- `.shadowOffsetX`
- `.shadowOffsetY`

### 绘图  
#### 绘制矩形  
- `.clearRect(x, y, width, height)` 清空一个矩形区域
- `.fillRect(x, y, width, height)` 填充
- `.strokeRect(x, y, width, height)` 描边  

#### 绘制文本  
- `.fillText(text, x, y [, maxWidth])`  
  - 使用当前的`font`, `textAlign`, `textBaseline` 和 `direction` 值对文本进行渲染  
- `.strokeText(text, x, y [, maxWidth])`  
- `.measureText()` 返回一个被测量文本的信息，如宽度等

#### 路径
- `.beginPath()` 清空子路径列表开始一个新的路径。
- `.closePath()` 使笔点返回到当前子路径的起始点。
- `.moveTo(x, y)` 将一个新的子路径的起始点移动到(x，y)坐标。
- `.lineTo(x, y)` 使用直线连接子路径的最后的点到x,y坐标。
- `.bezierCurveTo()` 添加一个3次贝赛尔曲线路径。
  - 该方法需要三个点。第一、第二个点是控制点，第三个点是结束点。
- `.quadraticCurveTo()` 添加一个2次贝赛尔曲线路径。
- `.arc(x, y, radius, startAngle, endAngle, anticlockwise)` 绘制一段圆弧路径（默认为顺时针）
- `.arcTo(x1, y1, x2, y2, radius)` 两个切线之间的弧，很奇怪
- `.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)` 椭圆
- `.rect(x, y, width, height)` 矩形  
- `.fill()`
- `.stroke()`
- `.drawFocusIfNeeded()` 奇怪
- `.scrollPathIntoView()` 奇怪
- `.clip()` 奇怪
- `.isPointInPath()` 判断当前路径是否包含检测点 
- `.isPointInStroke()` 判断检测点是否在路径的描边线上  

#### 图像  
- `.drawImage()` 绘制指定的图片

### 变换  
- `.currentTransform` 当前的变换矩阵
- `.rotate()` 旋转  
- `.scale()` 缩放
- `.translate()` 平移  
- `.transform()` 参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/transform)
- `.setTransform()` 重新设置当前的变换为单位矩阵
- `.resetTransform()` 使用单位矩阵重新设置当前的变换

### 合成  
- `.globalAlpha` 在合成到 canvas 之前，设置图形和图像透明度的值。默认 1.0 (不透明)  
- `.globalCompositeOperation` 通过 globalAlpha 应用，设置如何在已经存在的位图上绘制图形和图像

### 像素控制
参见[ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)  

### 图片平滑  
- `.imageSmoothingEnabled`  

### Canvas 状态  
Canvas 的状态以栈的形式存储
- `.save()`
- `.restore()`
- `.canvas` 对DOM 元素只读的反向引用  


## 示例  
```html
<canvas style="border:1px solid;" id="canvas_demo" width="640" height="400">您的浏览器不支持Canvas</canvas>


<div>
  <oscilloscope-01/>
</div>


这个示例是通过`setInterval` 定时器触发的，略显卡顿，感觉并不如`window.requestAnimationFrame()` 流畅，而且是通过改变相位`phi` 来使画面动起来，有点类似于普通的示波器，但是没有达到通过改变`t` 的值来生成动画。

PS: 连续改变周期`w` 会有好玩的现象发生哦。

<script>
export default{
    data(){
        return {
            demo: null, 
            ctx_demo: null,
            interval: null,
            row:64,
            col:32,
            mem:null
        }
    },
    mounted(){
        this.demo = document.getElementById('canvas_demo');
        this.ctx_demo = canvas_demo.getContext('2d');
        this.ctx_demo.font="20px monospace";
        this.ctx_demo.textAlign = 'center';
        this.ctx_demo.fillText('Hello World!', 300, 50);  
        this.ctx_demo.moveTo(0,79); 
        this.ctx_demo.lineTo(640,79); 
        this.ctx_demo.stroke(); 
        // 用于模拟显存，记录每个像素块的当前状态
        this.mem=new Uint8Array(this.row*this.col);
        // 每100ms 随机反转一个像素块
        this.interval = setInterval(()=>{
            var row = Math.floor(Math.random()*64),
            col = Math.floor(Math.random()*32);
            this.TryPixel(row,col)
        },10);
    },
    methods:{
        // 尝试设置反转一个像素块
        TryPixel(_x,_y){
            var x = (_x % this.row)*10,
                y = (_y % this.col)*10 + 80,
                index = _x*64+_y;
            this.mem[index] = !this.mem[index];
            if(this.mem[index]){
                this.ctx_demo.fillRect(x,y,10,10);
            }else{
                this.ctx_demo.clearRect(x,y,10,10);
            }
        }  
    },
    destroyed: function () {
        clearInterval(this.interval);
    } 
}
</script>
```

<div>
<canvas style="border:1px solid;" id="canvas_demo" width="640" height="400">您的浏览器不支持Canvas</canvas>

<script>
export default{
    data(){
        return {
            demo: null, 
            ctx_demo: null,
            interval: null,
            row:64,
            col:32,
            mem:null
        }
    },
    mounted(){
        this.demo = document.getElementById('canvas_demo');
        this.ctx_demo = canvas_demo.getContext('2d');
        this.ctx_demo.font="20px monospace";
        this.ctx_demo.textAlign = 'center';
        this.ctx_demo.fillText('Hello World!', 300, 50);  
        this.ctx_demo.moveTo(0,79); 
        this.ctx_demo.lineTo(640,79); 
        this.ctx_demo.stroke(); 
        this.mem=new Array(this.row*this.col);
        this.interval = setInterval(()=>{
            var row = Math.floor(Math.random()*64),
            col = Math.floor(Math.random()*32);
            this.TryPixel(row,col)
        },10);
    },
    methods:{
        TryPixel(_x,_y){
            var x = (_x % this.row)*10,
                y = (_y % this.col)*10 + 80,
                index = _x*64+_y;
            this.mem[index] = !this.mem[index];
            if(this.mem[index]){
                this.ctx_demo.fillRect(x,y,10,10);
            }else{
                this.ctx_demo.clearRect(x,y,10,10);
            }
        }   
    },
    destroyed: function () {
        clearInterval(this.interval);
    } 
}
</script>
</div>


## 参考资料  
1. [Canvas-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)  
2. [Canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)  
3. [CanvasRenderingContext2D](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D)
