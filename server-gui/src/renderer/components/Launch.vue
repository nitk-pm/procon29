<template> <div id="wrapper">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
      <div id="container">
        <canvas ref="canvas" id="canvas" width="640" height="480" v-if="orig_board == null"></canvas>
        <board v-bind:tbl="board.arr" v-if="board != null"/>
        <div class="controll">
          <input v-model="turn" type="number"></input>
          <div class="radio">
            <input type="radio" name="color" v-model="color" value="Red">Red</input>
            <input type="radio" name="color" v-model="color" value="Blue">Blue</input>
          </div>
          <div class="radio">
            <input type="radio" name="placement" v-model="placement" value="Point">Point</input>
            <input type="radio" name="placement" v-model="placement" value="MirrorX">MirrorX</input>
            <input type="radio" name="placement" v-model="placement" value="MirrorY">MirrorY</input>
          </div>
          <button v-bind:disabled="board_not_showable" @click="discord()">Undo</button>
          <button v-bind:disabled="cannot_launch" @click='launch()'>Launch!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import jsQR from 'jsqr';
  import { ipcRenderer } from 'electron';
  import * as parser from '../parser';
  export default {
    name: 'app',
    data() {
      return {
        video: {},
        canvas: {},
        captures: {},
        turn: 10,
        color: 'Red',
        orig_board: null,
        placement: 'Asymmetry',
      };
    },
    computed: {
      board() {
        if (this.orig_board != null) {
          return parser.placeAgents(this.orig_board, this.orig_agents, this.color, this.placement);
        }
        return null;
      },
      cannot_launch() {
        return this.placement === 'Asymmetry' || this.orig_board == null;
      },
      board_not_showable() {
        return this.orig_board == null;
      },
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
        if (this.orig_board == null) {
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
            this.orig_board = parser.parseQR(qr.data);
            this.orig_agents = this.orig_board.agents;
            this.placement = parser.deducePlacement(this.orig_board, this.orig_agents);
          }
        }
      }, 100);
    },
    methods: {
      discord() {
        this.orig_board = null;
        this.orig_agents = null;
      },
      launch() {
        console.log(ipcRenderer);
        ipcRenderer.send('launch', {
          tbl: this.board,
          // TODO
          turn: this.turn,
          color: this.color,
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
  flex-direction: column;
  justify-content: space-around;
}

.controll {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 480px;
}
</style>
