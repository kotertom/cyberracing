/**
 * Created by tom on 2017-02-05.
 */


function PlayerMovement() {
    Component.call(this);
    this.maxVelocity = 20;
    this.minVelocity = -4;
    this.acceleration = 2;
    this.braking = 4;
    this.velocity = 0;
    this.maxSteerAngle = toRad(60);
    this.steerSpeed = toRad(200);
    this.steerAngle = 0;
    this.steerRecoveryRate = toRad(300);
    this.velocityDamp = 8;
    this.vehicleLength = 1;
}
PlayerMovement.inheritsFrom(Component);

Object.defineProperties(
    PlayerMovement.prototype, {

        update: {
            writable: true,
            enumerable: true,
            value: function () {

                let transform = this.owner.getComponent('transform');
                let a = input.getAxis('accelerate');
                if(a == 0) {
                    if(this.velocity < 0) {
                        this.velocity = Math.min(0, this.velocity + this.velocityDamp * App.fixedDeltaT);
                    } else if(this.velocity > 0) {
                        this.velocity = Math.max(0, this.velocity - this.velocityDamp * App.fixedDeltaT);
                    }
                } else if(a < 0) {
                    this.velocity = Math.max(this.minVelocity, this.velocity - this.braking * App.fixedDeltaT);
                } else {
                    this.velocity = Math.min(this.maxVelocity, this.velocity + this.acceleration * App.fixedDeltaT);
                }

                let r = -input.getAxis('steerRight');
                //transform.rotate(Vector3.up.mult(r * App.fixedDeltaT));

                if(r == 0) {
                    if(this.steerAngle > 0)
                        this.steerAngle = Math.max(0, this.steerAngle - this.steerRecoveryRate * App.fixedDeltaT);
                    else if(this.steerAngle < 0)
                        this.steerAngle = Math.min(0, this.steerAngle + this.steerRecoveryRate * App.fixedDeltaT);
                } else {
                    this.steerAngle = clamp(this.steerAngle + r * this.steerSpeed * App.fixedDeltaT*0.001, -this.maxSteerAngle, this.maxSteerAngle);
                }

                if(this.velocity != 0) {
                    transform.position = transform.position.vec3.
                        add(transform.forward.vec3.mult(Math.cos(this.steerAngle) * App.fixedDeltaT * this.velocity)).
                        add(transform.right.vec3.mult(Math.sin(this.steerAngle) * App.fixedDeltaT)).toArray();
                    transform.rotate([0, this.steerAngle * App.fixedDeltaT * this.velocity*0.001,0].vec3);
                }
                // console.log(this.velocity, transform.position, this.steerAngle);
            }
        }
    });
