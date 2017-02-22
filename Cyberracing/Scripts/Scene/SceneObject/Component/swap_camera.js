/**
 * Created by tom on 2017-02-22.
 */


function SwapCamera(cameras) {
    Component.call(this);

    this.cameras = cameras || [];
}
SwapCamera.inheritsFrom(Component);

SwapCamera.prototype.defineProperties({

    cameras: {
        get: function () {
            return this._cameras;
        },
        set: function (value) {
            this._cameras = value;
            this.notifyPropertyChanged.raise(this, 'cameras');
        }
    },

    getNextCamera: {
        value: function () {
            if(!this.cameraGen){
                this.cameraGen = (function* () {
                    while(true) {
                        for(let camera of this.cameras)
                            yield camera;
                    }
                }).call(this);
            }
            return this.cameraGen.next().value;
        }
    },

    update: {
        value: function () {
            if(!input.getAxis('switch camera'))
                return;

            App.activeCamera = this.getNextCamera();
        }
    }
});