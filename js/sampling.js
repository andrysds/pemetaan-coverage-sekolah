function doSampling(polygons, area) {
  var samples = [];
  var n = polygons.length * 500;

  var samplesX = [];
  while (samplesX.length < n){
    var randomnumber = Math.random() * (area.x2 - area.x1) + area.x1;
    if (samplesX.indexOf(randomnumber) > -1) {
      continue;
    }
    samplesX[samplesX.length] = randomnumber;
  }

  var samplesY = [];
  while (samplesY.length < n){
    var randomnumber = Math.random() * (area.y1 - area.y2) + area.y2;
    if (samplesY.indexOf(randomnumber) > -1) {
      continue;
    }
    samplesY[samplesY.length] = randomnumber;
  }

  var sum = [];
  var sumLength = [];
  for (var i = 0; i < polygons.length; i++) {
    sum[i] = 0;
    sumLength[i] = 0;
  }

  for (var i = 0; i < n; i++) {
    var min = Math.sqrt(
      Math.pow(polygons[0].id.x - samplesX[i], 2) +
      Math.pow(polygons[0].id.y - samplesY[i], 2)
    );
    var index = 0;
    for (var j in polygons) {
      var distance = Math.sqrt(
        Math.pow(polygons[j].id.x - samplesX[i], 2) +
        Math.pow(polygons[j].id.y - samplesY[i], 2)
      );
      if (distance < min) {
        min = distance;
        index = j;
      }
    }
    sum[index] += min;
    sumLength[index]++;
  }

  var result = [];
  for (var i = 0; i < polygons.length; i++) {
    if (sumLength[i]) {
      result[i] = sum[i] / sumLength[i];
    }
    else {
      result[i] = 0;
    }
  }

  return result;
}