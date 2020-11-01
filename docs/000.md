---
title: 🌼
---
 
<div>
<p class="timer" key="first">{{day}} {{fix(hour)}}:{{fix(minute)}}:{{fix(seccond)}}
</p>
</div>

`2020-09-05:  青岛初见`  
`2020-07-31:  (｡･∀･)ﾉﾞ嗨`  

-----

<div class="koto">
<span>回望当初</span><br/> 
<span>那时我也一定一直在 训练自己迈步</span><br/> 
<span>如果有一天</span><br/> 
<span>能够走得更稳更远了</span><br/> 
<span>...</span><br/> 
<span>就去见她吧</span><br/>  
</div>
    
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

<style lang="stylus" scoped>
.koto{
  background: linear-gradient(to  bottom, #7EE641,#042502);
  -webkit-background-clip: text;
  color: transparent;
}

.slide-fade-enter-active {
  transition: all 1.5s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
/* latin */
@font-face {
  font-family: 'Cabin Sketch';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local('Cabin Sketch Bold'), local('CabinSketch-Bold'), url(https://fonts.gstatic.com/s/cabinsketch/v14/QGY2z_kZZAGCONcK2A4bGOj0I_1Y5tjz.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
.timer{
  display:inline-block
  font-size: 60px;
  margin:0;
  /* latin */
	font-family:'Cabin Sketch';
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #B2101D, #B2101D, #FAA04A, #FAA04A, #628AD1, #628AD1, #FAA04A, #FAA04A, #B2101D, #B2101D); /* 标准的语法（必须放在最后） */

}
</style>