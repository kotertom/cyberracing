/**
 * Created by tom on 2017-01-12.
 */

function Matrix(dim, array) {
    if(typeof dim == 'number')
        dim = [dim, dim];
    this.dim = dim.slice();
    let len = dim[0] * dim[1];
    array = array || [];
    while(array.length < len) {
        array.push(0);
    }
    this.elements = array.slice(0, len);
}

Matrix.prototype.defineProperties({

    rowNum: {
        get: function () {
            return this.dim[0];
        }
    },

    colNum: {
        get: function () {
            return this.dim[1];
        }
    },

    elem: {
        value: function (row, col) {
            return this.elements[col * this.rowNum + row];
        }
    },

    setElem: {
        value: function (row, col, value) {
            this.elements[col * this.rowNum + row] = value;
        }
    },

    rows: {
        get: function () {
            let ret = [];
            for(let i = 0; i < this.rowNum; i++) {
                let row = [];
                for(let j = 0; j < this.colNum; j++) {
                    row.push(this.elem(i,j));
                }
                ret.push(row);
            }
            return ret;
        }
    },

    cols: {
        get: function () {
            let ret = [];
            for(let j = 0; j < this.colNum; j++) {
                let col = [];
                for(let i = 0; i < this.rowNum; i++) {
                    col.push(this.elem(i,j));
                }
                ret.push(col);
            }
            return ret;
        }
    },

    set: {
        value: function (matrix) {
            Matrix.call(this, matrix.dim, matrix.elements);
        }
    },

    mult: {
        value: function (arg) {
            if(typeof arg === 'number') {
                let arr = this.elements.slice();
                arr.forEach(function (element, index, array) {
                    array[index] = element * arg;
                });
                return new Matrix(this.dim, arr);
            }
            if(arg instanceof Vector) {
                return Matrix.multiplyMbyV(this, arg);
            }
            if(arg instanceof Matrix) {
                return Matrix.multiplyMbyM(this, arg);
            }
        }
    },

    times: {
        get: function () {
            return this.mult;
        }
    },

    t: {
        get: function () {
            let dim = [this.dim[0], this.dim[1]];
            let elements = [];
            elements[this.elements.length - 1] = 0;
            let r = 0,
                c = 0;
            for(let row = 0; row < this.rowNum; row++) {
                for(let col = 0; col < this.colNum; col++) {
                    elements[col + r] = this.elements[row + c];
                    c += this.rowNum;
                }
                r += this.colNum;
            }

            return new Matrix(dim, elements);
        }
    },

    transpose: {
        get: function () {
            return this.t;
        }
    },

    toString: {
        value: function () {
            let ret = ["dim: [" + this.rowNum + ", " + this.colNum + "]"];
            for(let i = 0; i < this.rowNum; i++) {
                let line = ['|'];
                for(let j = 0; j < this.colNum; j++) {
                    line.push(this.elem(i,j));
                }
                line.push(['|']);
                ret.push(line.join('\t'));
            }
            return ret.join('\n');
        }
    }
});

Matrix.defineProperties({

    multiplyMbyV: {
        value: function (mat, vec) {
            // vertical
            if(vec.dim[0] == mat.dim[0] && vec.vertical) {
                let elements = [];
                for(let row of mat.rows) {
                    elements.push(row.vec.mult(vec));
                }
                return new Vector(elements);
            }
            throw 'Vector\'s dimension differs from the matrix\'';
        }
    },

    multiplyMbyM: {
        value: function (matL, matR) {
            if(matL.colNum != matR.rowNum) {
                throw 'Matrices\' dimensions don\'t match for multiplication';
            }
            let res = new Matrix([matL.rowNum, matR.colNum], []);
            let leftRows = matL.rows,
                rightCols = matR.cols;
            for(let i = 0; i < matL.rowNum; i++) {
                for(let j = 0; j < matR.colNum; j++) {
                    res.setElem(i, j, leftRows[i].vec.mult(rightCols[j].vec));
                }
            }
            return res;
        }
    },

    scalarMultMbyM: {
        value: function (matL, matR) {
            if(matL.dim[0] != matR.dim[0] || matL.dim[1] != matR.dim[1])
                throw 'Matrices\' dimensions don\'t match for multiplication';
            let elements = [];
            let r = 0,
                c = 0;
            for(let j = 0; j < matL.colNum; j++) {
                for(let i = 0; i < matL.rowNum; i++) {
                    let addr = i + c;
                    elements[addr] = matL.elements[addr] * matR.elements[addr];
                }
                c += matL.rowNum;
            }
            return new Matrix(matL.dim, elements);
        }
    },

    identity: {
        value: function (dim) {
            let elements = [];
            let column = [1];
            for(let i = 1; i < dim; i++) {
                column.push(0);
            }
            for(let i = 0; i < dim; i++) {
                elements.concat(column);
                column[i] = 0;
                column[i+1] = 1;
            }
            return new Matrix(dim, elements);
        }
    }
});

