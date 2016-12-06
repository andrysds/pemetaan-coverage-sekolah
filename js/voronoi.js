function Vertex (x, y) {
	this.x = x;
	this.y = y;

	this.isEqual = function(v) {
		return (this.x == v.x && this.y == v.y);
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
	this.neighbours = [null, null, null];

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

function createSuperTriangle(width, height) {
	var v1 = new Vertex(-1, -height-1);
	var v2 = new Vertex(width * 2 + 1, height / 2);
	var v3 = new Vertex(-1, height * 2 + 1);

	var e1 = new Edge(v1, v2);
	var e2 = new Edge(v1, v3);
	var e3 = new Edge(v2, v3);

	return new Triangle([v1, v2, v3], [e1, e2, e3]);
}

function removeTriangles(triangles, triangulation) {
	var new_triangulation = [];
	for(i in triangulation) {
		var triangle1 = triangulation[i];

		var goodTriangle = true;
		for(j in triangles) {
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

function generateTriangulation(points, width, height) {
	var triangulation = [];

	var super_triangle = createSuperTriangle(width, height);
	triangulation.push(super_triangle);

	for (var i in points) {
		var point = points[i];

		var bad_triangles = [];

		for (var j in triangulation) {
			var triangle = triangulation[j];

			if (triangle.circumcircleContains(point)) {
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
			var v3 = point;

			var e1 = edge;
			var e2 = new Edge(v2, v3);
			var e3 = new Edge(v3, v1);

			var new_triangle = new Triangle([v1, v2, v3], [e1, e2, e3]);
			triangulation.push(new_triangle);
		}
	}

	return triangulation;
}

function generateVoronoi(points, width, height) {
	var voronoiEdges = [];

	var super_triangle = createSuperTriangle(width, height);

	var triangulation = generateTriangulation(points, width, height);

	for (var i in triangulation) {
		var triangle = triangulation[i];

		var edges = triangle.edges;
		for (var j in edges) {
			var edge = edges[j];

			for (var k = +i + 1; k < triangulation.length; k++) {
				var t = triangulation[k];

				if (t.containsEdge(edge) && !(
						super_triangle.containsVertex(edge.v1) ||
						super_triangle.containsVertex(edge.v2) )) {

					voronoiEdges.push(new Edge(
						new Vertex(triangle.circum_x, triangle.circum_y),
						new Vertex(t.circum_x, t.circum_y)
						));
					break;
				}
			}
		}
	}

	return voronoiEdges;
}
