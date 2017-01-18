/**
 * Created by tom on 2017-01-18.
 */


function bindBufferSetData(gl, type, buffer, dataBuffer, mode) {
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, dataBuffer, mode);
}