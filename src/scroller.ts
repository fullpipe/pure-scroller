import { Options } from './options';
import { UpdateCallback } from './update-callback';

declare var requestAnimationFrame: any;

export class Scroller {
  private callback: UpdateCallback;
  private options: Options = {
    velocityMultiplier: 1,
    deceleration: 0.005,
    snaping: false
  };

  private position = 0;
  private velocity = 0;

  private lastClientPos = 0;
  private lastTimeStamp = 0;

  /**
   * Constructor.
   *
   * @param callback
   * @param options
   */
  constructor(callback: UpdateCallback, options?: Options) {
    this.callback = callback;

    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  /**
   * Set position.
   *
   * @param positions
   */
  setPosition(position: number): void {
    this.position = position;
  }

  /**
   * Start client movement handling.
   *
   * @param clientPos
   * @param timeStamp
   */
  doStart(clientPos: number, timeStamp: number): void {
    this.velocity = 0;
    this.lastClientPos = clientPos;
    this.lastTimeStamp = timeStamp;
  }

  /**
   * Handle client movement.
   *
   * @param clientPos
   * @param timeStamp
   */
  doMove(clientPos: number, timeStamp: number): void {
    const shift = (clientPos - this.lastClientPos) * this.options.velocityMultiplier;
    this.velocity = shift / (timeStamp - this.lastTimeStamp);

    this.lastClientPos = clientPos;
    this.lastTimeStamp = timeStamp;

    this.updatePosition(shift);
  }

  /**
   * End client movement handling.
   *
   * @param  timeStamp
   */
  doEnd(timeStamp: number): void {
    if (!this.velocity) {
      return;
    }

    if (this.options.snaping) {
      const a = Math.sign(this.velocity) * this.options.deceleration;
      const t = this.velocity / a;
      const s = this.velocity * t - (a * Math.pow(t, 2))/2;

      // snaped position
      const np = Math.round((s + this.position)/this.options.snaping) * this.options.snaping;

      // corect velosity
      const nv = ((np - this.position) + (a * Math.pow(t, 2))/2)/t;
      this.velocity = nv;
    }

    this.stop(timeStamp);
  }

  /**
   * Stop scroller.
   *
   * @param  timeStamp
   */
  private stop = (timeStamp: number): void => {
    let dt = timeStamp - this.lastTimeStamp;
    const a = Math.sign(this.velocity) * this.options.deceleration;

    this.lastTimeStamp = timeStamp;

    const dv = dt * a;
    const direction = Math.sign(this.velocity);
    let nv = this.velocity - dv;

    // if we changing direction, then we should stop
    if (direction !== Math.sign(nv)) {
      dt = this.velocity/a;
      nv = 0;
    }

    const shift = this.velocity * dt - (a * Math.pow(dt, 2))/2;
    this.velocity = nv;

    this.updatePosition(shift);
    
    if (!this.velocity) {
      return;
    }

    requestAnimationFrame(this.stop);
  }

  /**
   * Update position.
   *
   * @param shift
   */
  private updatePosition(shift: number): void {
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
  }
}
