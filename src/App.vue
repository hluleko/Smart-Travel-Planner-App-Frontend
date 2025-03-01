<!-- src/App.vue -->
<template>
  <main_header></main_header>
  <br/><br/>
  <router-view />
  <br/><br/>
</template>

<script>
import main_header from './components/reusable/main_header.vue';

export default{
   components:{
       main_header
   }
}

</script>

<style scoped>

*{
   padding: 0px;
   margin: 0px;
   font-family: sans-serif;
}
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
