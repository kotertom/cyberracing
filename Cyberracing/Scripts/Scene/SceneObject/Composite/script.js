/**
 * Created by tom on 2017-01-26.
 */


function Script(eventCallbacks) {
    Composite.call(this);
    for(let evt in eventCallbacks)
    {
        this[evt] = eventCallbacks[evt];
    }
}
Script.inheritsFrom(Composite);