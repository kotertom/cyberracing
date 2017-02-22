/**
 * Created by tom on 2017-01-12.
 */


function Vector(elementArray) {
    this.elements = elementArray.slice();
    this.dim = [elementArray.length, 1];
}
Vector.prototype[Symbol.iterator] = function* () {
    for(var i = 0; i < this.elements.length; i++)
        yield this.elements[i];
};
Object.defineProperties(Vector.prototype, {

    horizontal: {
        get: function () {
            return this.dim[1] == this.elements.length;
        }
    },

    vertical: {
        get: function () {
            return this.dim[0] == this.elements.length;
        }
    },

    transposed: {
        get: function () {
            return new Vector(this.elements).transpose();
        }
    },

    transpose: {
        value: function () {
            this.dim = [this.dim[1], this.dim[0]];
        }
    },

    properDim: {
        get: function () {
            return this.elements.length;
        }
    },

    epsEqual: {
        value: function (vec, eps) {
            if(vec.properDim != this.properDim)
                return false;
            eps = eps || 1e-10;
            for(let i = 0; i < this.properDim; i++) {
                if(Math.abs(this.elem[i] - vec.elem[i]) > eps)
                    return false;
            }
            return true;
        }
    },

    ensureHorizontal: {
        value: function () {
            if(this.vertical)
                this.transpose();
        }
    },

    ensureVertical: {
        value: function () {
            if(this.horizontal)
                this.transpose();
        }
    },

    x: {
        enumerable: false,
        get: function () {
            return this.elements[0];
        },
        set: function (value) {
            this.elements[0] = value;
        }
    },

    y: {
        enumerable: false,
        get: function () {
            return this.elements[1];
        },
        set: function (value) {
            this.elements[1] = value;
        }
    },

    z: {
        enumerable: false,
        get: function () {
            return this.elements[2];
        },
        set: function (value) {
            this.elements[2] = value;
        }
    },

    w: {
        enumerable: false,
        get: function () {
            return this.elements[3];
        },
        set: function (value) {
            this.elements[3] = value;
        }
    },

    xyz: {
        enumerable: false,
        get: function () {
            return new Vector3([this.x, this.y, this.z]);
        },
        set: function (value) {
            this.x = value.x || value[0];
            this.y = value.y || value[1];
            this.z = value.z || value[2];
        }
    },

    r: {
        enumerable: false,
        get: function () {
            return this.elements[0];
        },
        set: function (value) {
            this.elements[0] = value;
        }
    },

    g: {
        enumerable: false,
        get: function () {
            return this.elements[1];
        },
        set: function (value) {
            this.elements[1] = value;
        }
    },

    b: {
        enumerable: false,
        get: function () {
            return this.elements[2];
        },
        set: function (value) {
            this.elements[2] = value;
        }
    },

    a: {
        enumerable: false,
        get: function () {
            return this.elements[3];
        },
        set: function (value) {
            this.elements[3] = value;
        }
    },

    rgb: {
        enumerable: false,
        get: function () {
            return new Vector3([this.r, this.g, this.b]);
        },
        set: function (value) {
            this.r = value.r || value[0];
            this.g = value.g || value[1];
            this.b = value.b || value[2];
        }
    },

    elem: {
        value: function (id) {
            return this.elements[id];
        }
    },

    // values: {
    //     enumerable: false,
    //     get: function () {
    //         let v = [];
    //         for(let i = this.dim - 1; i >= 0; i--) {
    //             v[i] = this[i];
    //         }
    //         return v;
    //     }
    // },

    toArray: {
        value: function () {
            return this.elements.slice();
        }
    },

    toString: {
        value: function () {
            return this.elements.toString();
        }
    },

    clone: {
        enumerable: false,
        value: function () {
            return new Vector(this.elements);
        }
    },

    add: {
        enumerable: false,
        value: function (vec_num) {
            return new Vector(Vector.add(this.elements, vec_num.elements || vec_num));
        }
    },

    sub: {
        enumerable: false,
        value: function (vec_num) {
            return new Vector(Vector.sub(this.elements, vec_num.elements || vec_num));
        }
    },

    neg: {
        enumerable: false,
        get: function () {
            return new Vector(Vector.negate(this.elements));
        }
    },

    mult: {
        enumerable: false,
        value: function (vec_num) {
            return new Vector(Vector.mult(this.elements, vec_num.elements || vec_num));
        }
    },

    times: {
        enumerable: false,
        value: function (vec_num) {
            return this.mult(vec_num);
        }
    },

    scMult: {
        value: function (vec) {
            return new Vector(Vector.scalarMult(this.elements, vec.elements));
        }
    },

    scTimes: {
        value: function (vec) {
            return this.scMult(vec);
        }
    },

    inv: {
        enumerable: false,
        get: function () {
            return new Vector(Vector.invertValues(this.elements));
        }
    },

    dot: {
        enumerable: false,
        value: function (vec) {
            return new Vector(Vector.dotProd(this.elements, vec.elements));
        }
    },

    normalized: {
        enumerable: false,
        get: function () {
            return new Vector(Vector.normalize(this.elements));
        }
    },

    normalize: {
        enumerable: false,
        value: function () {
            this.elements = Vector.normalize(this.elements);
        }
    }
});

