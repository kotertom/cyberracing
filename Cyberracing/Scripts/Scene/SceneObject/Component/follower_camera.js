/**
 * Created by tom on 2017-02-18.
 */


function FollowerCamera() {
    Component.call(this);

    this.objectToFollow = null;
    this.relativePosition = [5,5,5];
    this.interpolate = true;
    this.minZoom = 5;
    this.maxZoom = 100;
}
FollowerCamera.inheritsFrom(Component);

Object.defineProperties(FollowerCamera.prototype, {
    objectToFollow: {
        enumerable: true,
        get: function () {
            return this._objectToFollow;
        },
        set: function (value) {
            this._objectToFollow = value;
        }
    },

    relativePosition: {
        enumerable: true,
        get: function () {
            return this._relativePosition;
        },
        set: function (value) {
            this._relativePosition = value;
        }
    },

    interpolate: {
        enumerable: true,
        get: function () {
            return this._interpolate;
        },
        set: function (value) {
            this._interpolate = value;
        }
    },

    minZoom: {
        enumerable: true,
        get: function () {
            return this._minZoom;
        },
        set: function (value) {
            this._minZoom = value;
        }
    },

    maxZoom: {
        enumerable: true,
        get: function () {
            return this._maxZoom;
        },
        set: function (value) {
            this._maxZoom = value;
        }
    },

    update: {
        enumerable: true,
        value: function () {

            let zoom = input.getAxis('zoom');
            let oldRelPos = this.relativePosition.slice();
            this.relativePosition = vec.add(this.relativePosition, vec.mult(vec.normalize(this.relativePosition), zoom));

        }
    },

    lateUpdate: {
        enumerable: true,
        value: function () {

            if(!this.objectToFollow)
                return;

            let cTransform = this.owner.getComponent('transform');
            let oTransform = this.objectToFollow.getComponent('transform');
            let oldPos = cTransform.position;

            let v1 = vec.mult(oTransform.forward, this.relativePosition[2]);
            let v2 = vec.mult(oTransform.up, this.relativePosition[1]);
            let v3 = vec.mult(oTransform.right, this.relativePosition[0]);
            let newPos = vec.add(oTransform.position, vec.add(vec.add(v1,v2),v3));
            cTransform.position = vec.lerp(oldPos, newPos, 0.75);
            cTransform.lookAt(oTransform.position);
        }
    }
});
