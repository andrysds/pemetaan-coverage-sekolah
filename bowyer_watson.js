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
	this.circum_x = null;
	this.circum_y = null;
	this.circum_rad = null;

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

	this.prosesHV = function(m) {
		if(m[0] == "horizontal") {
			this.circum_y = m[1];
		}
		else {
			this.circum_x = m[1];
		}
	}

	this.calculateCircumcirleCenter = function() {
		var m1 = getPBSlope(this.p, this.q);
		if(m1[0]) {
			this.prosesHV(m1);
			m1 = "hv";
		}
		var m2 = getPBSlope(this.p, this.r);
		if(m2[0]) {
			this.prosesHV(m2);
			m2 = "hv";
		}

		if(m1 != "hv" && m2 != "hv") {
			var c1 = m1 * ((this.p.x + this.q.x) / 2) - ((this.p.y + this.q.y) / 2);
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);

			this.circum_x = (c1 - c2) / (m1 - m2);
			this.circum_y = m1 * this.circum_x - c1;
		}
		else if(m1 == "hv" && m2 != "hv") {
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);
			if(this.circum_y == null) {
				this.circum_y = m2 * this.circum_x - c2;
			}
			else {
				this.circum_x = (this.circum_y + c2) / m2;
			}
		}
		else if(m1 != "hv" && m2 == "hv") {
			var c1 = m1 * ((this.p.x + this.q.x) / 2) - ((this.p.y + this.q.y) / 2);
			if(this.circum_y == null) {
				this.circum_y = m1 * this.circum_x - c1;
			}
			else {
				this.circum_x = (this.circum_y + c1) / m1;
			}
		}

		this.circum_rad = Math.sqrt(Math.pow(this.circum_x - this.p.x, 2) + 
																Math.pow(this.circum_y - this.p.y, 2));
	}

	this.circumcirleContains = function(p) {
		if(this.circum_rad == null) {
			this.calculateCircumcirleCenter();
		}
		
		var dist = Math.sqrt(Math.pow(this.circum_x - p.x, 2) + Math.pow(this.circum_y - p.y, 2));
		return dist <= this.circum_rad;
	}
}

function getPBSlope(a, b) {
	if(a.x == b.x) {
		circum_y = (a.y + b.y) / 2;
		return ["horizontal", circum_y];
	}
	if(a.y == b.y) {
		circum_x = (a.x + b.x) / 2;
		return ["vertical", circum_x];
	}
	return -1 / ((a.y - b.y) / (a.x - b.x));
}

function createSuperTriangle(w, h) {
	var p = new Point(0, 0);
	var q = new Point(0, 2*w);
	var r = new Point(2*h, 0);
	return new Triangle(r, p, q);
}

function BowerWatson(points, super_triangle) {
	var triangulation = [];
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
			var same_count = 0;
			for(k in bad_triangles) {
				if(triangulation[j].isEqual(bad_triangles[k])) {
					same_count++;
				}
			}
			if(same_count == 0) {
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
	for(i in triangulation) {
		if(!(triangulation[i].containsPoint(super_triangle.p) ||
			   triangulation[i].containsPoint(super_triangle.q) ||
			   triangulation[i].containsPoint(super_triangle.r))) {

						result.push(triangulation[i]);
		}
	}
	return result;
}

function generateVoronoi(width, height, input) {
	var W = width;
	var H = height;

	var points = [];
	for(i in input) {
		points.push(new Point(input[i][0], input[i][1]));
	}
	var BW = BowerWatson(points, createSuperTriangle(W, H));

	var voronoi = [];
	var edges = [];
	for(i in BW) {
		edges.push([new Edge(BW[i].p, BW[i].q), new Point(BW[i].circum_x, BW[i].circum_y)]);
		edges.push([new Edge(BW[i].p, BW[i].r), new Point(BW[i].circum_x, BW[i].circum_y)]);
		edges.push([new Edge(BW[i].q, BW[i].r), new Point(BW[i].circum_x, BW[i].circum_y)]);
	}
	edges.sort(function(p, q) {
		if(p[0].isEqual(q[0])) {
			return 0;
		}
		else {
			return 1;
		}
	});

	var i = 0;
	while(i < edges.length) {
		if(i != edges.length-1 && edges[i][0].isEqual(edges[i+1][0])) {
			voronoi.push([
				edges[i][1].x, edges[i][1].y,
				edges[i+1][1].x, edges[i+1][1].y
			]);
			i += 2;
		}
		else {
			var x1 = edges[i][1].x;
			var y1 = edges[i][1].y;
			var x2 = (edges[i][0].a.x + edges[i][0].b.x) / 2;
			var y2 = (edges[i][0].a.y + edges[i][0].b.y) / 2;
			var x3 = null;
			var y3 = null;

			var neighbour = [
				[y2, 'N'],
				[W-x2, 'E'],
				[H-y2, 'S'],
				[x2, 'W']
			];
			neighbour.sort(function(a, b) { return a[0] - b[0]; });

			if(neighbour[0][1] == 'N') {
				y3 = 0;
			}
			else if(neighbour[0][1] == 'E') {
				x3 = W;
			}
			else if(neighbour[0][1] == 'S') {
				y3 = H;
			}
			else {
				x3 = 0;
			}
			
			if(x1 == x2 && y1 == y2) {
				m = getPBSlope(edges[i][0].a, edges[i][0].b);
				c = m * ((edges[i][0].a.x + edges[i][0].b.x) / 2) - 
						((edges[i][0].a.y + edges[i][0].b.y) / 2);
				if(x3 == null) {
					x3 = (y3 + c) / m;
				}
				else {
					y3 = m * x3 - c;
				}
			}
			else {
				if(x3 == null) {
					x3 = (y3 - y1) * (x2 - x1) / (y2 - y1) + x1;
				}
				else {
					y3 = (x3 - x1) * (y2 - y1) / (x2 - x1) + y1;
				}
			}

			voronoi.push([x1, y1, x3, y3]);
			i++;
		}
	}

	return voronoi;
}