<template>
  <div class="snow-container">
    <div class="snow foreground"></div>
    <div class="snow foreground layered"></div>
    <div class="snow middleground"></div>
    <div class="snow middleground layered"></div>
    <div class="snow background"></div>
    <div class="snow background layered"></div>
    <div class="snow"></div>
  </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    mounted(){
        console.log("源码链接：https://www.jq22.com/code85")
    }
};
</script>

<style>
.snow-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  z-index: 2;
  pointer-events: none;
  background-color: red;
}

.snow {
  display: block;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  pointer-events: none;
  transform: translate3d(0, -100%, 0);
  animation: snow linear infinite;
}
.snow.foreground {
  background-image: url("https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-large-075d267ecbc42e3564c8ed43516dd557.png");
  animation-duration: 15s;
}
.snow.foreground.layered {
  animation-delay: 7.5s;
}
.snow.middleground {
  background-image: url(https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-medium-0b8a5e0732315b68e1f54185be7a1ad9.png);
  animation-duration: 20s;
}
.snow.middleground.layered {
  animation-delay: 10s;
}

.snow.background {
  background-image: url(https://dl6rt3mwcjzxg.cloudfront.net/assets/snow/snow-small-1ecd03b1fce08c24e064ff8c0a72c519.png);
  animation-duration: 30s;
}
.snow.background.layered {
  animation-delay: 15s;
}

@keyframes snow {
  0% {
    transform: translate3d(0, -100%, 0);
  }
  100% {
    transform: translate3d(15%, 100%, 0);
  }
}
</style>