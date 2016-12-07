var canvas;
var ctx;
var pWidth;
var pHeight;

var map;
var schools = [];
var voronoi = [];

var scaleLevel = 0;
var minScale;

$(document).ready(function() {
  canvas = $("#my-canvas")[0];
  ctx = canvas.getContext("2d");

  pWidth  = window.innerWidth;
  pHeight = window.innerHeight;

  map = new Image;
  map.src = "data/maps/jawa.png";

  map.onload = function() {
    $("#loader").hide();
    $("#wrapper").show();

    computeMinimumScale();
    drawTransformed();
  };

  $("input[type=radio][name=data]").change(function() {
    schools = [];
    voronoi = [];

    $.get("data/schools/" + this.value + ".json", function(data) {
      for (var i = 0; i < data.length; i++) {
        var v = new Vertex(data[i].longitude, data[i].latitude);
        schools.push(v);
      }
      voronoi = generateVoronoi(schools, map.width, map.height);

      drawTransformed();
    });
  });

  $("#zoom-in-btn").click(function() {
    var newSF = Math.pow(1.5, scaleLevel) * minScale;
    if (newSF <= 1.5) {
      scaleLevel++;
      pWidth *= 1.5;
      pHeight *= 1.5;
      drawTransformed();
    }
  });

  $("#zoom-out-btn").click(function() {
    if (scaleLevel > 0) {
      scaleLevel--;
      pWidth /= 1.5;
      pHeight /= 1.5;
      drawTransformed();
    }
  });
});

function computeMinimumScale() {
  var sf1 = pWidth / map.width;
  var sf2 = pHeight / map.height;

  if (sf1 > sf2) {
    minScale = sf1;
  }
  else {
    minScale = sf2;
  }
}

function drawTransformed() {
  canvas.width = pWidth;
  canvas.height = pHeight;

  ctx.clearRect(0, 0, pWidth, pHeight);
  ctx.save();

  var scale = minScale * Math.pow(1.5, scaleLevel);
  ctx.scale(scale, scale);
  
  ctx.drawImage(map, 0, 0);
  if (schools.length > 0) {
    drawVertices(schools);
  }
  if (voronoi.length > 0) {
    drawEdges(voronoi);
  }

  ctx.restore();
}

function drawVertices(vertices) {
  ctx.fillStyle = "#F44336";
  for (i in vertices) {
    ctx.beginPath();
    ctx.arc(vertices[i].x, vertices[i].y, 20, 0, Math.PI * 2); 
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(edges) {
  ctx.strokeStyle="#00b3fd";
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  for(i in edges) {
    ctx.beginPath();
    ctx.moveTo(edges[i].v1.x, edges[i].v1.y);
    ctx.lineTo(edges[i].v2.x, edges[i].v2.y);
    ctx.stroke();
  }
}