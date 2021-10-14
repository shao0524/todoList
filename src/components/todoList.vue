<template>
  <div>
    <div class="banner">
      <div class="container">
        <div class="todo my-3 py-5 mx-3 px-3">
          <h1 class="text-center text-warning">我的代辦事項</h1>
          <div class="mb-3">
            <div
              class="
                my-3
                d-flex
                justify-content-center justify-content-md-start
              "
            >
              <button class="todo-btn" @click="todoStatus = '全部'">
                全部
              </button>
              <button class="todo-btn" @click="todoStatus = '未完成'">
                未完成
              </button>
              <button class="todo-btn" @click="todoStatus = '已完成'">
                已完成
              </button>
            </div>
            <div class="input-group">
              <input
                type="text"
                name="todoText"
                id="todoText"
                v-model="todoText"
                class="form-control"
                placeholder="請輸入代辦事項"
                @keyup.enter="addTodo"
              />
              <button
                class="btn btn-info text-white"
                :disabled="!todoText"
                @click="addTodo"
              >
                新增代辦
              </button>
            </div>
          </div>
          <div class="todo-body mb-3">
            <div
              class="todo-item mb-3"
              v-for="todo in filterTodo"
              :key="todo.key"
            >
              <div class="input-group-text">
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="todo.is_completed"
                  @change="updateTodo(todo)"
                />
              </div>

              <h5
                class="me-auto align-self-center ms-3"
                :class="{ delLine: todo.is_completed }"
                v-if="cacheKey != todo.key"
                @dblclick="cacheKey = todo.key"
              >
                {{ todo.title }}
              </h5>
              <input
                type="text"
                name="edit"
                id="edit"
                class="w-100 mx-3 form-control"
                v-model="cacheTitle"
                v-else
                @keyup.esc="cacheKey = ''"
                @keyup.enter="editTodo(todo)"
              />
              <button type="button" class="removeBtn" @click="removeTodo(todo)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-9">
              <div
                class="
                  ms-3
                  me-auto
                  d-flex
                  text-white
                  justify-content-center justify-content-md-start
                "
              >
                <h6 class="me-3">全部{{ todosLen.all.length }}</h6>
                <h6 class="me-3">未完成{{ todosLen.uncompleted.length }}</h6>
                <h6 class="me-3">已完成{{ todosLen.completed.length }}</h6>
              </div>
            </div>
            <div class="col-12 col-md-3 text-center text-md-end">
              <button class="btn btn-danger" @click="removeAll">
                清除全部
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { firebase } from "../connect/firebase";
import { ref, onMounted, computed, reactive } from "vue";
export default {
  name: "todoList",
  setup() {
    // firebase
    const { database, firbaseRef, get, push, set, child, update, remove } =
      firebase;
    const todosRef = firbaseRef(database, "todos");
    // todo
    const todoStatus = ref("全部");
    const todoText = ref("");
    const is_completed = ref(false);
    const todos = reactive({
      data: [],
    });
    const cacheTitle = ref("");
    const cacheKey = ref("");
    // fuctions
    const getTodo = () => {
      const newArray = [];
      get(todosRef).then((snapshot) => {
        snapshot.forEach((item) => {
          newArray.push(item.val());
        });
        newArray.reverse();
        todos.data = newArray;
      });
    };
    const addTodo = () => {
      const newRef = push(todosRef);
      const newTodo = {
        key: newRef.key,
        is_completed: is_completed.value,
        title: todoText.value,
      };
      set(newRef, newTodo);
      getTodo();
      todoText.value = "";
    };
    const updateTodo = (todo) => {
      const newRef = child(todosRef, todo.key);
      update(newRef, todo);
      getTodo();
    };
    const removeTodo = (todo) => {
      const newRef = child(todosRef, todo.key);
      remove(newRef, todo);
      getTodo();
    };
    const editTodo = (todo) => {
      todo.title = cacheTitle.value;
      const newRef = child(todosRef, todo.key);
      update(newRef, todo);
      getTodo();
      cacheTitle.value = "";
      cacheKey.value = "";
    };
    const removeAll = () => {
      remove(todosRef);
      getTodo();
    };
    onMounted(() => {
      getTodo();
    });

    const filterTodo = computed(() => {
      if (todoStatus.value !== "全部") {
        if (todoStatus.value === "未完成") {
          return todos.data.filter((item) => !item.is_completed);
        } else {
          return todos.data.filter((item) => item.is_completed);
        }
      }
      return todos.data;
    });

    const todosLen = computed(() => {
      return {
        all: todos.data,
        uncompleted: todos.data.filter((item) => !item.is_completed),
        completed: todos.data.filter((item) => item.is_completed),
      };
    });
    return {
      todoText,
      is_completed,
      todos,
      addTodo,
      cacheTitle,
      cacheKey,
      todosLen,
      todoStatus,
      filterTodo,
      updateTodo,
      removeTodo,
      editTodo,
      removeAll,
    };
  },
};
</script>
