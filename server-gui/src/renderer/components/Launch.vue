<template> <div id="wrapper">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <div id="container">
        <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
        <md-button class='md-raised md-primary' v-bind:disabled="cannot_launch" @click='launch()'>Launch!</md-button>
        <md-field>
          <label>turn</label>
          <md-input v-model="turn" type="number"></md-input>
        </md-field>
        <md-radio v-model="color" value="Red">Red</md-radio>
        <md-radio v-model="color" value="Blue" class="md-primary">Blue</md-radio>
      </div>
    </div>
  </div>
</template>

<script>
  import jsQR from 'jsqr';
  import { ipcRenderer } from 'electron';
  import parse from '../parser';
  export default {
    name: 'app',
    data() {
      return {
        cannot_launch: true,
        video: {},
        canvas: {},
        captures: {},
        turn: 10,
        color: 'Red',
      };
    },
    mounted() {
      this.video = this.$refs.video;
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            this.video.srcObject = stream;
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
          this.code = parse(qr.data, this.color);
        }
      }, 100);
    },
    methods: {
      launch() {
        console.log(ipcRenderer);
        ipcRenderer.send('launch', {
          tbl: this.code,
          // TODO
          turn: this.turn,
        });
      },
    },
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
