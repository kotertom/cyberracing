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

    update: {
        value: function () {

            let tr = this.owner.getComponent('transform');
            let wp = this.getNextWaypoint();
            if(!wp)
                return;

            let desiredDirection = wp.getComponent('transform').position.sub(tr.position).normalized;

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