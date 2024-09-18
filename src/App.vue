<template>
 <div id="App">

    <main>

      <router-view></router-view>

    </main>

 </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "App",
  data() {
    return {

    }
  },

  components: {

  }
});

</script>

<style lang="scss" scoped>

</style>
