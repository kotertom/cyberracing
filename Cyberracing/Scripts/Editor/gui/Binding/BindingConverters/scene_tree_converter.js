/**
 * Created by tom on 2017-02-21.
 */


function SceneTreeConverter() {
    BindingConverter.call(this);
}
SceneTreeConverter.inheritsFrom(BindingConverter);

SceneTreeConverter.prototype.defineProperties({

    toHtml: {
        value: function (model) {

        }
    },

    toModel: {
        value: function (html) {

        }
    }
});