/**
 * Created by tom on 2017-02-21.
 */


function INotifyPropertyChanged() {

}

INotifyPropertyChanged.prototype.defineProperties({

    notifyPropertyChanged: {
        get: function () {
            if(!this._notifyPropertyChanged)
                this._notifyPropertyChanged = new CustomEvent();
            return this._notifyPropertyChanged;
        }
    }
});