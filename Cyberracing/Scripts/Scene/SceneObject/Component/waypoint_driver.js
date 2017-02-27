/**
 * Created by tom on 2017-02-23.
 */



function WaypointDriver() {
    Component.call(this);

}
WaypointDriver.inheritsFrom(Component);

WaypointDriver.prototype.defineProperties({

    waypoints: {
        get: function () {
            return this._waypoints;
        },
        set: function (value) {
            this._waypoints = value;
            this.notifyPropertyChanged.raise(this, 'waypoints');
        }
    },

    mode: {
        get: function () {
            return this._mode || WaypointDriver.Modes.Lap;
        },
        set: function (value) {
            this._mode = value;
            this.notifyPropertyChanged.raise(this, 'mode');
        }
    },

    lapCount: {
        get: function () {
            return this._lapCount || 1;
        },
        set: function (value) {
            this._lapCount = value;
            this.notifyPropertyChanged.raise(this, 'lapCount');
        }
    },

    progress: {
        get: function () {
            return this._progress || 0;
        },
        set: function (value) {
            this._progress = value;
            this.notifyPropertyChanged.raise(this, 'progress');
        }
    },

    getNextWaypoint: {
        value: function () {
            if(!this.generator) {
                this.generator = this.mode == WaypointDriver.Modes.P2P ?
                    WaypointDriver.p2pWaypointGenerator(0, this) :
                    WaypointDriver.lapWaypointGenerator(0, Infinity, this);
            }
            return this.generator.next().value;
        }
    },

    defaultRadius: {
        get: function () {
            return this._defaultRadius || 17;
        },
        set: function (value) {
            this._defaultRadius = value;
        }
    },

    update: {
        value: function () {

            let tr = this.owner.getComponent('transform');
            let rb = this.owner.getComponent('rigidbody');

            this.currentWaypoint = this.currentWaypoint || this.getNextWaypoint();
            let wp = this.currentWaypoint;
            if(!wp)
                return;
            let wpt = wp.getComponent('transform');

            if(tr.position.vec3.dist(wpt.position.vec3) < this.defaultRadius)
                this.currentWaypoint = this.getNextWaypoint();

            let desiredDirection = wpt.position.vec3.sub(tr.position.vec3).normalized;
            let currentDirection = tr.forward.vec3;

            let cdCross = new Vector3(currentDirection.elements).cross(desiredDirection);
            let cdAngleSin = cdCross.dot(tr.up.vec3);
            let cdAngleCos = currentDirection.dot(desiredDirection);

            let accel = (cdAngleCos + 1.1) / 2.1;
            accel *= accel;
            let toTheLeft = Math.sign(cdAngleSin);

            let carControl = this.owner.getComponent('carMovement');
            console.log('steering to the left: ' + toTheLeft);
            console.log('accelerating: ' + accel);
            carControl.steer(toTheLeft);
            carControl.accelerate(accel);
        }
    }
});

WaypointDriver.defineProperties({

    Modes: {
        value: {
            P2P: 0,
            Lap: 1
        }
    },

    lapWaypointGenerator: {
        value: function* (startId, laps, thisArg) {
            var currentLap = 1;

            yield* WaypointDriver.p2pWaypointGenerator(startId, thisArg);

            while(currentLap < laps) {
                yield* WaypointDriver.p2pWaypointGenerator(0, thisArg);
                currentLap++;
            }
        }
    },

    p2pWaypointGenerator: {
        value: function* (startId, thisArg) {
            for(var i = startId; i < thisArg.waypoints.length; i++)
                yield thisArg.waypoints[i];
        }
    }
});