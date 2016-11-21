function Point(x, y) {
	this.x = x;
	this.y = y;

	this.isEqual = function(p) {
		return this.x == p.x && this.y == p.y;
	}
}

function Edge(a, b) {
	this.a = a;
	this.b = b;

	this.isEqual = function(e) {
		return this.a.isEqual(e.a) && this.b.isEqual(e.b) || 
					 this.a.isEqual(e.b) && this.b.isEqual(e.a);
	}
}

function Triangle(p, q, r) {
	this.p = p;
	this.q = q;
	this.r = r;

	this.containsPoint = function(p) {
		return this.p.isEqual(p) || this.q.isEqual(p) || this.r.isEqual(p);
	}

	this.hasEdge = function(e) {
		return e.isEqual(new Edge(this.p, this.q)) || 
					 e.isEqual(new Edge(this.p, this.r)) || 
					 e.isEqual(new Edge(this.q, this.r));
	}

	this.isEqual = function(t) {
		return this.p.isEqual(t.p) && this.q.isEqual(t.q) && this.r.isEqual(t.r) ||
					 this.p.isEqual(t.p) && this.q.isEqual(t.r) && this.r.isEqual(t.q) ||
					 this.p.isEqual(t.q) && this.q.isEqual(t.p) && this.r.isEqual(t.r) ||
					 this.p.isEqual(t.q) && this.q.isEqual(t.r) && this.r.isEqual(t.p) ||
					 this.p.isEqual(t.r) && this.q.isEqual(t.p) && this.r.isEqual(t.q) ||
					 this.p.isEqual(t.r) && this.q.isEqual(t.q) && this.r.isEqual(t.p);
	}

	this.calculateCircumcirleCenter = function() {
		var x;
		var y;

		var m1 = getPBSlope(this.p, this.q);
		if(m1[0]) {
			if(m1[0] == "horizontal") {
				y = m1[1];
			}
			else {
				x = m1[1];
			}
			m1 = "hv";
		}
		var m2 = getPBSlope(this.p, this.r);
		if(m2[0]) {
			if(m2[0] == "horizontal") {
				y = m2[1];
			}
			else {
				x = m2[1];
			}
			m2 = "hv";
		}

		if(m1 != "hv" && m2 != "hv") {
			var c1 = m1 * ((this.p.x + this.q.x) / 2) - ((this.p.y + this.q.y) / 2);
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);

			x = (c1 - c2) / (m1 - m2);
			y = m1 * x - c1;
		}
		else if(m1 == "hv" && m2 != "hv") {
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);
			if(!y) {
				y = m2 * x - c2;
			}
			else {
				x = (y + c2) / m2;
			}
		}
		else if(m1 != "hv" && m2 == "hv") {
			var c1 = m1 * ((this.p.x + this.q.x) / 2) - ((this.p.y + this.q.y) / 2);
			if(!y) {
				y = m1 * x - c1;
			}
			else {
				x = (y + c1) / m1;
			}
		}

		return new Point(x, y);
	}

	this.calculateCircumcirleRadius = function() {
		return Math.sqrt(Math.pow(this.circumcircle_center.x - this.p.x, 2) + 
					 Math.pow(this.circumcircle_center.y - this.p.y, 2));
	}

	this.circumcircle_center = this.calculateCircumcirleCenter();
	this.circumcircle_radius = this.calculateCircumcirleRadius();

	this.circumcirleContains = function(p) {
		var dist = Math.sqrt(Math.pow(this.circumcircle_center.x - p.x, 2) + 
							 Math.pow(this.circumcircle_center.y - p.y, 2));
		return dist <= this.circumcircle_radius;
	}
}

function getPBSlope(a, b) {
	if(a.x == b.x) {
		y = (a.y + b.y) / 2;
		return ["horizontal", y];
	}
	if(a.y == b.y) {
		x = (a.x + b.x) / 2;
		return ["vertical", x];
	}
	return -1 / ((a.y - b.y) / (a.x - b.x));
}

function isBadVoronoiEdge(e, width, height) {
	super_triangle = createSuperTriangle(width, height);
	return super_triangle.containsPoint(e.a) || 
				 super_triangle.containsPoint(e.b);
}

function createSuperTriangle(width, height) {
	var p = new Point(0, 0);
	var q = new Point(0, 2*height);
	var r = new Point(2*width, 0);
	return new Triangle(r, p, q);
}

function generateTriangulation(sites, width, height) {
	var points = [];
	for(i in sites) {
		points.push(new Point(sites[i][0], sites[i][1]));
	}

	var triangulation = [];
  var super_triangle = createSuperTriangle(width, height);
	triangulation.push(super_triangle);

	for(i in points) {
		var bad_triangles = [];
		for(j in triangulation) {
			if(triangulation[j].circumcirleContains(points[i])) {
				bad_triangles.push(triangulation[j]);
			}
		}

		var polygon = [];
		for(j in bad_triangles) {
			var edges = [
				new Edge(bad_triangles[j].p, bad_triangles[j].q),
				new Edge(bad_triangles[j].p, bad_triangles[j].r),
				new Edge(bad_triangles[j].q, bad_triangles[j].r)
			];

			for(k in edges) {
				var share_count = 0;
				for(l in bad_triangles) {
					if(bad_triangles[l].hasEdge(edges[k])) {
						share_count++;
					}
				}
				if(share_count == 1) {
					polygon.push(edges[k]);
				}
			}
		}

		var new_triangulation = [];
		for(j in triangulation) {
			var goodTriangle = true;
			for(k in bad_triangles) {
				if(triangulation[j].isEqual(bad_triangles[k])) {
					goodTriangle = false;
					break;
				}
			}
			if(goodTriangle) {
				new_triangulation.push(triangulation[j]);
			}
		}
		triangulation = new_triangulation;
		
		for(j in polygon) {
			var new_triangle = new Triangle(points[i], polygon[j].a, polygon[j].b);
			new_triangle.calculateCircumcirleCenter();
			triangulation.push(new_triangle);
		}
	}

	var result = [];
	var st_edges = [
		new Edge(super_triangle.p, super_triangle.q),
		new Edge(super_triangle.p, super_triangle.r),
		new Edge(super_triangle.q, super_triangle.r)
	];
	for(i in triangulation) {
		var goodTriangle = true;
		for(j in st_edges) {
			if(triangulation[i].hasEdge(st_edges[j])) {
				goodTriangle = false;
				break;
			}
		}
		if(goodTriangle) {
			result.push(triangulation[i]);
		}
	}

	return result;
}

function generateVoronoi(sites, width, height) {
	var T = generateTriangulation(sites, width, height);

	var voronoi = [];

	for(i in T) {
		var edges = [
			new Edge(T[i].p, T[i].q),
			new Edge(T[i].p, T[i].r),
			new Edge(T[i].q, T[i].r)
		];

		for(j = +i+1; j < T.length; j++) {
			for(k in edges) {
				if(T[j].hasEdge(edges[k]) && !isBadVoronoiEdge(edges[k], width, height)) {
					voronoi.push([
						T[i].circumcircle_center.x,
						T[i].circumcircle_center.y,
						T[j].circumcircle_center.x,
						T[j].circumcircle_center.y,
					]);
				}
			}
		}
	}

	return voronoi;
}