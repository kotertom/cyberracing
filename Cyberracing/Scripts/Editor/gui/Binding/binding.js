/**
 * Created by tom on 2017-02-21.
 */

function NotifyPropertyChangedEventArgs() {

}
NotifyPropertyChangedEventArgs.defineProperties({

    // property name
    property: {},
    // change | add | remove
    action: {}
});

function Binding(domElement, obj, prop, converter) {
    this.domElement = domElement;
    this.obj = obj;
    this.prop = prop;
    this.converter = converter;

    this.domElement.notifyViewChanged = new CustomEvent();
    this.domElement.notifyViewChanged.subscribe(this.convertHtmlToModel, this);
    this.obj.notifyPropertyChanged.subscribe(this.convertModelToHtml, this);
}

Binding.prototype.defineProperties({

    convertModelToHtml: {
        value: function (sender, evt) {
            if(evt.property != this.prop)
                return;

            let html = this.converter.toHtml(this.obj[this.prop]);
            clearNode(this.domElement);
            this.domElement.appendChild(html);
        },
        writable: true
    },

    convertHtmlToModel: {
        value: function (sender, evt) {
            this.obj.notifyPropertyChanged.unsubscribe(this.convertModelToHtml, this);
            this.obj[this.prop] = this.converter.toModel(sender);
            this.obj.notifyPropertyChanged.subscribe(this.convertModelToHtml, this);
        },
        writable: true
    }
});

Binding.defineProperties({

    create: {
        value: function (domElement, obj, prop, converter) {
            return new Binding(domElement, obj, prop, converter);
        }
    },

    remove: {
        value: function (binding) {
            binding.obj.notifyPropertyChanged.unsubscribe(binding.convertModelToHtml, binding);
            binding.domElement.notifyViewChanged.unsubscribe(binding.convertHtmlToModel, binding);
        }
    }
});