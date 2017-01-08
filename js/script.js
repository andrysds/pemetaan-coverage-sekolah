var canvas;
var ctx;
var map = new Image();

var scale = 0.12;
var lineWidth = 10;
var centerX;
var centerY;

var sxGeo = 105;
var syGeo = -5;
var areaWidth = 10;
var areaHeight = 5;
var viewWidth;
var viewHeight;
var sx = 0;
var sy = 0;

var schools;
var fr = new FileReader();

var vertices = [];
var polygons = [];
var coverage = [];

function geoToMapX(x) {
  return (x - sxGeo) * viewWidth / areaWidth;
}

function geoToMapY(y) {
  return (syGeo - y) * viewHeight / areaHeight;
}

function mapToGeoX(x) {
  return (x * areaWidth / viewWidth) + sxGeo;
}

function mapToGeoY(y) {
  return syGeo - (y * areaHeight / viewHeight);
}

function drawVertices(vertices) {
  ctx.fillStyle = "#F44336";
  for (i in vertices) {
    ctx.beginPath();
    ctx.arc(
      geoToMapX(vertices[i].x),
      geoToMapY(vertices[i].y), 
      lineWidth * 2, 0, Math.PI * 2
    );
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(edges) {
  ctx.strokeStyle = "#212121";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  for (i in edges) {
    ctx.beginPath();
    ctx.moveTo(
      geoToMapX(edges[i].v1.x),
      geoToMapY(edges[i].v1.y)
    );
    ctx.lineTo(
      geoToMapX(edges[i].v2.x),
      geoToMapY(edges[i].v2.y)
    );
    ctx.stroke();
  }
}

function drawPolygons(polygons) {
  var coverageLevel = [];
  coverageLevel[0] = Math.max.apply(Math, coverage);
  for (var i = 1; i < 9; i++) {
    coverageLevel[i] = coverageLevel[0] / 8 * (8 - i);
  }

  for (var i = 0; i < 8; i++) {
    $("#coverage-"+i).html((coverageLevel[i] * 100).toFixed(2) + 
      " &#8804; d &#8804; " + (coverageLevel[i-1] * 100).toFixed(2));
  }
  $("#coverage-8").html("d &#8804; " + (coverageLevel[7] * 100).toFixed(2));
  $("#legenda").show();

  for (var i in polygons) {
    ctx.beginPath();
    ctx.moveTo(
      geoToMapX(polygons[i].vertices[0].x),
      geoToMapY(polygons[i].vertices[0].y)
    );
    for (var j = 1; j < polygons[i].vertices.length; j++) {
      ctx.lineTo(
        geoToMapX(polygons[i].vertices[j].x),
        geoToMapY(polygons[i].vertices[j].y)
      );
    }
    
    if (coverage[i] > coverageLevel[0] / 8 * 7) {
      ctx.fillStyle = "rgba(183, 28, 28, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8 * 6) {
      ctx.fillStyle = "rgba(156, 39, 176, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8 * 5) {
      ctx.fillStyle = "rgba(121, 85, 72, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8 * 4) {
      ctx.fillStyle = "rgba(255, 152, 0, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8 * 3) {
      ctx.fillStyle = "rgba(33, 150, 243, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8 * 2) {
      ctx.fillStyle = "rgba(76, 175, 80, 0.5)";
    }
    else if (coverage[i] > coverageLevel[0] / 8) {
      ctx.fillStyle = "rgba(255, 235, 59, 0.5)";
    }
    else {
      ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
    }
    ctx.fill();
    
    ctx.strokeStyle = "#212121";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function drawTransformed() {
  if (scale < 3) {
    canvas.width = scale * viewWidth;
    canvas.height = scale * viewHeight;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);

  if (scale < 3) {
    ctx.drawImage(map, 0, 0);
  }
  else {
    if (sx + viewWidth > map.width) {
      sx = map.width - viewWidth;
      sxGeo = 105;
      sxGeo = mapToGeoX(sx);
    }
    if (sy + viewHeight > map.height) {
      sy = map.height - viewHeight;
      sxGeo = -5;
      syGeo = mapToGeoY(sy);
    }
    ctx.drawImage(map, sx, sy,
      viewWidth, viewHeight, 0, 0, 
      viewWidth, viewHeight
    );
  }

  if (polygons.length) {
    drawPolygons(polygons);
    drawVertices(vertices);
  }

  ctx.restore();
}

map.onload = function() {
  viewWidth = map.width;
  viewHeight = map.height;
  drawTransformed();
  $("#loader").hide(100);
  $("#wrapper").show();
}

fr.onload = function(e) {
  $("#loader").show(100, function(){
    vertices.length = 0;
    polygons.length = 0;

    var data = JSON.parse(fr.result);
    schools = data.schools;

    for (var i = 0; i < schools.length; i++) {
      var vertex = new Vertex(
        schools[i].longitude,
        schools[i].latitude
      );
      vertices.push(vertex);
    }
    var area = data.area;
    area.height *= -1;
    polygons = generateVoronoi(vertices, area);
    
    for (polygon of polygons) {
      polygon.identifyVertices(area);
    }
    coverage = doSampling(polygons, area);

  drawTransformed();
    $("#loader").hide(100);
  });
};

$(document).ready(function() {
  canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  map.src = "data/map.png";
});

$("#schools-input").change(function() {
  var schools_file = $(this)[0].files[0];
  fr.readAsText(schools_file);
});

$("#zoom-in-btn").click(function() {
  if (scale < 2) {
    centerX = window.scrollX + window.innerWidth  / 2;
    centerY = window.scrollY + window.innerHeight / 2;

    if (scale > 1.5) {
      sx = window.scrollX / scale;
      sy = window.scrollY / scale;
      sxGeo = mapToGeoX(sx);
      syGeo = mapToGeoY(sy);
      areaWidth /= 2;
      areaHeight /= 2;
      viewWidth /= 2;
      viewHeight /= 2;
    }

    scale *= 2;
    lineWidth /= 2;

    drawTransformed();

    window.scrollTo(
      centerX * 2 - window.innerWidth  / 2 - sx * scale,
      centerY * 2 - window.innerHeight / 2 - sy * scale
    );
  }
});

$("#zoom-out-btn").click(function() {
  if (scale > 0.2) {
    centerX = window.scrollX + window.innerWidth  / 2;
    centerY = window.scrollY + window.innerHeight / 2;

    if (scale > 3) {
      sxGeo = 105;
      syGeo = -5;
      areaWidth *= 2;
      areaHeight *= 2;
      viewWidth *= 2;
      viewHeight *= 2;
    }

    scale /= 2;
    lineWidth *= 2;    2
    
    drawTransformed();

    window.scrollTo(
      centerX / 2 - window.innerWidth  / 2 + sx * scale,
      centerY / 2 - window.innerHeight / 2 + sy * scale
    );

    if (scale > 3) {
      sx = 0;
      sy = 0;
    }
  }
});