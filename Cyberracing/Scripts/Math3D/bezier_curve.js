/**
 * Created by tom on 2017-02-20.
 */

function BezierCurveEndpoint(endpoint, cp1, cp2) {
    this.endpoint = endpoint || Vector3.zero;
    this.cp1 = cp1 || Vector3.backward.add(this.endpoint);
    if(!cp2 || !endpoint.sub(cp1).normalized. epsEqual (cp2.sub(cp1).normalized)) {
        cp2 = endpoint.add(endpoint.sub(cp1));
    }
    this.cp2 = cp2;
}

function BezierCurveSegment(endpoint1, endpoint2) {
    this.start = endpoint1.endpoint;
    this.cp1 = endpoint1.cp2;
    this.cp2 = endpoint2.cp1;
    this.end = endpoint2.endpoint;
}
BezierCurveSegment.defineProperties({
    val: {
        value: function (t) {
            t = clamp(t, 0, 1);
            let p1 = this.start;
            let p2 = this.cp1;
            let p3 = this.cp2;
            let p4 = this.end;

            let t1 = 1-t;
            let t1t1 = t1*t1;
            let tt = t*t;
            let t1t = t1*t;

            return this.p1.mult(t1t1*t1) .add (this.p2.mult(3*t1t1*t)) .add (this.p3.mult(3*t1*tt)) .add (this.p4.mult(tt*t));
        }
    },

    length: {
        value: function (eps) {
            eps = eps || 1e-6;

            let calculateLength = function (segment, divisions) {
                let length = 0;
                let x = linspace(0, maxT, divisions);
                let pts = [];
                for(let val of x) {
                    pts.push(segment.val(val));
                }
                for(let i = 1; i < pts.length; i++) {
                    length += pts[i].sub(pts[i-1]).length;
                }
                return length;
            };

            let oldLength = Number.MAX_VALUE;
            let divs = 2;
            let length = calculateLength(this, divs);
            for(let ctr = 0; Math.abs(length - oldLength) > eps; ctr++) {

                oldLength = length;
                length = calculateLength(this, 2 * divs);

                if(ctr > 10000) {
                    console.log("bezier length timeout!");
                    break;
                }
            }
            return length;
        }
    },

    tangent: {
        value: function (t) {
            t = clamp(t, 0, 1);
            let p1 = this.start;
            let p2 = this.cp1;
            let p3 = this.cp2;
            let p4 = this.end;

            let t1 = 1 - t;

            return p2.sub(p1).mult(t1 * t1).
                add(p3.sub(p2).mult(2 * t1 * t)).
                add(p4.sub(p3).mult(t * t)).mult(3);
        }
    },

    perpendicular: {
        value: function (t) {
            t = clamp(t, 0, 1);
            let p1 = this.start;
            let p2 = this.cp1;
            let p3 = this.cp2;
            let p4 = this.end;

            return p3.sub(p2.mult(2)).add(p1).mult(1-t) .add (p4.sub(p3.mult(2)).add(p2).mult(t)) .mult(6);
        }
    }
});


function BezierCurve(endpoints, closed) {
    this.endpoints = endpoints ? endpoints.slice() : [];
    if(this.endpoints.length > 1)
        this.closed = closed || false;
}

BezierCurve.prototype.defineProperties({

    closed: {
        get: function () {
            return this._closed;
        },
        set: function () {
            if(this.endpoints.length > 1)
                this._closed = true;
            else throw "Curve has too few endpoints";
        }
    },

    extend: {
        value: function (endPoint, whichEnd) {
            switch (whichEnd) {
                case BezierCurve.Ends.Left: {
                    this.endpoints.unshift(endPoint);
                    break;
                }
                case BezierCurve.Ends.Right: {
                    this.endpoints.push(endPoint);
                    break;
                }
            }
        }
    },

    remove: {
        value: function (endpoint) {
            let i = this.endpoints.indexOf(endpoint);
            this.endpoints = this.endpoints.splice(i, 1);
        }
    },

    segments: {
        get: function () {
            let ret = [];
            for(let i = 1; i < this.endpoints.length; i++) {
                ret.push(new BezierCurveSegment(this.endpoints[i-1], this.endpoints[i]));
            }
            if(this.closed)
                ret.push(new BezierCurveSegment(this.endpoints[this.endpoints.length-1], this.endpoints[0]));
            return ret;
        }
    },

    val: {
        value: function (t) {
            let a = this.getSegmentT(t);
            return a.segment.val(a.t);
        }
    },

    getSegmentT: {
        value: function (t) {
            t = clamp(t, 0, 1);
            let lengths = this.lengths();
            t *= lengths.total;
            let len = 0;
            let i;
            for(i = 0; i < lengths.segments.length; i++) {
                len += lengths.segments[i];
                if(len >= t)
                    break;
            }
            len -= lengths.segments[i];
            t = (t - len) / lengths.segments[i];

            return {
                segment: this.segments[i],
                i: i,
                t: t
            };
        }
    },

    tangent: {
        value: function (t) {
            let a = this.getSegmentT(t);
            return a.segment.tangent(a.t);
        }
    },

    perpendicular: {
        value: function (t) {
            let a = this.getSegmentT(t);
            return a.segment.perpendicular(a.t);
        }
    },

    lengths: {
        value: function (eps) {
            eps = eps || 1e-6;
            let ret = [];
            for(let segment of this.segments)
                ret.push(segment.length(eps));

            let total = 0;
            for(let len of ret)
                total += len;

            return {
                segments: ret,
                total: total
            };
        }
    }
});

BezierCurve.defineProperties({

    Ends: {
        value: {
            Left: 0,
            Right: 1
        }
    }
});