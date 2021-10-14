<template>
  <todoList />
</template>

<script>
import todoList from "./components/todoList.vue";

export default {
  name: "App",
  components: {
    todoList,
  },
};
</script>

<style lang="scss">
@import "~sass/all.scss";
</style>
