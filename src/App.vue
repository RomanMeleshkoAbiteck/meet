<template>
  <div id="App">

    <Home></Home>

  </div>
</template>

<script>
import { defineComponent } from 'vue';

import Home from "./pages/Home.vue";

 export default defineComponent({
   name: "App",
   data() {
     return {

     }
   },
   components: {
      Home
   }
 })

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
