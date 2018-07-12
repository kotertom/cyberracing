# cyberracing (WIP/abandoned)

This is a simple game engine bundled with a demo written in JS ES5 (no npm, webpack et al.) + WebGL + HTML + CSS. Features Unity-like composite pattern and everything higher than WebGL is done by hand. Uses [glmatrix](http://glmatrix.net/) for matrix manipulation (there's also handmade but less rich custom implementation) and (webgl-obj-loader)[https://github.com/frenchtoast747/WebGL-Obj-Loader] for importing `.obj` meshes. Made for 4th university computer graphics course assignment. I've marking this project as abandoned as this was my first full javascript project and I've learned better workflows and newer technologies over the time. If I ever was to reboot this, it will probably be Rust + WASM + JS interop but I'll probably stick to plain Rust and ditch the web part.

Please note it is WIP. Exact to-do's are:
* fix lighting issues (math behind matrices and transformations)
* fix flat shader (sadly WebGL has no option to turn off rendering pipeline interpolation)

## Installation

Clone the repo or download the zip, then open the `cyberracing.html` file in your browser.
