/**
 * Created by tom on 2017-02-21.
 */

var TextBox = {
    create: function (caption, text, inputCallback) {

        let div = document.createElement('div');

        let label = document.createElement('p');
        label.innerHTML = caption + ': ';

        let textbox = document.createElement('input');
        textbox.setAttribute('type', 'text');
        textbox.setAttribute('value', text);
        textbox.addEventListener('input', inputCallback);

        div.appendChild(label);
        div.appendChild(textbox);

        return div;
    }
};