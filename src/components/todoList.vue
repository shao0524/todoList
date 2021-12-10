<template>
  <div>
    <h1 class="text-center">My Todo List</h1>
    <section class="todo">
      <div class="todo-inputGroup">
        <input type="text" name="input" v-model="title" />
        <input type="date" name="date" placeholder="DD" v-model="date" />
        <button type="button" @click="addTodo" :disabled="!(title && date)">
          Add into list
        </button>
      </div>
      <br />
      <h2>正在進行</h2>
      <ul class="todoList">
        <li
          class="todoList-item"
          v-for="todo in filter.unCompletedTodos"
          :key="todo.key"
        >
          <div class="todoList-item-title" v-if="cacheKey !== todo.key">
            <h3
              :class="{ del: todo.is_completed }"
              @dblclick="cacheKey = todo.key"
            >
              {{ todo.title }}
            </h3>
            <h3 :class="{ del: todo.is_completed }">
              {{ todo.date }}
            </h3>
          </div>

          <input
            type="text"
            v-model="cacheTitle"
            v-else
            @change="todo.title = cacheTitle"
            @keyup.esc="cacheKey = ''"
            @keyup.enter="editTodo(todo)"
          />
          <button type="button" class="checkBtn" @click="checkHandler(todo)">
            <i class="bi bi-check-lg"></i>
          </button>
          <button
            type="button"
            class="removeBtn"
            @click="removeTodo($event, todo)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </li>
      </ul>

      <h2>已完成</h2>

      <ul class="todoList">
        <li
          class="todoList-item"
          v-for="todo in filter.completedTodos"
          :key="todo.key"
        >
          <div class="todoList-item-title" v-if="cacheKey !== todo.key">
            <h3
              :class="{ del: todo.is_completed }"
              @dblclick="cacheKey = todo.key"
            >
              {{ todo.title }}
            </h3>
            <h3 :class="{ del: todo.is_completed }">
              {{ todo.date }}
            </h3>
          </div>

          <input
            type="text"
            v-model="cacheTitle"
            v-else
            @change="todo.title = cacheTitle"
            @keyup.esc="cacheKey = ''"
            @keyup.enter="editTodo(todo)"
          />
          <button type="button" class="checkBtn" @click="checkHandler(todo)">
            <i class="bi bi-check-lg"></i>
          </button>
          <button
            type="button"
            class="removeBtn"
            @click="removeTodo($event, todo)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { firebase } from "../connect/firebase";
import { ref, reactive, onMounted, computed } from "vue";
// import { update } from "firebase/database";
export default {
  name: "todoList",
  setup() {
    // firebase
    // , remove
    const { database, firbaseRef, get, push, set, child, update, remove } =
      firebase;
    const todosRef = firbaseRef(database, "todos");
    //
    const date = ref("");
    const title = ref("");
    const cacheKey = ref("");
    const cacheTitle = ref("");
    const todos = reactive({
      data: [],
    });
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
        is_completed: false,
        title: title.value,
        date: date.value,
      };
      set(newRef, newTodo);
      getTodo();
      title.value = "";
      date.value = "";
    };

    const editTodo = (todo) => {
      const newRef = child(todosRef, todo.key);
      update(newRef, todo);
      cacheKey.value = "";
      cacheTitle.value = "";
      getTodo();
    };

    const removeTodo = (e, todo) => {
      const newRef = child(todosRef, todo.key);
      remove(newRef);
      getTodo();
      const thisTodo = e.target.parentElement.parentElement;
      thisTodo.style.animation = "scaleDown 0.5s forwards";
    };

    const checkHandler = (todo) => {
      if (!cacheKey.value) {
        todo.is_completed = !todo.is_completed;
      }
      editTodo(todo);
    };

    const filter = computed(() => {
      const completedTodos = [];
      const unCompletedTodos = [];

      todos.data.forEach((item) => {
        if (item.is_completed) {
          completedTodos.push(item);
        } else {
          unCompletedTodos.push(item);
        }
      });
      return {
        completedTodos,
        unCompletedTodos,
      };
    });
    onMounted(() => {
      getTodo();
    });
    return {
      date,
      title,
      todos,
      cacheKey,
      cacheTitle,
      addTodo,
      editTodo,
      removeTodo,
      checkHandler,
      filter,
    };
  },
};
</script>
