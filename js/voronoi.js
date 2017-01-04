function Vertex(x, y) {
	this.x = x;
	this.y = y;

	this.isEqual = function(v) {
		return (this.x == v.x && this.y == v.y);
	}

	this.toString = function() {
		return this.x.toString() + "," + this.y.toString();
	}
}

function Edge(v1, v2) {
	this.v1 = v1;
	this.v2 = v2;

	this.isEqual = function(e) {
		return (this.v1.isEqual(e.v1) && this.v2.isEqual(e.v2)) ||
					 (this.v1.isEqual(e.v2) && this.v2.isEqual(e.v1));
	}
}

function Triangle(vertices, edges) {
	this.vertices = vertices;
	this.edges = edges;

	this.computeCircumcirle = function() {
		var v1 = this.vertices[0];
		var v2 = this.vertices[1];
		var v3 = this.vertices[2];

		var ab = Math.pow(v1.x, 2) + Math.pow(v1.y, 2);
		var cd = Math.pow(v2.x, 2) + Math.pow(v2.y, 2);
		var ef = Math.pow(v3.x, 2) + Math.pow(v3.y, 2);

		this.circum_x = 	(ab * (v3.y - v2.y) + cd * (v1.y - v3.y) + ef * (v2.y - v1.y)) / 
		(v1.x * (v3.y - v2.y) + v2.x * (v1.y - v3.y) + v3.x * (v2.y - v1.y)) / 2;
		this.circum_y = 	(ab * (v3.x - v2.x) + cd * (v1.x - v3.x) + ef * (v2.x - v1.x)) / 
		(v1.y * (v3.x - v2.x) + v2.y * (v1.x - v3.x) + v3.y * (v2.x - v1.x)) / 2;
		return Math.sqrt(Math.pow(v1.x - this.circum_x, 2) + Math.pow(v1.y - this.circum_y, 2));
	}
	this.circumRadius = this.computeCircumcirle();

	this.circumcircleContains = function(v) {
		var dist = Math.sqrt(Math.pow(v.x - this.circum_x, 2) + Math.pow(v.y - this.circum_y, 2));
		return dist <= this.circumRadius;
	}

	this.isEqual = function(t) {
		var v1 = this.vertices;
		var v2 = t.vertices;

		return v1[0].isEqual(v2[0]) && v1[1].isEqual(v2[1]) && v1[2].isEqual(v2[2]) ||
					 v1[0].isEqual(v2[0]) && v1[1].isEqual(v2[2]) && v1[2].isEqual(v2[1]) ||
					 v1[0].isEqual(v2[1]) && v1[1].isEqual(v2[0]) && v1[2].isEqual(v2[2]) ||
					 v1[0].isEqual(v2[1]) && v1[1].isEqual(v2[2]) && v1[2].isEqual(v2[0]) ||
					 v1[0].isEqual(v2[2]) && v1[1].isEqual(v2[0]) && v1[2].isEqual(v2[1]) ||
					 v1[0].isEqual(v2[2]) && v1[1].isEqual(v2[1]) && v1[2].isEqual(v2[0]);
	}

	this.containsVertex = function(v) {
		for (var i in this.vertices) {
			var vertex = this.vertices[i];

			if (v.isEqual(vertex)) {
				return true;
			}
		}
		return false;
	}

	this.containsEdge = function(e) {
		for (var i in this.edges) {
			var edge = this.edges[i];

			if (edge.isEqual(e)) {
				return true;
			}
		}
		return false;
	}
}

