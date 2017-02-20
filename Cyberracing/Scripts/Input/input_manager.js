/**
 * Created by tom on 2017-01-26.
 */

var input = input || {};

function initInput() {
    let e = document;

    e.addEventListener('keydown', updateKeyMap);
    e.addEventListener('keyup', updateKeyMap);
    e.addEventListener('mousedown', updateKeyMap);
    e.addEventListener('mouseup', updateKeyMap);
    e.addEventListener('wheel', updateKeyMap);

    e.addEventListener('keyup', updateClickMap);
    e.addEventListener('mouseup', updateClickMap);
    e.addEventListener('wheel', updateClickMap);

    input.registerAxis(new Axis('steerRight', {
        down: {
            d: true,
            a: false
        },
        click: {}
    }, {
        down: {
            a: true,
            d: false
        },
        click: {}
    }));
    input.registerAxis(new Axis('accelerate', {
        down: {
            w: true,
            s: false
        },
        click: {}
    }, {
        down: {
            s: true,
            w: false
        },
        click: {}
    }));
    input.registerAxis(new Axis('switch camera', {
        down: {},
        click: {
            Tab: true
        }
    }, null));
    input.registerAxis(new Axis('lmb', {
        down: {},
        click: {
            0: true
        }
    }, null));
    input.registerAxis(new Axis('zoom', {
        click: {
            wheel: 1
        }
    }, {
        click: {
            wheel: -1
        }
    }))
}


function updateKeyMap(evt) {
    evt = evt || event;
    if(evt.type == 'keydown' || evt.type == 'keyup')
    {
        input.map[evt.keyCode] = evt.type == 'keydown';
        input.map[evt.key] = evt.type == 'keydown';
        if(evt.key == 'Tab')
            evt.preventDefault();
    }
    if(evt.type == 'mousedown' || evt.type == 'mouseup')
    {
        input.map[evt.button] = evt.type == 'mousedown';
        evt.preventDefault();
    }
    if(evt.type == 'wheel')
    {
        input.map.wheel = evt.deltaY / Math.abs(evt.deltaY);
        evt.preventDefault();
    }
}

function updateClickMap(evt) {
    evt = evt || event;
    input.clickMap = {};
    if(evt.type == 'keyup')
    {
        input.clickMap[evt.keyCode] = true;
        input.clickMap[evt.key] = true;
        if(evt.key == 'Tab')
            evt.preventDefault();
    }
    if(evt.type == 'mouseup')
    {
        input.clickMap[evt.button] = true;
        evt.preventDefault();
    }
    if(evt.type == 'wheel')
    {
        input.clickMap.wheel = evt.deltaY > 0 ? 1 : evt.deltaY < 0 ? -1 : 0;
        evt.preventDefault();
    }
}

function updateAxes() {
    for(let axisName in input.axes)
    {
        if(!input.axes.hasOwnProperty(axisName))
            continue;

        for(let axis of input.axes[axisName])
            axis.updateValue();
    }


    //debug
    for(let axisName in input.axes)
    {
        if(!input.axes.hasOwnProperty(axisName))
            continue;
        if(input.getAxis(axisName) != 0)
            console.log(axisName + ", " + input.getAxis(axisName));
    }
    //debug-end

    input.clickMap = {};
}

var input = (function (ns) {
    ns.axes = {};
    ns.map = {};
    ns.clickMap = {};

    ns.getAxis = function (name) {
        if(!ns.axes[name])
            throw 'Such axis doesn\'t exist!';
        for(let a of ns.axes[name])
            if(a.value != 0)
                return a.value;
        return 0;
    };
    ns.registerAxis = function (axis) {
        if(!ns.axes[axis.name])
            ns.axes[axis.name] = [];

        ns.axes[axis.name].push(axis);
    };

    return ns;
})(input || {});


function Axis(name, positiveCondition, negativeCondition) {
    this.name = name;
    this.value = 0;
    this.positiveCondition = positiveCondition || null;
    this.negativeCondition = negativeCondition || null;
}
Axis.prototype.updateValue = function () {
    let pos = this.positiveCondition != null;
    let neg = this.negativeCondition != null;
    if(pos)
    {
        for(let name in this.positiveCondition.down)
        {
            if(this.positiveCondition.down.hasOwnProperty(name))
                if(input.map[name] != this.positiveCondition.down[name])
                    pos = false;
        }
        for(let name in this.positiveCondition.click)
        {
            if(this.positiveCondition.click.hasOwnProperty(name))
                if(input.clickMap[name] != this.positiveCondition.click[name])
                    pos = false;
        }
    }
    if(neg) {
        for (let name in this.negativeCondition.down) {
            if (this.negativeCondition.down.hasOwnProperty(name))
                if (input.map[name] != this.negativeCondition.down[name]) {
                    neg = false;
                    break;
                }
        }
        for (let name in this.negativeCondition.click) {
            if (this.negativeCondition.click.hasOwnProperty(name))
                if (input.clickMap[name] != this.negativeCondition.click[name]) {
                    neg = false;
                    break;
                }
        }
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