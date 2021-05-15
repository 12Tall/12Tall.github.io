<template>
  <div>
    <div class="leaves">
      <span>🌧🌧🌧</span><br />
      <span>回望当初</span><br />
      <span>那时我也一定一直在</span><br />
      <span>训练自己迈步</span><br />
      <span>如果有一天</span><br />
      <span>能够走得更稳更远了</span><br />
      <span>...</span><br />
      <span>就去见她吧</span><br />
    </div>
    <div class="flower">
      {{ day }} ❀ {{ fix(hour) }}:{{ fix(minute) }}:{{ fix(seccond) }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      start: new Date("2020/07/31 16:46:00").getTime(),
      day: 0,
      hour: 0,
      minute: 0,
      seccond: 0,
      interval: null,
    };
  },
  methods: {
    timediff() {
      let self = this;
      let now = new Date().getTime(),
        leave = Math.floor((now - self.start) / 1000);
      self.day = Math.floor(leave / 86400);
      leave = leave % 86400;
      self.hour = Math.floor(leave / 3600);
      leave = leave % 3600;
      self.minute = Math.floor(leave / 60);
      leave = leave % 60;
      self.seccond = leave;
      self.show = true;
    },
    fix(val) {
      return (Array(2).join(0) + val).slice(-2);
    },
  },

  mounted() {
    let self = this;
    self.timediff();
    this.interval = setInterval(() => {
      self.timediff();
    }, 500);
  },
  destroyed: function () {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.leaves {
  display: inline-block;
  background: linear-gradient(150deg, #7ee641, #042502);
  -webkit-background-clip: text;
  color: transparent;
}

.flower {
  padding-top: 10px;
  font-family: "Comic Sans MS", Arial, Helvetica, cursive, sans-serif;
  color: #f67cd3;
}
</style>