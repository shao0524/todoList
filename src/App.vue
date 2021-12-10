<template>
  <div class="wrapper">
    <todoList />
  </div>
</template>

<script>
import todoList from "./components/todoList.vue";
import "node/bootstrap-icons/font/bootstrap-icons.css";
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
