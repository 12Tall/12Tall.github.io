---
title: AudioContext  
sidebar: auto  
---  

## AudioContext  

继承自`BaseAudioContext`。由若干个`AudioNode` 连接在一起表示。可以对多个不同的音频源和管道使用同一个`AudioContext` 对象    
```
+-----------+     +------------+
|EventTarget| <-- |AudioContext|
+-----------+     +------------+
```

### 构造函数  
- `AudioContext()`  

### 属性  
- `AudioContext.baseLatency` 将音频从`AudioDestinationNode` 传递到音频子系统的处理延迟的秒数  
- `AudioContext.outputLatency` 返回对当前音频上下文的预估输出延迟  

### 方法  
- 音频源：创建`MediaElementAudioSourceNode` 元素来关联音频源  
  - `AudioContext.createMediaElementSource()` 关联HTML 元素，如`<video>` 和`<audio>`  
  - `AudioContext.createMediaStreamSource()` 关联设备输入，或者其他`MediaStream`
- `AudioContext.createMediaStreamDestination()` 输出目标。
- `AudioContext.createMediaStreamTrackSource()` 
- `AudioContext.getOutputTimestamp()`
- 控制方法  
  - `AudioContext.resume()` 继续
  - `AudioContext.suspend()` 暂停
  - `AudioContext.close()` 关闭上下文  
- 父类方法  
  - `BaseAudioContext.createOscillator()` 创建一个音频发生器`OscillatorNode` 节点



## OscillatorNode  

### 构造函数  
- `OscillatorNode()`  

### 属性  
- `OscillatorNode.frequency` 频率，默认`440 Hz`，中A音高  
- `OscillatorNode.detune` 音高微调，默认`0 cent` 音分  
- `OscillatorNode.type` 波形，默认为`sine`  
  - `sine`  
  - `square`  
  - `sawtooth`  
  - `triangle`  
  - `custom`  

### 方法  
- `OscillatorNode.setPeriodicWave()` 设置自定义波形  
- 父类方法：延时n 秒停止/开始，默认立即执行  
  - `start(ns)` 开始  
  - `stop(ns)` 停止

## 示例代码  

### 波形发生器  

<div> 
<br/>
<button @click="oscillator.resume()">播放</button>
<button @click="oscillator.suspend()">停止</button>
</div>

```js
var audioCtx =new (window.AudioContext || window.webkitAudioContext)(),
oscillator = audioCtx.createOscillator();
oscillator.type = 'triangle';
oscillator.frequency.value = 800;
oscillator.start();
var osc_int = setInterval(()=>{
    oscillator.connect(audioCtx.destination);   
    setTimeout(function(){ 
        oscillator.disconnect();
    }, 100);    
},1800);
```

<script>
export default {
    data(){
        return {
            oscillator: null,
            osc_int:null
        }
    },
    methods:{
        initOscillator(){
            var audioCtx = this.oscillator =new (window.AudioContext || window.webkitAudioContext)(),
                oscillator = audioCtx.createOscillator();
            audioCtx.suspend();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 800;
            oscillator.start();
            this.osc_int = setInterval(()=>{
                oscillator.connect(audioCtx.destination);   
                setTimeout(function(){ 
                    oscillator.disconnect();
                }, 100);    
            },1800);
        }

    },
    mounted(){
        this.initOscillator();        
    }, 
    destroyed: function () {
           this.oscillator.close();
           this.oscillator=null;
           clearInterval(this.osc_int);
    }, 
}
</script>