/**
 * Created by tom on 2017-01-13.
 */

function Light(emitterType, color) {
    Component.call(this);
    this.emitter = emitterType ? new emitterType() : new PointLightEmitter();
    this.emitter.color = color || Vector.one(4);
}
Light.inheritsFrom(Component);
Light.prototype.getEmitterType = function () {
    return this.emitter.constructor.name;
};

function LightEmitter() {
    this.color = Vector.one(4);
}

function DirectionalLightEmitter() {
    LightEmitter.call(this);
}
DirectionalLightEmitter.inheritsFrom(LightEmitter);


function PointLightEmitter() {
    LightEmitter.call(this);
}
PointLightEmitter.inheritsFrom(LightEmitter);

function SpotLightEmitter() {
    PointLightEmitter.call(this);

    this.angle = 35;
    this.exponent = 1;
}
SpotLightEmitter.inheritsFrom(PointLightEmitter);


function lightEmitterTypeToInt(type) {
    switch (type)
    {
        case DirectionalLightEmitter.name:
            return LIGHT_TYPE.DIRECTIONAL;
        case PointLightEmitter.name:
            return LIGHT_TYPE.POINT;
        case SpotLightEmitter:
            return LIGHT_TYPE.SPOT;
        default:
            return null;
    }
}

var LIGHT_TYPE = {
    AMBIENT: 0,
    DIRECTIONAL: 1,
    POINT: 2,
    SPOT: 3
};