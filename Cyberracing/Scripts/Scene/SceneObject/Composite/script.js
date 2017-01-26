/**
 * Created by tom on 2017-01-26.
 */


function Script(eventCallbacks) {
    Composite.call(this);
    for(let evt in eventCallbacks)
    {
        if(eventCallbacks.hasOwnProperty(evt))
        {
            this[evt] = eventCallbacks[evt];
        }
    }
    console.log(this);
}
Script.inheritsFrom(Composite);

