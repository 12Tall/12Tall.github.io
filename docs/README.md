---
title: 🌼 100'
---
 
<audio id="bgm" src="http://aod.cos.tx.xmcdn.com/group19/M0B/49/C4/wKgJJlfvshmyBtfhABa3wlvQii4856.mp3" loop></audio>

<div v-if="show">
  <div class="main">
    <ul class="container">
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
      <li class="item"></li>
    </ul>
  </div>
  <div class="days">
    <span>D</span>
    <span>a</span>
    <span>y</span>
    <span> 💕 </span>
    <span>1</span>
    <span>0</span>
    <span>0</span>
  </div>
  <div class="text">
    <div class="content left" style="--i:1;">静女其姝，俟我于城隅</div>
    <div class="content left" style="--i:2;">爱而不见，搔首踟蹰</div>
    <div class="content right" style="--i:3;">——《诗经 · 邶风》</div>
    <div class="content" style="--i:4;"></div>
    <div class="content" style="--i:4;"> ✿ ❀ ✿ </div>
    <div class="content" style="--i:4;"></div>
    <div class="content" style="--i:5;">Hi 爱雨的女孩</div>
    <div class="content" style="--i:6;">我们已经认识100 天了呢</div>
    <div class="content" style="--i:7;">从 <i>你也喜欢雨天？</i> 开始</div>
    <div class="content" style="--i:8;">好想再多了解这位小可爱</div>
    <div class="content" style="--i:9;">有才，又帅气</div>
    <div class="content" style="--i:10;">文静，又调皮</div>
    <div class="content" style="--i:11;">笑起来超好看</div>
    <div class="content" style="--i:12;"></div>
    <div class="content" style="--i:12;"> ❀ ✿ ❀ </div>
    <div class="content" style="--i:12;"></div>
    <div class="content" style="--i:13;">My Love</div>
    <div class="content" style="--i:14;">You Make Me Feel Brand New</div>
    <div class="content" style="--i:15;">2020.11.08</div>
  </div>
</div>
<div style="text-align:center;" v-else="show" @click="play">
  <div>点我点我</div>
  <div>(●ˇ∀ˇ●)</div>
</div>


<style lang="stylus" scoped>
.main{
  padding-top: 10vh;
  display: flex;
  justify-content: center;
}

.container{
  position: relative;
  display: flex;
  height:180px;
  list-style-type:none;
}

.item {
  width: 20px;
  height:20px;
  border-radius: 10px;
  margin: 0 5px 0 5px;
}

.item:nth-child(1) {
  background-color: red ;
  animation: love1 5s 0.2s infinite;
}
.item:nth-child(2) {
  background-color: darkturquoise ;
  animation: love2 5s 0.4s infinite;
}
.item:nth-child(3) {
  background-color: darksalmon ;
  animation: love3 5s 0.6s infinite;
}
.item:nth-child(4) {
  background-color: deeppink ;
  animation: love4 5s 0.8s infinite;
}
.item:nth-child(5) {
  background-color: yellowgreen ;
  animation: love5 5s 1s infinite;
}
.item:nth-child(6) {
  background-color: deeppink ;
  animation: love4 5s 1.2s infinite;
}
.item:nth-child(7) {
  background-color: darksalmon ;
  animation: love3 5s 1.4s infinite;
}
.item:nth-child(8) {
  background-color: darkturquoise ;
  animation: love2 5s 1.6s infinite;
}
.item:nth-child(9) {
  background-color: red ;
  animation: love1 5s 1.6s infinite;
}

@keyframes love1{
  30%,50%{
    height:60px;
    transform: translateY(-30px);
  }
  70%,100%{
    height:20px;
    transform: translateY(0);
  }
}
@keyframes love2{
  30%,50%{
    height:125px;
    transform: translateY(-60px);
  }
  70%,100%{
    height:20px;
    transform: translateY(0);
  }
}
@keyframes love3{
  30%,50%{
    height:160px;
    transform: translateY(-75px);
  }
  70%,100%{
    height:20px;
    transform: translateY(0);
  }
}
@keyframes love4{
  30%,50%{
    height:180px;
    transform: translateY(-60px);
  }
  70%,100%{
    height:20px;
    transform: translateY(0);
  }
}
@keyframes love5{
  30%,50%{
    height:200px;
    transform: translateY(-40px);
  }
  70%,100%{
    height:20px;
    transform: translateY(0);
  }
}


.days{
  display:flex;
  justify-content: center;
  font-size: 24px;
  font-weight: bolder;
  font-family: "Comic Sans MS", cursive, sans-serif;
  color: #F67CD3;
}

.text {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  margin-top:10px;
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 16px;  
}

.content {
  opacity:0;
  width: 300px;
  text-align:center;
  margin: 5px 5px 5px 5px;
  animation: show-content 3s calc(1s * var(--i)) 1;
  animation-fill-mode:forwards;
  color:#1F6E3C;
}

.content.left {
  width: 160px;
  text-align:left;
  color: #9581DE;
}

.content.right {
  text-align:right;
  color: #9581DE;
}



@keyframes show-content{
  0%{
    opacity:0;
  }
  100%{
    opacity:1;
  }
}

</style>

<script>
export default{
  data(){
    return {
      bgm:null,
      show:false,
    }
  },
  methods:{    
    play(){
      this.bgm =  document.getElementById('bgm');
      this.show=true;
      this.bgm.play();
    }
  },
  mounted(){
  },    
  destroyed () {
  }, 
}
</script>