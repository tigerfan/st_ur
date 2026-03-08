// 主应用 - 初始化CesiumJS并加载所有模块
(async function () {
  // 使用OpenStreetMap底图，无需Ion token
  var viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/',
    }),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: true,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: true,
    selectionIndicator: true,
    infoBox: true,
  });

  // 去除Cesium logo
  viewer.cesiumWidget.creditContainer.style.display = 'none';

  // 设置初始视角 - 聚焦乌东地区
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(36.5, 48.0, 1200000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-60),
      roll: 0,
    },
    duration: 2,
  });

  // 加载前线数据
  let frontlineData;
  try {
    const response = await fetch('data/frontline.json');
    frontlineData = await response.json();
  } catch (e) {
    console.error('无法加载前线数据:', e);
    return;
  }

  // 初始化各模块
  drawFrontline(viewer, frontlineData);
  addMarkers(viewer, frontlineData);
  createLegend();

  // 点击事件处理 - 显示信息面板
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.description) {
      showInfoPanel(pickedObject.id);
    } else {
      hideInfoPanel();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 信息面板显示
  window.showInfoPanel = function (entity) {
    const panel = document.getElementById('infoPanel');
    const title = document.getElementById('infoPanelTitle');
    const content = document.getElementById('infoPanelContent');
    
    title.innerHTML = entity.name || '未知';
    content.innerHTML = entity.description.getValue() || '';
    panel.classList.add('visible');
  };

  window.hideInfoPanel = function () {
    const panel = document.getElementById('infoPanel');
    panel.classList.remove('visible');
  };

  // 全局viewer引用
  window.cesiumViewer = viewer;
})();
