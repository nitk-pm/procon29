<template>
  <div class="board">
    <div class="row" v-for="line in tbl">
      <div
        class="square"
        v-for="square in line"
        v-bind:class="{ blue: square.color === 'Blue', red: square.color === 'Red' }"
      >
        {{ square.score }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tbl'],
  name: 'board',
  data: () => ({}),
  methods: {
  },
};
</script>

<style>
.square {
  border: solid 1px #000000;
  height: 5vw;
  width: 5vw;
  text-align: center;
}
.row {
  display: flex;
  flex-direction: row;
}
.row:after {
  clear: both;
  content: "";
  display: table;
}
.board {
  display: flex;
  flex-direction: column;
}

.blue {
  background-color: #303F9F;
  color: #FFFFFF;
}

.red {
  background-color: #d32f2f;
  color: #FFFFFF;
}
</style>
