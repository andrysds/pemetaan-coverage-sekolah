function geoToMapX(x) {
  return (x - 105) * 1200.2;
}

function geoToMapY(y) {
  return (-5 - y) * 1200.2;
}

console.log(geoToMapX(112.760925), geoToMapY(-7.262801));
console.log();

console.log(geoToMapX(112.859888), geoToMapY(-7.313822));
console.log();

console.log(geoToMapX(115), geoToMapY(-10));
console.log();
