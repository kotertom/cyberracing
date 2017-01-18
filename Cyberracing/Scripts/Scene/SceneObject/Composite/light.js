/**
 * Created by tom on 2017-01-13.
 */

function Light(owner, emitterType) {
    Composite.call(this, owner);
    this.emitter = emitterType ? new emitterType() : new PointLightEmitter();
}
Light.inheritsFrom(Composite);

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