var vec = Vector,
    v = Vector;

Vector.up3 = [0,1,0];
Vector.forward3 = [0,0,1];
Vector.right3 = [1,0,0];

Vector.add = function (vec1, vec2) {
    if(typeof vec2 == "number")
    {
        let result = [];
        for(let i = 0; i < vec1.length; i++)
            result.push(vec1[i] + vec2);
        return result;
    }
    if(vec1.length != vec2.length)
        throw "Vectors must be of same dimensions.";
    let result = [];
    for(let i = 0; i < vec1.length; i++)
        result.push(vec1[i] + vec2[i]);
    return result;
};
Vector.mult = function (vector, vec_num) {
    if(typeof vec_num === 'number') {
        let res = [];
        for(let val of vector) {
            res.push(val * vec_num);
        }
        return res;
    }
    if(vec_num instanceof Array) {
        return Vector.dotProd(vector, vec_num);
    }
};
Vector.scalarMult = function (vec1, vec2) {
    if(vec1.length != vec2.length)
        throw "Vectors must be of same dimensions";
    let res = [];
    vec1.forEach(function (e, i, a) {
        res.push(e + vec2[i]);
    });
    return res;
};
Vector.normalize = function (vector) {
    let length = 0;
    let result = [];
    for(let value of vector)
        length += value*value;
    length = Math.sqrt(length);
    for(let value of vector)
        result.push(value / length);
    return result;
};
Vector.negate = function (vector) {
    let result = [];
    for(let value of  vector)
        result.push(-value);
    return result;
};
Vector.dotProd = function (vec1, vec2) {
    if(vec1.length != vec2.length)
        throw "Vectors must be of same dimensions.";
    let sum = 0;
    for(let i = 0; i < vec1.length; i++)
    {
        sum += vec1[i] * vec2[i];
    }
    return sum;
};
Vector.crossProd3 = function (vec1, vec2) {
    if(vec1.length != 3 || vec2.length != 3)
        throw "Vectors must be 3D";

    let f = [0,0,1];
    let u = [0,1,0];
    let r = [1,0,0];

    let u1 = vec1[0],
        u2 = vec1[1],
        u3 = vec1[2],
        v1 = vec2[0],
        v2 = vec2[1],
        v3 = vec2[2];

    let x = vec.mult(r, u2*v3 - u3*v2);
    let y = vec.mult(u, u3*v1 - u1*v3);
    let z = vec.mult(f, u1*v2 - u2*v1);
    return [x,y,z];
};
Vector.invertValues = function (vector) {
    let result = [];
    for(let value of vector)
        result.push(1/value);
    return result;
};
Vector.sub = function (vec1, vec2) {
    return Vector.add(vec1, Vector.negate(vec2));
};
Vector.squaredLength = function (vec) {
    let sum = 0;
    for(let val of vec) {
        sum += val*val;
    }
    return sum;
};
Vector.length = function (vec) {
    return Math.sqrt(Vector.squaredLength(vec));
};

Vector.zero = function (dim) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(0);
    return result;
};
Vector.one = function (dim) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(1);
    return result;
};
Vector.singleValue = function (dim, value) {
    let result = [];
    for(let i = 0; i < dim; i++)
        result.push(value);
    return result;
};
Vector.lerp = function (vec1, vec2, t) {
    if(t <= 0)
        return vec2;
    if(t >= 1)
        return vec1;

    return vec.add(vec.mult(vec1, t), vec.mult(vec2, 1-t));
};