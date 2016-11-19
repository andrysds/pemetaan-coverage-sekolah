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

	this.isEqual = function(t) {
		return this.p.isEqual(t.p) && this.q.isEqual(t.q) && this.r.isEqual(t.r) ||
					 this.p.isEqual(t.p) && this.q.isEqual(t.r) && this.r.isEqual(t.q) ||
					 this.p.isEqual(t.q) && this.q.isEqual(t.p) && this.r.isEqual(t.r) ||
					 this.p.isEqual(t.q) && this.q.isEqual(t.r) && this.r.isEqual(t.p) ||
					 this.p.isEqual(t.r) && this.q.isEqual(t.p) && this.r.isEqual(t.q) ||
					 this.p.isEqual(t.r) && this.q.isEqual(t.q) && this.r.isEqual(t.p);
	}

	this.containsPoint = function(p) {
		return this.p.isEqual(p) || this.q.isEqual(p) || this.r.isEqual(p);
	}

	this.hasEdge = function(e) {
		return e.isEqual(new Edge(this.p, this.q)) || 
					 e.isEqual(new Edge(this.p, this.r)) || 
					 e.isEqual(new Edge(this.q, this.r));
	}

	this.getPBSlope = function(a, b) {
		if(a.x == b.x) {
			this.circum_y = (a.y + b.y) / 2;
			return "HV"
		}
		if(a.y == b.y) {
			this.circum_x = (a.x + b.x) / 2;
			return "HV"
		}
		return -1 / ((a.y - b.y) / (a.x - b.x));
	}

	this.calculateCircumcirleCenter = function() {
		var m1 = this.getPBSlope(this.p, this.q);
		var m2 = this.getPBSlope(this.p, this.r);

		if(m1 != "HV" && m2 != "HV") {
			var c1 = m1 * ((this.p.x + this.q.x) / 2) - ((this.p.y + this.q.y) / 2);
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);

			this.circum_x = (c1 - c2) / (m1 - m2);
			this.circum_y = m1 * this.circum_x - c1;
		}
		else if(m1 == "HV" && m2 != "HV") {
			var c2 = m2 * ((this.p.x + this.r.x) / 2) - ((this.p.y + this.r.y) / 2);
			if(this.circum_y == null) {
				this.circum_y = m2 * this.circum_x - c2;
			}
			else {
				this.circum_x = (this.circum_y + c2) / m2;
			}
		}
		else if(m1 != "HV" && m2 == "HV") {
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

function createSuperTriangle(w, h) {
	var p = new Point(0, 0);
	var q = new Point(0, 2*w);
	var r = new Point(2*h, 0);
	return new Triangle(r, p, q);
}

function BowerWatson(points, super_triangle) {
	var triangulation = new Array();
	triangulation.push(super_triangle);

	for(i in points) {
		var bad_triangles = new Array();
		for(j in triangulation) {
			if(triangulation[j].circumcirleContains(points[i])) {
				bad_triangles.push(triangulation[j]);
			}
		}

		var polygon = new Array();
		for(j in bad_triangles) {
			var edges = Array(
				new Edge(bad_triangles[j].p, bad_triangles[j].q),
				new Edge(bad_triangles[j].p, bad_triangles[j].r),
				new Edge(bad_triangles[j].q, bad_triangles[j].r)
			);

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

		var new_triangulation = new Array();
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

	var result = new Array();
	for(i in triangulation) {
		if(!(triangulation[i].containsPoint(super_triangle.p) ||
			   triangulation[i].containsPoint(super_triangle.q) ||
			   triangulation[i].containsPoint(super_triangle.r))) {

						result.push(triangulation[i]);
		}
	}
	return result;
}