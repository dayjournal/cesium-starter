import './style.css';
import * as Cesium from 'cesium';

// widgets.css is linked from index.html by vite-plugin-cesium, so it is not
// imported here.

const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
    credit: new Cesium.Credit(
        "Maptiles by <a href='https://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='https://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
    ),
});

const viewer = new Cesium.Viewer('map', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    timeline: false,
    animation: false,
    baseLayer: new Cesium.ImageryLayer(imageryProvider),
});

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(139.5, 33.0, 100000.0),
    orientation: {
        pitch: -0.3,
        roll: -0.25,
    },
});
