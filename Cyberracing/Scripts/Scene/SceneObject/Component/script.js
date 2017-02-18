/**
 * Created by tom on 2017-01-26.
 */


function Script(eventCallbacks, name) {
    Component.call(this);
    this.name = name || Script.nameGen.next().value;
    for(let evt in eventCallbacks)
    {
        if(eventCallbacks.hasOwnProperty(evt))
        {
            this[evt] = eventCallbacks[evt];
        }
    }
    //console.log(this);
}
Script.inheritsFrom(Component);

Script.prototype.getName = function () {
    return this.name;
};

Script.nameGen = (function* () {
    var i = 0;
    while(1)
    {
        yield "Script."+ ( i < 1000 ? ("00"+i).slice(-3) : i);
        i++;
    }
})();