/**
 * Created by tom on 2017-01-13.
 */

function Light(owner, emitterType) {
    Composite.call(this, owner);
    this.emitter = emitterType ? new emitterType() : new PointLightEmitter();
}
Light.inheritsFrom(Composite);
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
}
SpotLightEmitter.inheritsFrom(PointLightEmitter);


function lightEmitterTypeToInt(type) {
    switch (type)
    {
        case DirectionalLightEmitter.name:
            return LIGHT_TYPES.DIRECTIONAL;
        case PointLightEmitter.name:
            return LIGHT_TYPES.POINT;
        case SpotLightEmitter:
            return LIGHT_TYPES.SPOT;
        default:
            return null;
    }
}

var LIGHT_TYPES = {
    DIRECTIONAL: 0,
    POINT: 1,
    SPOT: 2
}