function Polygon(vertex) {
	this.id = vertex;
	this.coverage = 0;
	this.vertices = [];
	this.edges = [];

	this.identifyVertices = function() {
		this.vertices.push(
			new Vertex(
				this.edges[0].v1.x,
				this.edges[0].v1.y
			)
		);
		this.vertices.push(
			new Vertex(
				this.edges[0].v2.x,
				this.edges[0].v2.y
			)
		);

	  var used = [];
	  var visit = new Set();

	  for (var j = 0; j < this.edges.length; j++) {
	    var now = this.edges[j].v1;
	    if (visit.has(now.toString())) {
	      visit.delete(now.toString());
	    }
	    else {
	      visit.add(now.toString());
	    }
	    var now = this.edges[j].v2;
	    if (visit.has(now.toString())) {
	      visit.delete(now.toString());
	    }
	    else {
	      visit.add(now.toString());
	    }
	  }

	  if (visit.size) {
	    var arr = [];
	    for (var j of visit) {
	      var coor = j.split(",");
	      arr.push(new Vertex(+coor[0], +coor[1]));
	    }
	    this.edges.push(new Edge(arr[0], arr[1]));
	  }

	  used[0] = true;
	  var now = this.edges[0].v2;

	  for (var j = 1; j < this.edges.length; j++) {
	    for (var k = 1; k < this.edges.length; k++) {
	      if (used[k]) {
	        continue;
	      }
	      if (this.edges[k].v1.isEqual(now)) {
	        now = this.edges[k].v2;
	        this.vertices.push(
	        	new Vertex(now.x, now.y)
	        );
	        used[k] = true;
	        break;
	      }
	      else if (this.edges[k].v2.isEqual(now)) {
	        now = this.edges[k].v1;
	        this.vertices.push(
	        	new Vertex(now.x, now.y)
	        );
	        used[k] = true;
	        break;
	      }
	    }
	  }
	}
}

function identifyArea(vertices) {
	var area = {
		x1: null, y1: null,
		x2: null, y2: null,
		width: null, height: null
	};

	area.x1 = vertices[0].x;
	area.y1 = vertices[0].y;
	area.x2 = vertices[0].x;
	area.y2 = vertices[0].y;

	for (i = 1; i < vertices.length; i++) {
		var vertex = vertices[i];

		if (vertex.x < area.x1) {
			area.x1 = vertex.x;
		}
		else if (vertex.x > area.x2) {
			area.x2 = vertex.x;
		}
		if (vertex.y < area.y1) {
			area.y1 = vertex.y;
		}
		else if (vertex.y > area.y2) {
			area.y2 = vertex.y;
		}
	}

	area.x1 -= 0.1;
	area.y1 -= 0.1;
	area.x2 += 0.1;
	area.y2 += 0.1;
	area.width = area.x2 - area.x1;
	area.height = area.y2 - area.y1;

	return area;
}

function createSuperTriangle(area) {
	var v1 = new Vertex(area.x1, area.y1);
	var v2 = new Vertex(area.x2 + area.width, area.y1);
	var v3 = new Vertex(area.x1, area.y2 + area.height);

	var e1 = new Edge(v1, v2);
	var e2 = new Edge(v1, v3);
	var e3 = new Edge(v2, v3);

	return new Triangle([v1, v2, v3], [e1, e2, e3]);
}

function removeTriangles(triangles, triangulation) {
	var new_triangulation = [];
	for (i in triangulation) {
		var triangle1 = triangulation[i];

		var goodTriangle = true;
		for (j in triangles) {
			var triangle2 = triangles[j];

			if(triangle1.isEqual(triangle2)) {
				goodTriangle = false;
				break;
			}
		}

		if(goodTriangle) {
			new_triangulation.push(triangle1);
		}
	}
	
	return new_triangulation;
}

