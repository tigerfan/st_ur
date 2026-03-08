// 图例组件
function createLegend() {
  var legendEl = document.getElementById('legend');
  if (!legendEl) return;

  legendEl.innerHTML =
    '<div class="legend-title">图例 / Legend</div>' +
    '<div class="legend-section">' +
    '  <div class="legend-subtitle">前线态势</div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-line" style="background:linear-gradient(90deg,#ffeb3b,#ffc107);box-shadow:0 0 6px #ffc107"></span>' +
    '    <span>前线对峙线 (FEBA)</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-line" style="background:#4488ff"></span>' +
    '    <span>乌军侧</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-line" style="background:#ff4444"></span>' +
    '    <span>俄军侧</span>' +
    '  </div>' +
    '</div>' +
    '<div class="legend-section">' +
    '  <div class="legend-subtitle">控制区域</div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-box" style="background:rgba(244,67,54,0.3);border:1px solid #f44336"></span>' +
    '    <span>俄军控制区</span>' +
    '  </div>' +
    '</div>' +
    '<div class="legend-section">' +
    '  <div class="legend-subtitle">城市/标记</div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-dot" style="background:#2196F3"></span>' +
    '    <span>乌军控制城市</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-dot" style="background:#f44336"></span>' +
    '    <span>俄军控制城市</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-dot" style="background:#FF9800"></span>' +
    '    <span>争夺中</span>' +
    '  </div>' +
    '</div>' +
    '<div class="legend-section">' +
    '  <div class="legend-subtitle">进攻方向</div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-arrow" style="color:#ff5252">→</span>' +
    '    <span>俄军进攻方向</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-arrow" style="color:#448aff">→</span>' +
    '    <span>乌军反攻方向</span>' +
    '  </div>' +
    '  <div class="legend-item">' +
    '    <span class="legend-ring" style="border-color:#ffab00"></span>' +
    '    <span>激烈争夺区</span>' +
    '  </div>' +
    '</div>' +
    '<div class="legend-footer">' +
    '  数据来源: ISW 2026.03.06<br>' +
    '  坐标为近似标注' +
    '</div>';
}
