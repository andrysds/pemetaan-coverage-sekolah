$(document).ready(function(){
    $("#sumbitInput").click(function(){
        var input = $("#input").val().split("\n");;
        for (i in input) {
        	input[i] = input[i].split(" ");
        }
        // console.log(input);
        drawVoronoi(input);
    });
})

function drawVoronoi(input) {
	var W = input[0][0];
	var H = input[0][1];

	var canvas = $("#myCanvas");
	canvas.attr("width", W);
	canvas.attr("height", H);
	var ctx = canvas[0].getContext("2d");

	ctx.fillStyle = "#ffc";
	ctx.clearRect(0, 0, W, H);
	ctx.fillRect(0, 0, W, H);

	var n = input[1][0];
	for(i = 0; i < n; i++) {
		coor = input[i+2];
		ctx.fillStyle = "#000";
		ctx.fillRect(coor[0], coor[1], 10, 10);
	}

	var m = input[+n+2][0];
	for(i = 0; i < m; i++) {
		coor = input[+n+i+3];
		ctx.moveTo(coor[0], coor[1]);
		ctx.lineTo(coor[2], coor[3]);
		ctx.stroke();
	}
}