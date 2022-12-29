/*
 * @Author: cola
 * @Date: 2022-12-12 14:51:44
 * @LastEditors: cola
 * @Description:
 */
import chinaLabel from './data/chinaLabel.json';
import worldLabel from './data/worldLabel.json';
import china from './data/china.json';
import world from './data/world.json';
import worldOther from './data/worldOther.json';
import { Scene, PolygonLayer, LineLayer, PointLayer, Popup } from '@antv/l7';
import { Map } from '@antv/l7-maps';
const selectStyle = '#FEFB85';
const strokeStyle = '#F0F4F6';
const textStyle = 'rgba(0,0,255,0.8)';
const hoverStyle = '#FEFB8580';
const colors = [
  '#F0F4F6',
  '#EFA5B3',
  '#EFA5B3',
  '#DB788A',
  '#CE5E74',
  '#BF435D',
  '#AF2147',
];
export default {
  name: 'MapView',
  beforeDestroy() {
    this.destroyed();
  },
  methods: {
    destroyed() {
      if (this.scene) {
        this?.scene?.removePopup?.(this.popup);
        this?.scene?.removeAllLayer();
        this.scene.destroy();
        this.scene = null;
      }
    },
    initMap(id) {
      this.destroyed();
      this.popup = new Popup({
        offsets: [0, 0],
        closeButton: false,
      });
      this.scene = new Scene({
        id: id,
        map: new Map({
          pitch: 0,
          style: 'blank',
          dragRotate: false,
          maxZoom: 8,
          minZoom: 0,
        }),
        logoVisible: false,
      });
      this.scene.on('loaded', () => {
        this.scene.addPopup(this.popup);
        this.addHightLayer(this.scene);
        const worldLayer = this.addWorldLayer(this.scene);
        const worldOtherLayer = this.scene.getLayerByName('world_other_layer');
        worldLayer.on('click', (evt) => {
          this.locateByCode('world', evt.feature.properties.code, false);
        });
        worldLayer.on('mousemove', (evt) => {
          this.toggleLabelLayer(evt.feature);
        });
        worldLayer.on('mouseout', (evt) => {
          this?.popup?.hide();
        });
        worldOtherLayer.on('click', (evt) => {
          this.locateByCode('world', evt.feature.properties.code, false);
        });
        worldOtherLayer.on('mousemove', (evt) => {
          this.toggleLabelLayer(evt.feature);
        });
        worldOtherLayer.on('mouseout', (evt) => {
          this.popup.hide();
        });
        const chinaLayer = this.addChinaLayer(this.scene);
        chinaLayer.on('click', (evt) => {
          this.locateByCode('china', evt.feature.properties.code, false);
        });
        chinaLayer.on('mousemove', (evt) => {
          this.toggleLabelLayer(evt.feature);
        });
        chinaLayer.on('mouseout', (evt) => {
          this.popup.hide();
        });
        this.toggleLayer(this.global.regionType === 0 ? 'world' : 'china');
      });
    },
    addHightLayer(scene, options) {
      const lineLayer = new PolygonLayer({
        zIndex: 4, // 设置显示层级
        name: 'hightlight_polygon',
      })
        .source({
          type: 'FeatureCollection',
          features: [],
        })
        .style({
          opacity: 1,
        })
        .shape('fill')
        .color(selectStyle);
      const labelLayer = new PointLayer({
        name: 'hightlight_point',
        zIndex: 5,
      })
        .source(
          {
            type: 'FeatureCollection',
            features: [],
          },
          {
            parser: {
              type: 'json',
              coordinates: 'center',
            },
          }
        )
        .color(textStyle)
        .shape('NAME_CHN', 'text')
        .size(10)
        .style({
          textAllowOverlap: false,
        });
      scene.addLayer(lineLayer);
      scene.addLayer(labelLayer);
    },
    addWorldLayer(scene, options) {
      const worldLayer = new PolygonLayer({
        name: 'world_layer',
        autoFit: false,
        blend: 'normal',
      }).source(world);

      worldLayer
        .shape('fill')
        .style({
          opacity: 1,
        })
        .color('code', (code) => {
          return colors[parseInt(Math.random() * 7)];
        })
        .active({
          color: hoverStyle,
        })
        .select(false);

      const worldOtherLayer = new PolygonLayer({
        name: 'world_other_layer',
        autoFit: false,
        blend: 'normal',
      }).source(worldOther);

      worldOtherLayer
        .shape('fill')
        .style({
          opacity: 1,
        })
        .color('code', (code) => {
          return colors[parseInt(Math.random() * 7)];
        })
        .active({
          color: hoverStyle,
        })
        .select(false);

      //  图层边界
      const borderLayer = new LineLayer({
        name: 'world_border_layer',
        zIndex: 2,
      })
        .source(world)
        .color(strokeStyle)
        .size(0.1)
        .style({
          opacity: 1,
        });
      scene.addLayer(worldLayer);
      scene.addLayer(worldOtherLayer);
      scene.addLayer(borderLayer);
      return worldLayer;
    },
    showLayers(layers) {
      layers?.map((layer) => {
        layer?.show?.();
      });
    },
    hideLayers(layers) {
      layers?.map((layer) => {
        layer?.hide?.();
      });
    },
    // 清空高亮图层
    emptyLayers(layers) {
      layers.map((layer) => {
        if (layer.name === 'hightlight_point') {
          layer.setData([]);
        } else {
          layer.setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
      });
    },
    hightlight(feature) {
      const labelLayer = this.scene.getLayerByName('hightlight_point');
      const lineLayer = this.scene.getLayerByName('hightlight_polygon');
      lineLayer.setData({
        type: 'FeatureCollection',
        features: [feature],
      });
      let res;
      if (this.global.regionType === 0) {
        res = worldLabel.find((i) => i.code === feature.properties.code);
      } else {
        res = chinaLabel.find((i) => i.code === feature.properties.code);
      }
      labelLayer.setData([res]);
    },
    // 添加中国
    addChinaLayer(scene, options) {
      const chinaLayer = new PolygonLayer({
        name: 'china_layer',
        autoFit: false,
      }).source(china);

      chinaLayer
        .shape('fill')
        .style({
          opacity: 1,
        })
        .color('code', (code) => {
          return colors[parseInt(Math.random() * 7)];
        })
        .active({
          color: hoverStyle,
        })
        .select(false);
      //  图层边界
      const borderLayer = new LineLayer({
        name: 'china_border_layer',
        zIndex: 2,
      })
        .source(china)
        .color(strokeStyle)
        .size(0.1)
        .style({
          opacity: 1,
        });

      scene.addLayer(chinaLayer);
      scene.addLayer(borderLayer);
      return chinaLayer;
    },
    // 切换标注
    toggleLabelLayer(feature) {
      const { code, centroid, name } = feature.properties;
      this.popup.show();
      this.popup.setLnglat(centroid).setHTML(`
            <div class='title'>${name}</div>          
          `);
    },
    // 切换图层
    toggleLayer(type) {
      const layers = this?.scene?.getLayers() || [];
      this.emptyLayers(
        layers.filter((layer) => {
          return layer.name.startsWith('hightlight');
        })
      );
      this?.popup?.hide();
      const regionType = this.global?.regionType;
      let layer;
      switch (+regionType) {
        case 0:
          layer = this?.scene?.getLayerByName?.('world_layer');
          break;
        case 1:
          layer = this?.scene?.getLayerByName?.('china_layer');
          break;
      }
      if (layer) {
        layer.fitBounds();
      }
      switch (type) {
        case 'world':
          this.hideLayers(
            layers.filter((layer) => {
              return layer.name.startsWith('china');
            })
          );
          this.showLayers(
            layers.filter((layer) => {
              return layer.name.startsWith('world');
            })
          );
          break;
        case 'china':
          this.hideLayers(
            layers.filter((layer) => {
              return layer.name.startsWith('world');
            })
          );
          this.showLayers(
            layers.filter((layer) => {
              return layer.name.startsWith('china');
            })
          );
          break;
      }
    },
    // 高亮并定位
    locateByCode(type, code, isLocate = true, isScroll = true) {
      let feature = null;
      switch (type) {
        case 'world':
          // eslint-disable-next-line no-case-declarations
          const worldLayer = this.scene.getLayerByName('world_layer');
          feature = worldLayer.layerSource.originData.features.find(
            (feature) => {
              return feature.properties.code === code;
            }
          );
          if (!feature) {
            const worldOtherLayer =
              this.scene.getLayerByName('world_other_layer');
            feature = worldOtherLayer.layerSource.originData.features.find(
              (feature) => {
                return feature.properties.code === code;
              }
            );
          }
          break;
        case 'china':
          // eslint-disable-next-line no-case-declarations
          const chinaLayer = this.scene.getLayerByName('china_layer');
          feature = chinaLayer.layerSource.originData.features.find(
            (feature) => {
              return feature.properties.code === code;
            }
          );
          break;
      }
      if (feature && code && feature?.properties?.centroid) {
        if (isLocate) {
          this.scene.setCenter(feature.properties.centroid);
        }
        this.hightlight(feature);
      }
    },
    zoomIn() {
      // const zoom = this?.scene?.getZoom?.()
      // if (zoom < 8) {
      //   this.scene?.zoomIn?.()
      // }
      this.scene?.zoomIn?.();
    },
    zoomOut() {
      // const zoom = this?.scene?.getZoom?.()
      // if (zoom > 0) {
      //    this.scene?.zoomOut?.()
      // }
      this.scene?.zoomOut?.();
    },
    // 全图
    home() {
      let layer;
      switch (+this?.global?.regionType) {
        case 0:
          layer = this?.scene?.getLayerByName?.('world_layer');
          break;
        case 1:
          layer = this?.scene?.getLayerByName?.('china_layer');
          break;
      }
      if (layer) {
        layer.fitBounds();
      }
    },
  },
};
