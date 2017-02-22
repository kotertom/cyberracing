/**
 * Created by tom on 2017-02-21.
 */


function SceneObjectConverter() {
    BindingConverter.call(this);
}
SceneObjectConverter.inheritsFrom(BindingConverter);

SceneObjectConverter.prototype.defineProperties({

    toHtml: {
        value: function (model) {

            let div = document.createElement('div');

            let nameBox = document.createElement('div');
            Binding.create(nameBox, model, 'name', new LabeledTextboxConverter());

            let li = document.createElement('li');
            li.className = 'component-list';

            let components = Object.keys(model.components);
            components.splice(components.indexOf('transform'), 1);
            components.unshift('transform');


            return div;
        }
    },

    toModel: {
        value: function (html) {


        }
    }
});