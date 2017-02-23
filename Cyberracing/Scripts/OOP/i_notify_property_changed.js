/**
 * Created by tom on 2017-02-21.
 */


function INotifyPropertyChanged() {
    this.notifyPropertyChanged = new CustomEvent();
}