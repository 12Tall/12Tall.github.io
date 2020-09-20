---
title: 🌼
---
 
<div class="koto">
<span>回望当初</span><br/> 
<span>那时我也一定一直在 训练自己迈步</span><br/> 
<span>如果有一天</span><br/> 
<span>能够走得更稳更远了</span><br/> 
<span>...</span><br/> 
<span>就去见她吧</span><br/>  
</div>

-----  

<div>
<transition-group name="list" tag="p">
<code key="first">第{{day}}天{{fix(hour)}}时{{fix(minute)}}分{{fix(seccond)}}秒<br/>
</code><code v-for="(el,i) in events" v-if="time>(i)" :key="'e'+i">{{el}}<br/></code>
</transition-group>  
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
      time:0,
      events:[],
      list:[        
        [`2020-07-31:  (｡･∀･)ﾉﾞ嗨`],
        [`2020-09-05:  青岛初见   `]
      ]
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
      if(self.time < self.list.length){
        self.events = self.list[self.time].concat(self.events);
        self.time++;
      }
    },500);
  }
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
</style>