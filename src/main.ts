import './style.css'
import 'cesium/Build/Cesium/Widgets/widgets.css';
import * as Cesium from 'cesium';

const m_mono: any = new Cesium.UrlTemplateImageryProvider({
    url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
    credit: new Cesium.Credit(
        "Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
    ),
});

const viewer = new Cesium.Viewer('map', {
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    timeline: false,
    animation: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(m_mono,{}),
});

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(139.5, 33.0, 100000.0),
    orientation: {
        pitch: -0.3,
        roll: -0.25,
    },
});
