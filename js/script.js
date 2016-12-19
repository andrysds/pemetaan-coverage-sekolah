var canvas;
var ctx;
var scaleLevel = 0.12;
var lineWidth = 10;
var map = new Image();

var schools;
var fr = new FileReader();

var vertices = [];
var edges = [];

function drawVertices(vertices) {
  ctx.fillStyle = "#F44336";
  for (i in vertices) {
    ctx.beginPath();
    ctx.arc(vertices[i].x, vertices[i].y, lineWidth * 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(edges) {
  ctx.strokeStyle = "#00b3fd";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  for(i in edges) {
    ctx.beginPath();
    ctx.moveTo(edges[i].v1.x, edges[i].v1.y);
    ctx.lineTo(edges[i].v2.x, edges[i].v2.y);
    ctx.stroke();
  }
}

function drawTransformed() {
  canvas.width = scaleLevel * map.width;
  canvas.height = scaleLevel * map.height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scaleLevel, scaleLevel);
  ctx.drawImage(map, 0, 0);
  if (edges.length > 0) {
    drawVertices(vertices);
    drawEdges(edges);
  }
  ctx.restore();
}

map.onload = function() {
  drawTransformed();

  $("#loader").hide();
  $("#wrapper").show();
}

fr.onload = function(e) {
  vertices.length = 0;
  edges.length = 0;

  schools = JSON.parse(fr.result);

  console.log(schools);

  for (var i = 0; i < schools.length; i++) {
    var vertex = new Vertex(
      geoToMapX(schools[i].longitude),
      geoToMapY(schools[i].latitude)
    );
    vertices.push(vertex);
  }
  edges = generateVoronoi(vertices, map.width, map.height);

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
  if (scaleLevel < 1.5) {
    scaleLevel *= 2;
    lineWidth /= 2;
    drawTransformed();
  }
});

$("#zoom-out-btn").click(function() {
  if (scaleLevel > 0.2) {
    scaleLevel /= 2;
    lineWidth *= 2;
    drawTransformed();
  }
});

function geoToMapX(x) {
  return (x - 105) * 1200.2;
}

function geoToMapY(y) {
  return (-5 - y) * 1200.2;
}