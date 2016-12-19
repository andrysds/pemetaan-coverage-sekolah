var canvas;
var ctx;

var map = new Image();
var data;

var pWidth;
var pHeight;

var vertices = [];
var edges = [];

var scale;
var scaleLevel = 0;
var fillScale;

$(document).ready(function() {
  canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");

  pWidth  = window.innerWidth;
  pHeight = window.innerHeight;

  $("#submit-btn").click(function() {
    $("#input-data").hide();
    $("#loader").show();

    var mfr = new FileReader();
    mfr.onload = function(e) {
      map.src = mfr.result;
      map.onload = function() {
        computeFillScale();

        var sfr = new FileReader();
        sfr.onload = function(e) {
          data = JSON.parse(sfr.result);

          var schools = data.schools;
          for (var i = 0; i < schools.length; i++) {
            var vertex = new Vertex(
              geoToMapX(schools[i].longitude),
              geoToMapY(schools[i].latitude)
            );
            vertices.push(vertex);
          }
          edges = generateVoronoi(vertices, map.width, map.height);

          drawTransformed();

          $("#loader").hide();
          $("#mycanvas").show();
        };

        var schools_file = $("#schools-input")[0].files[0];
        sfr.readAsText(schools_file);
      };
    }

    var map_file = $("#map-input")[0].files[0];
    mfr.readAsDataURL(map_file);
  });

  $("#zoom-in-btn").click(function() {
    scaleLevel++;
    pWidth *= 1.5;
    pHeight *= 1.5;
    scale = fillScale * Math.pow(1.5, scaleLevel);
    drawTransformed();
  });

  $("#zoom-out-btn").click(function() {
    scaleLevel--;
    pWidth /= 1.5;
    pHeight /= 1.5;
    scale = fillScale * Math.pow(1.5, scaleLevel);
    drawTransformed();
  });
});

function computeFillScale() {
  var sf1 = pWidth / map.width;
  var sf2 = pHeight / map.height;

  if (sf1 < sf2) {
    fillScale = sf1;
    scale = fillScale;
    pHeight = fillScale * map.height;
  }
  else {
    fillScale = sf2;
    scale = fillScale;
    pWidth = fillScale * map.width;
  }
}

function drawTransformed() {  
  canvas.width = pWidth;
  canvas.height = pHeight;
  ctx.clearRect(0, 0, map.width, map.height);

  ctx.save();
  ctx.scale(scale, scale);
  ctx.drawImage(map, 0, 0);
  drawVertices(vertices);
  drawEdges(edges);
  ctx.restore();
}

function drawVertices(vertices) {
  ctx.fillStyle = "#F44336";
  for (i in vertices) {
    ctx.beginPath();
    ctx.arc(vertices[i].x, vertices[i].y, 1 / scale * 3, 0, Math.PI * 2); 
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(edges) {
  ctx.strokeStyle = "#00b3fd";
  ctx.lineWidth = 1 / scale * 2;
  ctx.lineCap = 'round';
  for(i in edges) {
    ctx.beginPath();
    ctx.moveTo(edges[i].v1.x, edges[i].v1.y);
    ctx.lineTo(edges[i].v2.x, edges[i].v2.y);
    ctx.stroke();
  }
}

function geoToMapX(x) {
  return (x - data.area.x) * map.width / data.area.width;
}

function geoToMapY(y) {
  return (data.area.y - y) * map.height / data.area.height;
}