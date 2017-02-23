/**
 * Created by tom on 2017-02-23.
 */



function CarMovement() {
    Component.call(this);
}
CarMovement.inheritsFrom(Component);

CarMovement.prototype.defineProperties({

    steeringAngle: {
        get: function () {
            return this._steeringAngle || 0;
        },
        set: function (value) {
            this._steeringAngle = value;
            this.notifyPropertyChanged.raise(this, 'steeringAngle');
        }
    },

    maxSteeringAngle: {
        get: function () {
            return this._maxSteeringAngle || 60;
        },
        set: function (value) {
            this._maxSteeringAngle = value;
            this.notifyPropertyChanged.raise(this, 'maxSteeringAngle');
        }
    },

    steeringSensitivity: {
        get: function () {
            return this._steeringSensitivity || 180;
        },
        set: function (value) {
            this._steeringSensitivity = value;
            this.notifyPropertyChanged.raise(this, 'steeringSensitivity');
        }
    },

    steeringRecoverySpeed: {
        get: function () {
            return this._steeringRecoverySpeed || 120;
        },
        set: function (value) {
            this._steeringRecoverySpeed = value;
            this.notifyPropertyChanged.raise(this, 'steeringRecoverySpeed');
        }
    },

    torque: {
        get: function () {
            return this._torque || 10;
        },
        set: function (value) {
            this._torque = value;
            this.notifyPropertyChanged.raise(this, 'torque');
        }
    },

    acceleration: {
        get: function () {
            return this._acceleration || 10;
        },
        set: function (value) {
            this._acceleration = value;
            this.notifyPropertyChanged.raise(this, 'acceleration');
        }
    },

    braking: {
        get: function () {
            return this._braking || 20;
        },
        set: function (value) {
            this._braking = value;
            this.notifyPropertyChanged.raise(this, 'braking');
        }
    },

    engineDrag: {
        get: function () {
            return this._engineDrag || 4;
        },
        set: function (value) {
            this._engineDrag = value;
            this.notifyPropertyChanged.raise(this, 'engineDrag');
        }
    },

    steeringAxle: {
        get: function () {
            return this._steeringAxle || [0, 0, 1].vec3;
        },
        set: function (value) {
            this._steeringAxle = value;
            this.notifyPropertyChanged.raise(this, 'steeringAxle');
        }
    },

    rearAxle: {
        get: function () {
            return this._rearAxle || [0, 0, -1].vec3;
        },
        set: function (value) {
            this._rearAxle = value;
            this.notifyPropertyChanged.raise(this, 'rearAxle');
        }
    },

    wheels: {
        get: function () {
            return this._wheels;
        },
        set: function (value) {
            this._wheels = value;
            this.notifyPropertyChanged.raise(this, 'wheels');
        }
    },

    velocity: {
        get: function () {
            return this._velocity || 0;
        },
        set: function (value) {
            this._velocity = value;
            this.notifyPropertyChanged.raise(this, 'velocity');
        }
    },

    update: {
        value: function () {

            let rb = this.owner.getComponent('rigidbody');
            let tr = this.owner.getComponent('transform');
            //rb.drag = tr.forward.vec3.mult(this.engineDrag);
            rb.drag = Vector3.zero;

            console.log(tr.position);

            let r = -input.getAxis('steerRight');

            if(r == 0) {
                if(this.steeringAngle < 0) {
                    this.steeringAngle = Math.min(this.steeringAngle + this.steeringRecoverySpeed * App.fixedDeltaT, 0);
                } else if(this.steeringAngle > 0) {
                    this.steeringAngle = Math.max(this.steeringAngle - this.steeringRecoverySpeed * App.fixedDeltaT, 0);
                }
            } else {
                this.steeringAngle = clamp(this.steeringAngle + (r * this.steeringSensitivity - Math.sign(this.steeringAngle) * this.steeringRecoverySpeed) * App.fixedDeltaT,
            -this.maxSteeringAngle, this.maxSteeringAngle);
            }
            // if (r > 0) {
            //     this.steeringAngle = Math.min(this.maxSteeringAngle,
            //         this.steeringAngle + (this.steeringSensitivity - Math.sign(this.steeringAngle) * this.steeringRecoverySpeed) * App.fixedDeltaT);
            // } else if (r < 0) {
            //     this.steeringAngle = Math.max(-this.maxSteeringAngle,
            //         this.steeringAngle - (this.steeringSensitivity + Math.sign(this.steeringAngle) * this.steeringRecoverySpeed) * App.fixedDeltaT);
            // }

            let goingForward = Math.sign(rb.velocity.dot(tr.forward.vec3));

            let accel = 0;
            let a = input.getAxis('accelerate');
            if (a > 0 && goingForward >= 0 || a < 0 && goingForward <= 0)
                accel = a * this.acceleration;
            else if (a < 0 && goingForward > 0 || a > 0 && goingForward < 0)
                accel = a * this.braking;
            // else
            //     accel = 1 / this.engineDrag;

            // if (this.appliedForce)
            //     rb.addForce(this.appliedForce.neg);
            // // this.appliedForce = tr.forward.vec3.rotated([0, toRad(this.steeringAngle), 0].vec3).mult(accel * rb.mass);
            // this.appliedForce = tr.forward.vec3.mult(accel * rb.mass);
            // rb.addForce(this.appliedForce);

            rb.force = tr.forward.vec3.mult(accel * rb.mass);
            console.log('force: ' + rb.force.toString());
            console.log('drag: ' + rb.drag.toString());
            console.log('acceleration: ' + rb.acceleration.toString());

            // rb.velocity = tr.forward.vec3.mult(5 * accel * App.fixedDeltaT);


            if(this.steeringAngle != 0) {
                let axleDistance = this.steeringAxle.sub(this.rearAxle).length;
                let radius = axleDistance / Math.sin(toRad(this.steeringAngle));
                let angularVelocity = rb.velocity.length / radius;

                rb.angularVelocity = [0, goingForward * angularVelocity, 0].vec3;
            }

            console.log('w: ' + rb.angularVelocity.y);

        }
    }
});

CarMovement.defineProperties({

});