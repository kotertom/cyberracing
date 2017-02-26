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
            return this._acceleration || 50;
        },
        set: function (value) {
            this._acceleration = value;
            this.notifyPropertyChanged.raise(this, 'acceleration');
        }
    },

    braking: {
        get: function () {
            return this._braking || 50;
        },
        set: function (value) {
            this._braking = value;
            this.notifyPropertyChanged.raise(this, 'braking');
        }
    },

    engineDrag: {
        get: function () {
            return this._engineDrag || 0.1;
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

    steer: {
        value: function (strength) {
            this.steeringToConsume += strength;
        }
    },

    accelerate: {
        value: function (strength) {
            this.accelerationToConsume += strength;
        }
    },

    update: {
        value: function () {

            let rb = this.owner.getComponent('rigidbody');
            let tr = this.owner.getComponent('transform');

            console.log(tr.position);

            let r = this.steeringToConsume;
            this.steeringToConsume = 0;

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


            let goingForward = Math.sign(rb.velocity.dot(tr.forward.vec3));

            let accel = 0;
            let a = this.accelerationToConsume;
            this.accelerationToConsume = 0;
            if (a > 0 && goingForward >= 0 || a < 0 && goingForward <= 0)
                accel = a * this.acceleration;
            else if (a < 0 && goingForward > 0 || a > 0 && goingForward < 0)
                accel = a * this.braking;


            // rb.drag = [this.engineDrag,this.engineDrag,this.engineDrag].vec3;
            rb.force = tr.forward.vec3.mult(accel * rb.mass);

            let vel = rb. velocity.length;
            let drag = 0.2;
            let rr = 0.1;
            rb.force = rb.force.sub(tr.forward.vec3.mult((drag * vel + rr) * vel * goingForward));
            rb.velocity = tr.forward.vec3.mult(rb.velocity.length * goingForward).add(rb.acceleration.mult(App.fixedDeltaT));

            // console.log('force: ' + rb.force.toString());
            // console.log('drag: ' + rb.drag.toString());
            // console.log('acceleration: ' + (rb.acceleration.length * -goingForward));
            // console.log('velocity: ' + (rb.velocity.length * goingForward));

            rb.force= Vector3.zero;


            let axleDistance = this.steeringAxle.sub(this.rearAxle).length;
            let radius = axleDistance / Math.sin(toRad(this.steeringAngle)) * (rb.velocity.length + 5) * 0.2;
            let angularVelocity = rb.velocity.length / radius;

            // console.log('radius: ' + radius);

            rb.angularVelocity = [0, goingForward * angularVelocity, 0].vec3;


            // console.log('w: ' + rb.angularVelocity.y);

        }
    }
});

CarMovement.defineProperties({

});