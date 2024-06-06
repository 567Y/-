<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
import Footer from '@/components/Footer';
import Header from '@/components/Header';
export default {
  name: 'App',
  components: {
    Footer,
    Header
  }
}
</script>

<style>
</style>
