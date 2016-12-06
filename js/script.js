$(document).ready(function() {
		var ctx = document.getElementById("myCanvas").getContext("2d");
    
    var map = new Image;
		map.src = "data/maps/jawa.png";
		map.onload = function() {
			ctx.drawImage(map, 0, 0);
			
    	$.get("data/schools/jawa.json", function(data) {
		    var schools = [];
		    for (var i = 0; i < 200; i++) {
		      schools.push(new Vertex(data[i].longitude, data[i].latitude));
		    }

		    var voronoi = generateVoronoi(schools, 120001, 6001);
		    drawVertices(ctx, schools);
		    drawEdges(ctx, voronoi);
		  });
		}
});

function drawVertices(ctx, vertices) {
  ctx.fillStyle = "#F44336";
  for (i in vertices) {
    ctx.beginPath();
    ctx.arc(vertices[i].x, vertices[i].y, 20, 0, Math.PI * 2); 
    ctx.closePath();
    ctx.fill();
  }
}

function drawEdges(ctx, edges) {
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
