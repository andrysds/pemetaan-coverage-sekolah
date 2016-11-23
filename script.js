$(document).ready(function(){
  $("#submitInput").click(function(){
  		var width = $("#width").val();
  		var height = $("#heigth").val();

      var input = $("#input").val().split("\n");;
      for (i in input) {
      	input[i] = input[i].split(" ");
      }

      if (input[0] == "T") {
      	input.shift();
      	var vertices = convertToVertices(input);
	      var triangles = generateTriangulation(vertices, width, height);
	      var edges = [];
	      console.log(triangles);
	      for (i in triangles) {
	      	edges = edges.concat(triangles[i].edges);
	      }
	      drawDiagram(height, width, height, vertices, edges);
      }
      else {

	      var vertices = convertToVertices(input);
	      var edges = generateVoronoi(vertices, width, height);
	      drawDiagram(height, width, height, vertices, edges);

    	}
  });
})

function drawDiagram(height, width, height, vertices, edges) {
	var canvas = $("#diagram");
	var ctx = prepareCanvas(canvas, width, height);
  drawEdges(ctx, edges);
  drawVertices(ctx, vertices);
  borderArea(ctx, width, height);
}

function convertToVertices(input) {
	var vertices = [];
	for(i in input) {
		vertices.push(new Vertex(+input[i][0], +input[i][1]));
  }
  return vertices;
}

function prepareCanvas(canvas, width, height) {
	canvas.attr("width", width);
	canvas.attr("height", height);

	var ctx = canvas[0].getContext("2d");
	ctx.clearRect(0, 0, width, height);
	return ctx;
}

function drawVertices(ctx, vertices) {
	ctx.fillStyle = "#F44336";
	for (i in vertices) {
		ctx.beginPath();
		ctx.arc(vertices[i].x, vertices[i].y, 5, 0, Math.PI * 2); 
		ctx.closePath();
		ctx.fill();
	}
}

function drawEdges(ctx, edges) {
	ctx.strokeStyle="#0277BD";
	ctx.lineWidth = 3;
	ctx.lineCap = 'round';
	for(i in edges) {
		ctx.beginPath();
		ctx.moveTo(edges[i].v1.x, edges[i].v1.y);
		ctx.lineTo(edges[i].v2.x, edges[i].v2.y);
		ctx.stroke();
	}
}

function borderArea(ctx, width, height) {
	ctx.strokeStyle="#000000";
	ctx.lineWidth = 3;
	ctx.strokeRect(0, 0, width, height);
}