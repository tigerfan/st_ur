// 标记模块 - 添加城市标记和战场方向标记
function addMarkers(viewer, data) {
  // 1. 添加关键城市标记
  if (data.keyLocations) {
    data.keyLocations.forEach(function (loc) {
      var color, outlineColor, size;

      switch (loc.side) {
        case 'ukraine':
          color = Cesium.Color.fromCssColorString('#2196F3');
          outlineColor = Cesium.Color.fromCssColorString('#1565C0');
          break;
        case 'russia':
          color = Cesium.Color.fromCssColorString('#f44336');
          outlineColor = Cesium.Color.fromCssColorString('#b71c1c');
          break;
        case 'contested':
          color = Cesium.Color.fromCssColorString('#FF9800');
          outlineColor = Cesium.Color.fromCssColorString('#E65100');
          break;
        default:
          color = Cesium.Color.GRAY;
          outlineColor = Cesium.Color.DARKGRAY;
      }

      size = loc.type === 'city' ? 12 : 8;

      viewer.entities.add({
        name: loc.name + ' (' + loc.nameEn + ')',
        position: Cesium.Cartesian3.fromDegrees(loc.lon, loc.lat),
        point: {
          pixelSize: size,
          color: color,
          outlineColor: outlineColor,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: loc.name,
          font: loc.type === 'city' ? 'bold 14px sans-serif' : '12px sans-serif',
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -16),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e4, 1.0, 5.0e6, 0.4),
        },
        description: buildLocationDescription(loc),
      });
    });
  }

  // 2. 添加战场方向标记（脉冲圆环效果）
  if (data.battleDirections) {
    data.battleDirections.forEach(function (bd) {
      var color;
      switch (bd.side) {
        case 'russia_attack':
          color = Cesium.Color.fromCssColorString('#ff5252');
          break;
        case 'ukraine_advance':
          color = Cesium.Color.fromCssColorString('#448aff');
          break;
        case 'contested':
          color = Cesium.Color.fromCssColorString('#ffab00');
          break;
        default:
          color = Cesium.Color.GRAY;
      }

      // 战场区域脉冲圆
      viewer.entities.add({
        name: bd.name,
        position: Cesium.Cartesian3.fromDegrees(bd.lon, bd.lat),
        ellipse: {
          semiMinorAxis: 15000,
          semiMajorAxis: 15000,
          height: 0,
          material: color.withAlpha(0.15),
          outline: true,
          outlineColor: color.withAlpha(0.6),
          outlineWidth: 2,
        },
        description: buildBattleDescription(bd),
      });

      // 方向标签
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(bd.lon, bd.lat + 0.12),
        label: {
          text: '⚔ ' + bd.name,
          font: 'bold 13px sans-serif',
          fillColor: color,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(1.0e4, 1.2, 3.0e6, 0.3),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
          backgroundPadding: new Cesium.Cartesian2(8, 5),
        },
      });
    });
  }
}

function buildLocationDescription(loc) {
  var sideText = '';
  switch (loc.side) {
    case 'ukraine':
      sideText = '<span style="color:#2196F3">■</span> 乌军控制';
      break;
    case 'russia':
      sideText = '<span style="color:#f44336">■</span> 俄军控制';
      break;
    case 'contested':
      sideText = '<span style="color:#FF9800">■</span> 争夺中';
      break;
  }

  return (
    '<div class="info-desc">' +
    '<h3>' + loc.name + ' / ' + loc.nameEn + '</h3>' +
    '<p><b>控制方:</b> ' + sideText + '</p>' +
    '<p><b>类型:</b> ' + (loc.type === 'city' ? '主要城市' : '城镇') + '</p>' +
    '<p><b>坐标:</b> ' + loc.lat.toFixed(2) + '°N, ' + loc.lon.toFixed(2) + '°E</p>' +
    '</div>'
  );
}

function buildBattleDescription(bd) {
  var statusColor = '';
  switch (bd.side) {
    case 'russia_attack':
      statusColor = '#ff5252';
      break;
    case 'ukraine_advance':
      statusColor = '#448aff';
      break;
    case 'contested':
      statusColor = '#ffab00';
      break;
  }

  return (
    '<div class="info-desc">' +
    '<h3>⚔ ' + bd.name + '</h3>' +
    '<p style="color:' + statusColor + '; font-weight:bold; font-size:14px;">' + bd.status + '</p>' +
    '<p>' + bd.description + '</p>' +
    '<p style="color:#888; font-size:11px;">数据来源: ISW 2026年3月6日评估</p>' +
    '</div>'
  );
}
