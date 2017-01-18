/**
 * Created by tom on 2017-01-17.
 */

function readTextFileAsync(path, callback, receiver)
{
    let request = new XMLHttpRequest();
    request.open("GET", path, true);
    var file = { status: FILE_STATUS.IN_PROGRESS};
    request.onload = function () {
        if(request.status < 200 || request.status > 299)  {
            console.log("Failed to load a file");
            file.status = FILE_STATUS.FAILED;
        }
        else {
            file.status = FILE_STATUS.LOADED;
            file.text = request.responseText;
        }
        callback.call(receiver, file);
    };

    request.send();
    return file;
}

function readTextFile(path)
{
    let request = new XMLHttpRequest();
    request.open("GET", path, false);
    var file = { status: FILE_STATUS.IN_PROGRESS};
    request.onload = function () {
        if(request.status < 200 || request.status > 299)  {
            console.log("Failed to load a file");
            file.status = FILE_STATUS.FAILED;
        }
        else {
            file.status = FILE_STATUS.LOADED;
            file.text = request.responseText;
        }
    };

    request.send();
    return file;
}

var FILE_STATUS = {
    IN_PROGRESS: 0,
    FAILED: 1,
    LOADED: 2
};