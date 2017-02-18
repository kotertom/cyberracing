/**
 * Created by tom on 2016-12-20.
 */

function Component() {
    this.owner = null;
    this.disabled = false;
    this.hidden = false;
}
Component.prototype.getName = function () {
    let str = this.constructor.name;
    return str.substr(0,1).toLowerCase() + str.slice(1);
};
Component.prototype.getOwner = function () {
    return this.owner;
};
Object.defineProperties(
    Component.prototype, {
        name: {
            value: function () {
                let str = this.constructor.name;
                return str.substr(0,1).toLowerCase() + str.slice(1);
            },
            enumerable: true,
            writable: true
        },

        owner: {
            get: function () {
                return this._owner;
            },
            set: function (value) {
                this._owner = value;
            },
            enumerable: true
        }

        // earlyRender: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // },
        //
        // render: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // },
        //
        // lateRender: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // },
        //
        // earlyUpdate: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // },
        //
        // update: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // },
        //
        // lateUpdate: {
        //     value: function () { },
        //     enumerable: true,
        //     writable: true
        // }
    }
);