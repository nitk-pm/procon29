<template> <div id="wrapper">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <div id="container">
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
        <md-button class='md-raised md-primary' v-bind:disabled="cannot_launch">Launch!</md-button>
      </div>
    </div>
  </div>
</template>

<script>
  import jsQR from 'jsqr';
  export default {
    name: 'app',
    data() {
      return {
        cannot_launch: true,
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
        const imageData = this.canvas.getContext('2d').getImageData(0, 0, 640, 480);
        const qr = jsQR(imageData.data, 640, 480);
        if (qr) {
          this.cannot_launch = false;
          console.log(qr);
        }
      }, 100);
    },
    methods: {},
  };
</script>

<style>
#video {
  display: none;
}
#container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 5%;
}
</style>
