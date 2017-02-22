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
            this.notifyPropertyChanged(this, 'mass');
        }
    },

    centerOfMass: {
        get: function () {
            return this._centerOfMass || [0,0,0].vec3;
        },
        set: function () {
            this._centerOfMass = value;
            this.notifyPropertyChanged(this, 'centerOfMass');
        }
    },

    velocity: {
        get: function () {
            return this._velocity || Vector3.zero;
        },
        set: function (value) {
            this._velocity = value;
            this.notifyPropertyChanged(this, 'velocity');
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
            this.notifyPropertyChanged(this, 'velocity');
        }
    },

    applyForce: {
        value: function (force, displacement) {
            if(!displacement)
                this.force = this.force.add(force);
            else {
                this.applyTorque(displacement.cross(force));
            }
        }
    },

    acceleration: {
        get: function () {
            return this.force.mult(1/this.mass);
        }
    },

    angularVelocity: {
        get: function () {

        },
        set: function (value) {

        }
    },

    angularMass: {
        get: function () {

        },
        set: function (value) {

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
            this.notifyPropertyChanged(this, 'torque');
        }
    },

    applyTorque: {
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
            return this.torque.scalarMult(this.angularMass.inv);
        }
    },

    friction: {
        get: function () {

        },
        set: function (value) {

        }
    },

    bodyCollider: {
        get: function () {

        },
        set: function (value) {

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