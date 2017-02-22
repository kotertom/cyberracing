/**
 * Created by tom on 2017-01-11.
 */

function CustomEvent() {
    this.subscribers = [];
}
CustomEvent.prototype.raise = function (sender, eventArgs) {
    if(sender == null)
        sender = null;
    if(eventArgs == null)
        eventArgs = null;
    for(let sub of this.subscribers)
        sub.callback.call(sub.thisArg, sender, eventArgs);
};
CustomEvent.prototype.subscribe = function (callback, thisArg) {
    this.subscribers.push({
        callback: callback,
        thisArg: thisArg || null
    });
};
CustomEvent.prototype.unsubscribe = function (callback, thisArg) {
    this.subscribers.forEach(function (elem, i, a) {
        if(elem.callback === callback && elem.thisArg === thisArg)
            a.splice(i, 1);
    });
};