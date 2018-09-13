<template> <div id="wrapper">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <div><button id="snap" v-on:click="capture()">Snap Photo</button></div>
      <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        video: {},
        canvas: {},
        captures: {},
      };
    },
    mounted() {
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            this.video.src = window.URL.createObjectURL(stream);
            this.video.play();
          });
      }
      this.intervalId = setInterval(() => {
        this.canvas = this.$refs.canvas;
        this.canvas
          .getContext('2d')
          .drawImage(
            this.video,
            0, 0, 640, 480,
          );
      }, 100);
    },
    methods: {},
  };
</script>

<style>
#video {
  display: none;
}
</style>
