var ctx;

$(document).ready(function() {
		ctx = document.getElementById("myCanvas").getContext("2d");
    
    var map = new Image;
		map.src = "data/maps/jawa.png";
		map.onload = function() {
			ctx.drawImage(map, 0, 0);
			
    	$.get("data/schools/jawa.json", function(data) {
		    var schools = [];
		    for (var i = 0; i < 200; i++) {
		      schools.push(new Vertex(data[i].longitude, data[i].latitude));
		    }
		    drawVertices(ctx, schools);
		  });
		}
});