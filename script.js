$(document).ready(function(){
  $("#sumbitInput").click(function(){
      var input = $("#input").val().split("\n");;
      for(i in input) {
      	input[i] = input[i].split(" ");
      }
      for(i in input) {
      	for(j in input[i]) {
      		input[i][j] = +input[i][j];
      	}
      }
      drawVoronoi(input);
  });
})

function drawVoronoi(input) {
	var W = input[0][0];
	var H = input[0][1];
	var N = input[1][0];
	input.shift();
	input.shift();

	console.log(input);

	var voronoi = generateVoronoi(W, H, input);
	console.log(voronoi.length);
	for(i in voronoi) {
		console.log(voronoi[i][0] + " " + voronoi[i][1] + 
					" " + voronoi[i][2] + " " + voronoi[i][3]);
	}

	var canvas = $("#myCanvas");
	canvas.attr("width", W);
	canvas.attr("height", H);
	var ctx = canvas[0].getContext("2d");

	ctx.fillStyle = "#ffc";
	ctx.clearRect(0, 0, W, H);
	ctx.fillRect(0, 0, W, H);

	for(i = 0; i < N; i++) {
		ctx.fillStyle = "#000";
		ctx.fillRect(input[i][0]-4, input[i][1]-4, 9, 9);
	}

	for(i in voronoi) {
		ctx.moveTo(voronoi[i][0], voronoi[i][1]);
		ctx.lineTo(voronoi[i][2], voronoi[i][3]);
		ctx.stroke();
	}
}