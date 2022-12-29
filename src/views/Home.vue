<template>
  <div class="home">
    <div id="mapView"></div>
    <div class="operate">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
      <button @click="toggle('region')">中国/全球</button>
      <button @click="toggle('map')">创建/销毁</button>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin.js';
export default {
  name: 'Home',
  mixins: [mixin],
  data() {
    return {
      global: {
        regionType: 0,
      },
    };
  },
  mounted() {
    this.initMap('mapView');
  },
  methods: {
    toggle(type) {
      switch (type) {
        case 'region':
          this.global.regionType = this.global.regionType === 0 ? 1 : 0;
          break;
        case 'map':
          if (this.scene) {
            this.destroyed();
          } else {
            this.initMap('mapView');
          }
          break;
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
}
</style>
