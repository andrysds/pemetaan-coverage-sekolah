function generateDummies(n, x1, y1, x2, y2) {
	var result = [];

	var dummiesX = [];
  while (dummiesX.length < n){
    var randomnumber = Math.random() * (x2 - x1) + x1;
    if (dummiesX.indexOf(randomnumber) > -1) {
      continue;
    }
    dummiesX[dummiesX.length] = randomnumber;
  }

  var dummiesY = [];
  while (dummiesY.length < n){
    var randomnumber = Math.random() * (y1 - y2) + y2;
    if (dummiesY.indexOf(randomnumber) > -1) {
      continue;
    }
    dummiesY[dummiesY.length] = randomnumber;
  }

  for (var i = 0; i < n; i++) {
  	result.push({
  		"name": "Sekolah " + (i+1),
      "latitude": dummiesY[i],
      "longitude": dummiesX[i]
  	});
  }

  console.log(JSON.stringify(result));
}

generateDummies(50, 107.95715332, -6.43540077, 108.02856445, -6.48452534);