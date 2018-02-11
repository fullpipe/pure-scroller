"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scroller = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param callback
     * @param options
     */
    function Scroller(callback, options) {
        var _this = this;
        this.options = {
            velocityMultiplier: 1,
            deceleration: 0.005,
            snaping: false
        };
        this.position = 0;
        this.velocity = 0;
        this.lastClientPos = 0;
        this.lastTimeStamp = 0;
        /**
         * Stop scroller.
         *
         * @param  timeStamp
         */
        this.stop = function (timeStamp) {
            var dt = timeStamp - _this.lastTimeStamp;
            var a = Math.sign(_this.velocity) * _this.options.deceleration;
            _this.lastTimeStamp = timeStamp;
            var dv = dt * a;
            var direction = Math.sign(_this.velocity);
            var nv = _this.velocity - dv;
            // if we changing direction, then we should stop
            if (direction !== Math.sign(nv)) {
                dt = _this.velocity / a;
                nv = 0;
            }
            var shift = _this.velocity * dt - (a * Math.pow(dt, 2)) / 2;
            _this.velocity = nv;
            _this.updatePosition(shift);
            if (!_this.velocity) {
                return;
            }
            requestAnimationFrame(_this.stop);
        };
        this.callback = callback;
        if (options) {
            this.options = __assign({}, this.options, options);
        }
    }
    /**
     * Set position.
     *
     * @param positions
     */
    Scroller.prototype.setPosition = function (position) {
        this.position = position;
    };
    /**
     * Start client movement handling.
     *
     * @param clientPos
     * @param timeStamp
     */
    Scroller.prototype.doStart = function (clientPos, timeStamp) {
        this.velocity = 0;
        this.lastClientPos = clientPos;
        this.lastTimeStamp = timeStamp;
    };
    /**
     * Handle client movement.
     *
     * @param clientPos
     * @param timeStamp
     */
    Scroller.prototype.doMove = function (clientPos, timeStamp) {
        var shift = (clientPos - this.lastClientPos) * this.options.velocityMultiplier;
        this.velocity = shift / (timeStamp - this.lastTimeStamp);
        this.lastClientPos = clientPos;
        this.lastTimeStamp = timeStamp;
        this.updatePosition(shift);
    };
    /**
     * End client movement handling.
     *
     * @param  timeStamp
     */
    Scroller.prototype.doEnd = function (timeStamp) {
        if (!this.velocity) {
            return;
        }
        if (this.options.snaping) {
            var a = Math.sign(this.velocity) * this.options.deceleration;
            var t = this.velocity / a;
            var s = this.velocity * t - (a * Math.pow(t, 2)) / 2;
            // snaped position
            var np = Math.round((s + this.position) / this.options.snaping) * this.options.snaping;
            // corect velosity
            var nv = ((np - this.position) + (a * Math.pow(t, 2)) / 2) / t;
            this.velocity = nv;
        }
        this.stop(timeStamp);
    };
    /**
     * Update position.
     *
     * @param shift
     */
    Scroller.prototype.updatePosition = function (shift) {
        this.position += shift;
        if (this.options.min && this.position < this.options.min) {
            shift = shift - (this.position - this.options.max);
            this.position = this.options.min;
        }
        if (this.options.max && this.position > this.options.max) {
            shift = shift - (this.position - this.options.max);
            this.position = this.options.max;
        }
        this.callback(this.position, shift);
    };
    return Scroller;
}());
exports.Scroller = Scroller;
//# sourceMappingURL=scroller.js.map