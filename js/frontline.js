// 前线绘制模块 - 绘制前线、控制区和进攻箭头
function drawFrontline(viewer, data) {
  // 1. 绘制俄军控制区（半透明红色）
  if (data.russianControlZone) {
    data.russianControlZone.features.forEach(function (feature) {
      const coords = feature.geometry.coordinates[0];
      const positions = [];
      coords.forEach(function (c) {
        positions.push(c[0], c[1]);
      });

      viewer.entities.add({
        name: feature.properties.name,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(positions),
          material: Cesium.Color.RED.withAlpha(0.12),
          outline: false,
          height: 0,
        },
        description: '<div class="info-desc"><b>俄军控制区</b><br>包括已占领的顿涅茨克、卢甘斯克大部分地区，以及扎波罗热、赫尔松部分地区。</div>',
      });
    });
  }

  // 2. 绘制前线对峙线（黄色虚线效果 - 通过多段线+发光实现）
  if (data.frontline) {
    data.frontline.features.forEach(function (feature) {
      const coords = feature.geometry.coordinates;
      const positions = [];
      coords.forEach(function (c) {
        positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1]));
      });

      // 主前线 - 粗黄线
      viewer.entities.add({
        name: '前线对峙线 (FEBA)',
        polyline: {
          positions: positions,
          width: 5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.3,
            taperPower: 0.5,
            color: Cesium.Color.YELLOW,
          }),
          clampToGround: true,
        },
        description: '<div class="info-desc"><b>前线对峙线</b> (Forward Edge of Battle Area)<br>基于ISW 2026年3月6日评估的近似前线位置。从哈尔科夫州北部延伸至赫尔松方向，全长约600公里。</div>',
      });

      // 前线两侧缓冲 - 左侧蓝线（乌军侧）
      const ukraineSidePositions = offsetPolyline(coords, -0.08);
      viewer.entities.add({
        polyline: {
          positions: ukraineSidePositions,
          width: 3,
          material: Cesium.Color.fromCssColorString('#4488ff').withAlpha(0.5),
          clampToGround: true,
        },
      });

      // 前线两侧缓冲 - 右侧红线（俄军侧）
      const russiaSidePositions = offsetPolyline(coords, 0.08);
      viewer.entities.add({
        polyline: {
          positions: russiaSidePositions,
          width: 3,
          material: Cesium.Color.fromCssColorString('#ff4444').withAlpha(0.5),
          clampToGround: true,
        },
      });
    });
  }

  // 3. 绘制进攻方向箭头
  if (data.attackArrows) {
    data.attackArrows.forEach(function (arrow) {
      const isRussian = arrow.side === 'russia';
      const color = isRussian
        ? Cesium.Color.fromCssColorString('#ff3333')
        : Cesium.Color.fromCssColorString('#3388ff');

      const from = Cesium.Cartesian3.fromDegrees(arrow.from[0], arrow.from[1]);
      const to = Cesium.Cartesian3.fromDegrees(arrow.to[0], arrow.to[1]);

      // 箭头主体
      viewer.entities.add({
        name: arrow.name,
        polyline: {
          positions: [from, to],
          width: 8,
          material: new Cesium.PolylineArrowMaterialProperty(color.withAlpha(0.8)),
          clampToGround: true,
        },
        description:
          '<div class="info-desc"><b>' +
          arrow.name +
          '</b><br>方向: ' +
          (isRussian ? '俄军进攻方向 🔴' : '乌军反攻方向 🔵') +
          '</div>',
      });
    });
  }
}

// 辅助函数：将折线向一侧偏移
function offsetPolyline(coords, offsetDeg) {
  var positions = [];
  for (var i = 0; i < coords.length; i++) {
    var lon = coords[i][0];
    var lat = coords[i][1];

    // 计算法线方向
    var dx = 0, dy = 0;
    if (i < coords.length - 1) {
      dx = coords[i + 1][0] - lon;
      dy = coords[i + 1][1] - lat;
    } else {
      dx = lon - coords[i - 1][0];
      dy = lat - coords[i - 1][1];
    }

    // 法线（旋转90度）
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len > 0) {
      var nx = -dy / len;
      var ny = dx / len;
      positions.push(
        Cesium.Cartesian3.fromDegrees(lon + nx * offsetDeg, lat + ny * offsetDeg)
      );
    }
  }
  return positions;
}
