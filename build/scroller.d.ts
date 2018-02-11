import { Options } from './options';
import { UpdateCallback } from './update-callback';
export declare class Scroller {
    private callback;
    private options;
    private position;
    private velocity;
    private lastClientPos;
    private lastTimeStamp;
    /**
     * Constructor.
     *
     * @param callback
     * @param options
     */
    constructor(callback: UpdateCallback, options?: Options);
    /**
     * Set position.
     *
     * @param positions
     */
    setPosition(position: number): void;
    /**
     * Start client movement handling.
     *
     * @param clientPos
     * @param timeStamp
     */
    doStart(clientPos: number, timeStamp: number): void;
    /**
     * Handle client movement.
     *
     * @param clientPos
     * @param timeStamp
     */
    doMove(clientPos: number, timeStamp: number): void;
    /**
     * End client movement handling.
     *
     * @param  timeStamp
     */
    doEnd(timeStamp: number): void;
    /**
     * Stop scroller.
     *
     * @param  timeStamp
     */
    private stop;
    /**
     * Update position.
     *
     * @param shift
     */
    private updatePosition(shift);
}
