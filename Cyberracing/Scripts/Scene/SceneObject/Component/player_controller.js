/**
 * Created by tom on 2017-01-26.
 */


function PlayerController() {
    Component.call(this);
}
PlayerController.inheritsFrom(Component);

PlayerController.prototype.defineProperties({

    earlyUpdate: {
        value: function () {

            let carMovement = this.owner.getComponent('carMovement');

            carMovement.accelerate(input.getAxis('accelerate'));
            carMovement.steer(-input.getAxis('steerRight'));
        }
    }
});