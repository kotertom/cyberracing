/**
 * Created by tom on 2017-02-19.
 */

var editor = editor || {};
(function () {

    this.notifyPropertyChanged = new CustomEvent();

    this.exposeProperty = function (target, prop, opts) {
        target.exposedProperties = target.exposedProperties || {};
        target.exposedProperties[prop] = opts;
    };

    this.exposeProperties = function (target, props) {
        for(let prop in Object.keys(props)) {
            editor.exposeProperty(target, prop, props[prop]);
        }
    };

    this.init = function () {

        let tree = new TreeView();
        tree.parentNode = document.getElementById('scene-tree');
        tree.bind(App.activeScene, 'root');

        let soView = new ComponentList();
        soView.parentNode = document.getElementById('selected-object-area');
        soView.bind(this.state, 'selectedObject');
    };

}).call(editor);

editor.defineProperties({

    state: {
        get: function () {
            if(!this._state) {
                this._state = new EditorSelectionState();
                this._state.onEnter();
            }
            return this._state;
        },
        set: function (value) {
            this.state.onExit();
            this._state = value;
            this._state.onEnter();
        }
    }
});


function EditorState() {

}
EditorState.prototype.defineProperties({

    onEnter: {
        value: function () {

        },
        writable: true
    },

    onExit: {
        value: function () {

        },
        writable: true
    },
});

function EditorSelectionState() {
    EditorState.call(this);
}
EditorSelectionState.inheritsFrom(EditorState);

EditorSelectionState.prototype.defineProperties({

    onEnter: {
        value: function () {
            document.getElementById('game-canvas').addEventListener('click', raycastOnMouse);
        }
    },

    onExit: {
        value: function () {
            document.getElementById('game-canvas').removeEventListener('click', raycastOnMouse);
        }
    },

    selectedObject: {
        get: function () {
            return this._selectedObject;
        },
        set: function (value) {
            this._selectedObject = value;
            let soArea = document.getElementById('selected-object-area');
            clearNode(soArea);
            editor.notifyPropertyChanged(this, 'selectedObject');
        }
    },

    selectObject: {
        value:function (obj) {
            this.selectedObject = obj;
        }
    }
});

function raycastOnMouse(evt) {

}

function clearNode(node) {
    let cNode = node.cloneNode(false);
    node.parentNode.replaceChild(cNode, node);
}