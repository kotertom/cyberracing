/**
 * Created by tom on 2017-02-20.
 */


function Rigidbody() {
    Component.call(this);
}
Rigidbody.inheritsFrom(Component);

Rigidbody.prototype.defineProperties({

    mass: {
        get: function () {
            return this._mass || 1;
        },
        set: function (value) {
            this._mass = value;
            this.notifyPropertyChanged.raise(this, 'mass');
        }
    },

    centerOfMass: {
        get: function () {
            return this._centerOfMass || [0,0,0].vec3;
        },
        set: function () {
            this._centerOfMass = value;
            this.notifyPropertyChanged.raise(this, 'centerOfMass');
        }
    },

    velocity: {
        get: function () {
            return this._velocity || Vector3.zero;
        },
        set: function (value) {
            this._velocity = value;
            this.notifyPropertyChanged.raise(this, 'velocity');
        }
    },

    momentum: {
        get: function () {
            return this.velocity.length * this.mass;
        }
    },

    force: {
        get: function () {
            return this._force || Vector3.zero;
        },
        set: function (value) {
            this._force = value;
            this.notifyPropertyChanged.raise(this, 'velocity');
        }
    },

    addForce: {
        value: function (force, displacement) {
            if(!displacement)
                this.force = this.force.add(force);
            else {
                let radForce = force.project(displacement);
                let tanForce = force.sub(radForce);

                this.addTorque(displacement.cross(tanForce));
                this.force = this.force.add(radForce);
            }
        }
    },

    acceleration: {
        get: function () {
            let dragVector = this.drag.mult(this.velocity.length).scalarMult(this.velocity);
            return this.force.sub(dragVector).mult(1/this.mass);
        }
    },

    drag: {
        get: function () {
            return this._drag || Vector3.zero;
        },
        set: function (value) {
            this._drag = value;
            this.notifyPropertyChanged.raise(this, 'drag');
        }
    },

    angularVelocity: {
        get: function () {
            return this._angularVelocity || Vector3.zero;
        },
        set: function (value) {
            this._angularVelocity = value;
            this.notifyPropertyChanged.raise(this, 'angularVelocity');
        }
    },

    angularMass: {
        get: function () {
            return this._angularMass || Vector3.ones;
        },
        set: function (value) {
            this._angularMass = value;
            this.notifyPropertyChanged.raise(this, 'angularMass');
        }
    },

    angularMomentum: {
        get: function () {
            return this.angularMass.scalarMult(this.angularVelocity);
        }
    },

    torque: {
        get: function () {
            return this._torque || Vector3.zero;
        },
        set: function (value) {
            this._torque = value;
            this.notifyPropertyChanged.raise(this, 'torque');
        }
    },

    addTorque: {
        value: function (value, axis) {
            if(!axis)
                this.torque = this.torque.add(value);
            else {
                this.torque = this.torque.add(axis.mult(value));
            }
        }
    },

    angularAcceleration: {
        get: function () {
            let dragVector = this.angularDrag.mult(this.angularVelocity.length).scMult(this.angularVelocity);
            return this.torque.sub(dragVector).scalarMult(this.angularMass.inv);
        }
    },

    angularDrag: {
        get: function () {
            return this._angularDrag || [0,0,0].vec3;
        },
        set: function (value) {
            this._angularDrag = value;
            this.notifyPropertyChanged.raise(this, 'angularDrag');
        }
    },

    friction: {
        get: function () {
            return this._friction || 0;
        },
        set: function (value) {
            this._friction = value;
            this.notifyPropertyChanged.raise(this, 'friction');
        }
    },

    update: {
        value: function () {

            this.velocity = this.velocity.add(this.acceleration.mult(App.fixedDeltaT));
            this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.mult(App.fixedDeltaT));

            let transform = this.owner.getComponent('transform');
            transform.translate(this.velocity.mult(App.fixedDeltaT));
            transform.rotate(this.angularVelocity.mult(App.fixedDeltaT));
        }
    }
});

Rigidbody.defineProperties({

});