<template> <div id="wrapper">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <div id="container">
        <canvas ref="canvas" id="canvas" width="640" height="480" v-if="code == null"></canvas>
        <board v-bind:tbl="code.tbl.arr" v-if="code != null"/>
        <div class="controll">
          <input v-model="turn" type="number"></input>
          <div class="radio">
            <input type="radio" name="color" v-model="color" value="Red">Red</input>
            <input type="radio" name="color" v-model="color" value="Blue">Blue</input>
          </div>
          <button v-bind:disabled="cannot_launch" @click="discord()">Undo</button>
          <button v-bind:disabled="cannot_launch" @click='launch()'>Launch!</button>
        </div>
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
        code: null,
        table_shown: false,
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
        if (this.code == null) {
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
            this.orig_data = qr.data;
            const code = parse(qr.data, this.color);
            this.code = code;
          }
        }
      }, 100);
    },
    methods: {
      discord() {
        this.cannot_launch = true;
        this.code = null;
      },
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

.radio {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.controll {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 480px;
}
</style>
