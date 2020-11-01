---
title: 🌼
---

<div>
  <oscilloscope-01/>
</div>


这个示例是通过`setInterval` 定时器触发的，略显卡顿，感觉并不如`window.requestAnimationFrame()` 流畅，而且是通过改变相位`phi` 来使画面动起来，有点类似于普通的示波器，但是没有达到通过改变`t` 的值来生成动画。

PS: 连续改变周期`w` 会有好玩的现象发生哦。


-----

<center>
<p class="timer" key="first">Day{{day}} {{fix(hour)}}:{{fix(minute)}}:{{fix(seccond)}}
</p>
</center>


<script>
export default{
  data(){
    return {
      start:new Date('2020/07/31 16:46:00').getTime(),
      day:0,
      hour:0,
      minute:0,
      seccond:0,
      interval:null,
    }
  },
  methods:{
    timediff(){
      let self = this;
      let now = new Date().getTime(),
        leave =  Math.floor((now-self.start)/1000);
      self.day = Math.floor(leave/86400);
      leave = leave%(86400);
      self.hour = Math.floor(leave/3600);
      leave = leave%(3600);
      self.minute = Math.floor(leave/60);
      leave = leave%(60);
      self.seccond = leave;
      self.show = true;
    },
    fix(val){
      return (Array(2).join(0)+val).slice(-2);
    }
  },

  mounted(){
    let self = this;
    self.timediff();
    this.interval = setInterval(()=>{
      self.timediff();
    },500);
  },    
  destroyed: function () {
    clearInterval(this.interval);
  }, 
}
</script>