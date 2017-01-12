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
    for(let callback of this.subscribers)
        callback(sender, eventArgs);
};
CustomEvent.prototype.subscribe = function (callback) {
    this.subscribers.push(callback);
};
CustomEvent.prototype.unsubscribe = function (callback) {
    this.subscribers.splice(this.subscribers.indexOf(callback), 1);
};