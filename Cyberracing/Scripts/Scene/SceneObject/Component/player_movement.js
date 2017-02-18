/**
 * Created by tom on 2017-02-05.
 */


function PlayerMovement() {
    Component.call(this);
    this.maxVelocity = 100;
    this.acceleration = 5;
    this.braking = 20;
    this.velocity = Vector.zero(3);
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
                //console.log("position: "+transform.position);
                //transform.position = v.add(transform.position, v.mult(transform.forward, a* this.velocity * App.fixedDeltaT*0.0001));
                let r = input.getAxis('steerRight');
                transform.rotation = v.add(transform.rotation, [0, -r*App.fixedDeltaT*0.005, 0]);
                transform.position = v.add(transform.position, v.mult(transform.forward, a*App.fixedDeltaT*0.005));
            }
        }
    });
