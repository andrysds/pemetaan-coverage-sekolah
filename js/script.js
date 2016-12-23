var canvas;
var ctx;
var map = new Image();

var scale = 0.11;
var lineWidth = 10;
var centerX;
var centerY;

var x1 = 105;
var y1 = -5;
var areaWidth = 10;
var areaHeight = 5;
var viewWidth;
var viewHeight;
var sx = 0;
var sy = 0;

var schools;
var fr = new FileReader();

var vertices = [];
var edges = [];
var polygons = [];

function geoToMapX(x) {
  return (x - x1) * viewWidth / areaWidth;
}

function geoToMapY(y) {
  return (y1 - y) * viewHeight / areaHeight;
}

function mapToGeoX(x) {
  return (x * areaWidth / viewWidth) + x1;
}

function mapToGeoY(y) {
  return y1 - (y * areaHeight / viewHeight);
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
  ctx.strokeStyle = "#00b3fd";
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
  for (var i in polygons) {
    var polygon = polygons[i];

    ctx.fillStyle = "#F44336";
    ctx.strokeStyle = "#00b3fd";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(
      geoToMapX(polygon.edges[0].v1.x),
      geoToMapY(polygon.edges[0].v1.y)
    );
    ctx.lineTo(
      geoToMapX(polygon.edges[0].v2.x),
      geoToMapY(polygon.edges[0].v2.y)
    );

    var used = [];
    var visit = new Set();

    for (var j = 0; j < polygon.edges.length; j++) {
      var now = polygon.edges[j].v1;
      if (visit.has(now.toString())) {
        visit.delete(now.toString());
      }
      else {
        visit.add(now.toString());
      }
      var now = polygon.edges[j].v2;
      if (visit.has(now.toString())) {
        visit.delete(now.toString());
      }
      else {
        visit.add(now.toString());
      }
    }

    if (visit.size) {
      var arr = [];
      for (var j of visit) {
        var coor = j.split(",");
        arr.push(new Vertex(coor[0], coor[1]));
      }
      polygon.edges.push(new Edge(arr[0], arr[1]));
    }

    used[0] = true;
    var now = polygon.edges[0].v2;

    for (var j = 1; j < polygon.edges.length; j++) {
      for (var k = 1; k < polygon.edges.length; k++) {
        if (used[k]) {
          continue;
        }
        if (polygon.edges[k].v1.isEqual(now)) {
          now = polygon.edges[k].v2;
          ctx.lineTo(
            geoToMapX(now.x),
            geoToMapY(now.y)
          );
          used[k] = true;
          break;
        }
        else if (polygon.edges[k].v2.isEqual(now)) {
          now = polygon.edges[k].v1;
          ctx.lineTo(
            geoToMapX(now.x),
            geoToMapY(now.y)
          );
          used[k] = true;
          break;
        }
      }
    }
    ctx.fill();
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
      x1 = 105;
      x1 = mapToGeoX(sx);
    }
    if (sy + viewHeight > map.height) {
      sy = map.height - viewHeight;
      x1 = -5;
      y1 = mapToGeoY(sy);
    }
    ctx.drawImage(map, sx, sy,
      viewWidth, viewHeight, 0, 0, 
      viewWidth, viewHeight
    );
  }

  if (edges.length > 0) {
    drawPolygons(polygons);
    // drawVertices(vertices);
    drawEdges(edges);
  }
  ctx.restore();
}

map.onload = function() {
  viewWidth = map.width;
  viewHeight = map.height;

  drawTransformed();

  $("#loader").hide();
  $("#wrapper").show();
}

fr.onload = function(e) {
  vertices.length = 0;
  edges.length = 0;

  schools = JSON.parse(fr.result);
  for (var i = 0; i < schools.length; i++) {
    var vertex = new Vertex(
      schools[i].longitude,
      schools[i].latitude
    );
    vertices.push(vertex);
  }
  var voronoi = generateVoronoi(vertices);
  edges = voronoi.edges;
  polygons = voronoi.polygons;

  drawTransformed();
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
      x1 = mapToGeoX(sx);
      y1 = mapToGeoY(sy);
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
      x1 = 105;
      y1 = -5;
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