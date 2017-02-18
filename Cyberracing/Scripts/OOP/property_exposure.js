/**
 * Created by tom on 2017-02-01.
 */

Object.defineProperty(Object.prototype, 'exposeProperty', {
    enumerable: false,
    writable: false,
    value: function (propertyName, propertySettings) {
        this.editor = this.editor || {};
        let e = this.editor;
        e.exposedProperties = e.exposedProperties || {};
        e = e.exposedProperties;
        e[propertyName] = propertySettings;
    }
});

var PROPERTY_TYPE = {
    NUMBER: {},
    ENUMERABLE: {},
    VECTOR: {},
    TEXT: {},
    BOOLEAN: {}
};