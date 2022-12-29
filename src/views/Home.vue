<!--
 * @Author: cola
 * @Date: 2022-12-29 18:16:25
 * @LastEditors: cola
 * @Description: 
-->
// eslint-disabled
<template>
  <div class="home">
    <div id="mapView"></div>
    <div class="operate">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
      <button @click="toggle('region')">中国/全球</button>
      <button @click="toggle('map')">创建/销毁</button>
      <button @click="toggle('route')">切换路由</button>
    </div>
  </div>
</template>

<script>
import mixin from "../mixin.js";
export default {
  name: "Home",
  mixins: [mixin],
  data() {
    return {
      global: {
        regionType: 0,
      },
    };
  },
  mounted() {
    this.initMap("mapView");
  },
  methods: {
    toggle(type) {
      switch (type) {
        case "region":
          this.global.regionType = this.global.regionType === 0 ? 1 : 0;
           this.toggleLayer(this.global.regionType === 0 ? "world" : "china");
          break;
        case "map":
          if (this.scene) {
            this.destroyed();
          } else {
            this.initMap("mapView");
          }
          break;
        case "route":
          this.$router.push({path: "/about"})
          break
      }
    },
  },
};
</script>

<style>
.home,
#mapView {
  position: relative;
  width: 100%;
  height: 100%;
}

.operate {
  position: absolute;
  top: 0;
  z-index: 99;
}
</style>
