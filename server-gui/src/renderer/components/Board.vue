<template>
  <div>
    <div v-for="line in tbl">
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
</style>
