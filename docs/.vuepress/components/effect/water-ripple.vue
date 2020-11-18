<template>
  <div ref="koto-ripple" class="koto-ripple" @click="play">
    <audio
      src="https://sharefs.yun.kugou.com/202011181540/4232ec3147667fedbef54f08c62a58e6/G127/M04/07/07/X5QEAFpej9CANidAA27sP178CCw928.mp3"
    ></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      interval: null,
      show: true,
    };
  },
  mounted() {
    $(".koto-ripple").ripples({
      resolution: 200,
      perturbance: 0.04,
      resolution: 128,
    });
    let width = $(".koto-ripple").width(),
      hight = $(".koto-ripple").width();
    this.interval = setInterval(() => {
      $(".koto-ripple").ripples(
        "drop",
        Math.random() * width,
        Math.random() * hight,
        18,
        0.03
      );
    }, 600);
  },
  methods: {
    play() {
      document.querySelector("audio").play();
    },
  },
  destroyed() {
    clearInterval(this.interval);
    this.interval = null;
  },
};
</script>

<style scoped>
.koto-ripple {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  background: url("./img/kotonowa.jpg") no-repeat center;
  /* 适应屏幕 */
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
}
</style>