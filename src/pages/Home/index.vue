<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer/>
    <Recommend/>
    <Rank/>
    <Like/>
                                                <!-- 通过props将floor数据传递给子组件 -->
    <Floor v-for="(floor,index) in floorList" :key="index"  :floor="floor"/>
    <Brand/>
  </div>
</template>

<script>
import ListContainer from "@/pages/Home/ListContainer"
import Recommend from "@/pages/Home/Recommend"
import Rank from "@/pages/Home/Rank"
import Like from "@/pages/Home/Like"
import Floor from "@/pages/Home/Floor"
import Brand from "@/pages/Home/Brand"

import {mapState} from "vuex"
/* eslint-disable */
export default {
    name:'Home',
    components:{
        Rank,
        ListContainer,
        Recommend,
        Like,
        Floor,
        Brand
    },
    mounted(){
      //向vuex派发actions请求获取floor组件数据
      //因为floor数据有两层 所以直接在floor父组件中获取数据 然后再用循环floor组件 然后再用props将数据传给floor组件
      this.$store.dispatch('getFloorList');

      // //获取用户登录后信息在首页展示
      // this.$store.dispatch('getUserInfo');
    },
    computed:{
      ...mapState({
        floorList:state=>state.home.floorList
      })
    }
}
</script>

<style>

</style>