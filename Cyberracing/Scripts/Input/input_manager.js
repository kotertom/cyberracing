/**
 * Created by tom on 2017-01-26.
 */

var input = input || {};

function initInput() {
    let e = gameCanvas;

    e.addEventListener('keydown', updateKeyMap);
    e.addEventListener('keyup', updateKeyMap);
    e.addEventListener('mousedown', updateKeyMap);
    e.addEventListener('mouseup', updateKeyMap);
    e.addEventListener('wheel', updateKeyMap);
}


function updateKeyMap(evt) {
    evt = evt || event;
    if(evt.type == 'keydown' || evt.type == 'keyup')
    {
        input.map[evt.keyCode] = evt.type == 'keydown';
        input.map[evt.key] = evt.type == 'keydown';
    }
    if(evt.type == 'mousedown' || evt.type == 'mouseup')
        input.map[evt.button] = evt.type == 'mousedown';
    if(evt.type == 'wheel')
        input.map.wheel = evt.deltaY / Math.abs(evt.deltaY);
}

var input = (function (ns) {
    ns.axes = {};
    ns.map = {};

    ns.getAxis = function (name) {
        for(let a of ns.axes[name])
            if(a.value != 0)
                return a.value;
        return 0;
    };
    ns.registerAxis = function (name, axis) {
        if(!ns.axes[name])
            ns.axes[name] = [];

        ns.axes[name].push(axis);
    };

    return ns;
})(input || {});


function Axis(name, positiveCondition, negativeCondition) {
    this.value = 0;
    this.positiveCondition = positiveCondition || null;
    this.negativeCondition = negativeCondition || null;
}
Axis.prototype.updateValue = function () {
    let pos = this.positiveCondition != null;
    let neg = this.negativeCondition != null;
    for(let name in this.positiveCondition)
    {
        if(this.positiveCondition.hasOwnProperty(name))
            if(input.map[name] != this.positiveCondition[name])
                pos = false;
        if(this.negativeCondition.hasOwnProperty(name))
            if(input.map[name] != this.negativeCondition[name])
                neg = false;
    }
    if(pos && neg)
        this.value = 0;
    else if(pos)
        this.value = 1;
    else if(neg)
        this.value = -1;
    else
        this.value = 0;
};

var INPUT_KEY = {
    LMB: 0,
    MMB: 1,
    RMB: 2,
    WHEEL: 'wheel',
    SCROLL: 'wheel',
    CTRL: 'Control',
    SHIFT: 'Shift',
    ALT: 'Alt',
};