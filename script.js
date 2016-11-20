$(document).ready(function(){
  $("#submitInput").click(function(){
  		var width = $("#width").val();
  		var height = $("#heigth").val();

      var input = $("#input").val().split("\n");;
      for(i in input) {
      	input[i] = input[i].split(" ");
      }
      for(i in input) {
      	for(j in input[i]) {
      		input[i][j] = +input[i][j];
      	}
      }
      drawVoronoi(input, width, height);
  });
})

function drawVoronoi(sites, width, height) {
	var W = +width;
	var H = +height;
	var N = sites.length

	var voronoi = generateVoronoi(W, H, sites);

	var canvas = $("#diagram");
	canvas.attr("width", W);
	canvas.attr("height", H);
	var ctx = canvas[0].getContext("2d");

	ctx.lineWidth = 3;
	ctx.strokeStyle="#000000";
	ctx.strokeRect(0, 0, W, H);

	ctx.fillStyle = "#F44336";
	for(i = 0; i < N; i++) {
		ctx.fillRect(sites[i][0] - 4, sites[i][1] - 4, 9, 9);
	}

	ctx.strokeStyle="#0277BD";
	for(i in voronoi) {
		ctx.moveTo(voronoi[i][0], voronoi[i][1]);
		ctx.lineTo(voronoi[i][2], voronoi[i][3]);
		ctx.stroke();
	}
}