/**
 * Created by tom on 2017-02-21.
 */


function ComponentList() {
    CollectionControl.call(this);

}
ComponentList.inheritsFrom(CollectionControl);

ComponentList.prototype.defineProperties({

    updateDom: {
        value: function () {

        }
    }
});

ComponentList.defineProperties({

});



function ComponentListItem() {
    Control.call(this);

}
ComponentListItem.inheritsFrom(Control);

ComponentListItem.prototype.defineProperties({

});

ComponentListItem.defineProperties({

});