<template>
  <div>
    <div class="flex-center title">简单的正弦波</div>
    <div class="flex-center main">
      <canvas class="canvas" width="400px" height="240px"></canvas>
    </div>

    <div class="equation">
      y =
      <input class="val" v-model="A" />* sin
      <input
        type="number"
        class="val"
        v-model="w"
      />t<!-- + <input class="val" v-model="phi" /> -->+
      <input class="val" v-model="k" />
      <!-- <input type="button" @click="draw" value="重绘" /> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      interval: null,
      A: 1,
      w: 1,
      phi: 0,
      k: 0,
    };
  },
  methods: {
    draw() {
      var canvas = (this.canvas = document.querySelector("canvas"));
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 400, 240);
      ctx.beginPath();
      ctx.moveTo(
        0,
        120 - this.k - this.A * 20 * Math.sin(this.w * 0 + this.phi)
      );
      for (var i = 0; i < 400; i++) {
        ctx.lineTo(
          i,
          120 -
            this.k -
            this.A * 20 * Math.sin((this.w * i) / 10 + parseFloat(this.phi))
        );
      }
      ctx.stroke();
    },
  },
  mounted() {
    var self = this;
    this.interval = setInterval(() => {
      self.phi++;
      self.draw();
    }, 120);
  },
};
</script>

<style lang="stylus" scoped>
.equation {
  text-align: center;
}

.val {
  width: 30px;
  border: none;
  background-color: gray;
  text-align: center;
}

.title {
  font-size: 24px;
}

.main {
  padding-top: 20px;
}

.canvas {
  border: 1px solid #333;
}

.flex-center {
  display: flex;
  justify-content: center;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>