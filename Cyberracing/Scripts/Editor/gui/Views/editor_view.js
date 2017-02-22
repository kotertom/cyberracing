/**
 * Created by tom on 2017-02-21.
 */


function EditorView(model, parentNode) {
    View.call(this, model, parentNode);
}
EditorView.inheritsFrom(View);

EditorView.prototype.defineProperties({

    rebuildDom: {
        value: function () {
            let dom = {};



            this.dom = dom;
        }
    }
});