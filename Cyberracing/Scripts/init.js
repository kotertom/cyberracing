/**
 * Created by tom on 2016-12-19.
 *
 * This file should be loaded last in the html file. It does all initialization that is not done by individual modules.
 */

// Do init here.
(function () {
    document.body.addEventListener("resize", onBodyResize);

    let gl = null;
    try {
        gl = initWebGl();
    }
    catch (err) {
        alert(err);
        return;
    }
})();


function initWebGl() {

}


function onBodyResize() {

}