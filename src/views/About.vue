<!--
 * @Author: cola
 * @Date: 2022-12-29 18:16:25
 * @LastEditors: cola
 * @Description: 
-->
<template>
  <div class="about">
    <div>About</div>
    <button @click="toggle">切换路由</button>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {
    toggle(){
      this.$router.push({path: "/home"})
    }
  },
};
</script>
