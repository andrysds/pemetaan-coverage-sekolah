$(document).ready(function(){
  $("#submitInput").click(function(){
  		var width = $("#width").val();
  		var height = $("#heigth").val();

      var input = $("#input").val().split("\n");;
      for(i in input) {
      	input[i] = input[i].split(" ");
      }

      if(input[0] == "T") {
      	input.shift();
      	stringToNum(input);
      	drawTriangulation(input, width, height);
      }
      else {
      	stringToNum(input);
      	drawVoronoi(input, width, height);
      }
  });
})

function stringToNum(strings) {
	for(i in strings) {
  	for(j in strings[i]) {
  		strings[i][j] = +strings[i][j];
  	}
  }
}

function prepareCanvas(canvas, width, height) {
	canvas.attr("width", width);
	canvas.attr("height", height);
	var context = canvas[0].getContext("2d");

	context.clearRect(0, 0, width, height);

	return context;
}

function borderArea(context, width, height) {
	context.lineWidth = 3;
	context.strokeStyle="#000000";
	context.strokeRect(0, 0, width, height);
}

function drawSites(context, sites) {
	var N = sites.length;
	context.fillStyle = "#F44336";
	for(i = 0; i < N; i++) {
		context.fillRect(sites[i][0] - 4, sites[i][1] - 4, 9, 9);
	}
}

function drawEdges(context, edges) {
	context.lineWidth = 3;
	context.strokeStyle="#0277BD";
	for(i in edges) {
		context.beginPath();
		context.moveTo(edges[i][0], edges[i][1]);
		context.lineTo(edges[i][2], edges[i][3]);
		context.stroke();
		context.closePath();
	}
}

function drawVoronoi(sites, width, height) {
	var W = +width;
	var H = +height;

	var edges = generateVoronoi(sites, W, H);

	var canvas = $("#diagram");
	var context = prepareCanvas(canvas, W, H);
	drawEdges(context, edges);
	drawSites(context, sites);
	borderArea(context, width, height);
}

function drawTriangulation(sites, width, height) {
	var W = +width;
	var H = +height;

	var T = generateTriangulation(sites, W, H);
	var edges = [];
	for(i in T) {
		edges.push([T[i].p.x, T[i].p.y, T[i].q.x, T[i].q.y]);
		edges.push([T[i].p.x, T[i].p.y, T[i].r.x, T[i].r.y]);
		edges.push([T[i].q.x, T[i].q.y, T[i].r.x, T[i].r.y]);
	}
	console.log(edges);

	var canvas = $("#diagram");
	var context = prepareCanvas(canvas, W, H);
	drawEdges(context, edges);
	drawSites(context, sites);
	borderArea(context, width, height);
}