function validateEdgeByArea(edge, area) {
	var x1 = edge.v1.x;
	var y1 = edge.v1.y;
	var x2 = edge.v2.x;
	var y2 = edge.v2.y;
	
	if (edge.v1.x < area.x1) {
		edge.v1.x = area.x1;
		edge.v1.y = (area.x1 - x1) * (y2 - y1) / (x2 - x1) + y1;
	}
	else if (edge.v1.x > area.x2) {
		edge.v1.x = area.x2;
		edge.v1.y = (area.x2 - x1) * (y2 - y1) / (x2 - x1) + y1;
	}
	if (edge.v1.y < area.y1) {
		edge.v1.x = (area.y1 - y1) * (x2 - x1) / (y2 - y1) + x1;
		edge.v1.y = area.y1;
	}
	else if (edge.v1.y > area.y2) {
		edge.v1.x = (area.y2 - y1) * (x2 - x1) / (y2 - y1) + x1;
		edge.v1.y = area.y2;
	}

	if (edge.v2.x < area.x1) {
		edge.v2.x = area.x1;
		edge.v2.y = (area.x1 - x1) * (y2 - y1) / (x2 - x1) + y1;
	}
	else if (edge.v2.x > area.x2) {
		edge.v2.x = area.x2;
		edge.v2.y = (area.x2 - x1) * (y2 - y1) / (x2 - x1) + y1;
	}
	if (edge.v2.y < area.y1) {
		edge.v2.x = (area.y1 - y1) * (x2 - x1) / (y2 - y1) + x1;
		edge.v2.y = area.y1;
	}
	else if (edge.v2.y > area.y2) {
		edge.v2.x = (area.y2 - y1) * (x2 - x1) / (y2 - y1) + x1;
		edge.v2.y = area.y2;
	}

	return edge;
}

function generateTriangulation(vertices, area) {
	var triangulation = [];

	var super_triangle = createSuperTriangle(area);
	triangulation.push(super_triangle);

	for (var i in vertices) {
		var vertex = vertices[i];

		var bad_triangles = [];

		for (var j in triangulation) {
			var triangle = triangulation[j];

			if (triangle.circumcircleContains(vertex)) {
				bad_triangles.push(triangle);
			}
		}

		polygon = [];
		for (var j in bad_triangles) {
			var triangle1 = bad_triangles[j];

			for (var k = 0; k < 3; k++) {
				var edge = triangle1.edges[k];

				var nice_edge = true;
				for (var l in bad_triangles) {
					var triangle2 = bad_triangles[l];

					if (triangle1 !== triangle2 && triangle2.containsEdge(edge)) {
						nice_edge = false;
						break;
					}
				}
				if (nice_edge) {
					polygon.push(edge);
				}
			}
		}

		triangulation = removeTriangles(bad_triangles, triangulation);

		for (var j in polygon) {
			var edge = polygon[j];

			var v1 = edge.v1;
			var v2 = edge.v2;
			var v3 = vertex;

			var e1 = edge;
			var e2 = new Edge(v2, v3);
			var e3 = new Edge(v3, v1);

			var new_triangle = new Triangle([v1, v2, v3], [e1, e2, e3]);
			triangulation.push(new_triangle);
		}
	}

	return triangulation;
}

function generateVoronoi(vertices, area) {
	var voronoi = {
		edges: [],
		polygons: []
	};

	var super_triangle = createSuperTriangle(area);

	var triangulation = generateTriangulation(vertices, area);

	for (var i in triangulation) {
		var triangle = triangulation[i];

		var edges = triangle.edges;
		for (var j in edges) {
			var edge = edges[j];

			for (var k = +i + 1; k < triangulation.length; k++) {
				var t = triangulation[k];

				if (t.containsEdge(edge) && !(
					super_triangle.containsVertex(edge.v1) ||
					super_triangle.containsVertex(edge.v2) ))
				{
					var newEdge = new Edge(
						new Vertex(triangle.circum_x, triangle.circum_y),
						new Vertex(t.circum_x, t.circum_y)
					);
					voronoi.edges.push(validateEdgeByArea(newEdge, area));

					var v1Flag = false;
					var v2Flag = false;
					for (l in voronoi.polygons) {
						var polygon = voronoi.polygons[l];

						if (polygon.id.isEqual(edge.v1)) {
							polygon.edges.push(newEdge);
							v1Flag = true;
						}
						if (polygon.id.isEqual(edge.v2)) {
							polygon.edges.push(newEdge);
							v2Flag = true;
						}
					}
					if (!v1Flag) {
						var newPolygon = new Polygon(edge.v1);
						newPolygon.edges.push(newEdge);
						voronoi.polygons.push(newPolygon);
					}
					if (!v2Flag) {
						var newPolygon = new Polygon(edge.v2);
						newPolygon.edges.push(newEdge);
						voronoi.polygons.push(newPolygon);
					}
					break;
				}
			}
		}
	}

	return voronoi;
}
