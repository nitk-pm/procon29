<template>
  <div class="board">
    <div class="row" v-for="line in tbl">
      <div v-for="square in line">
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
}
.row:after {
  clear: both;
  content: "";
  display: table;
}
.board {
  display: flex;
  flex-direction: row;
}
</style>
