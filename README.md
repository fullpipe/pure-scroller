# Pure scroller
Pure scroller logic for scrollers.

## Installation 
```sh
npm install pure-scroller --save
```

## Usage
```typescript
import { Scroller } from 'pure-scroller';
@Component({
  selector: 'scroll',
  templateUrl: 'scroll.html'
})
export class ScrollComponent {
  constructor() {
    this.scroller = new Scroller(this.scrollHandler, {
      min: 0, // default false
      max: 1000, // default false
      deceleration: 0.009, // default 0.005
      velocityMultiplier: 1.5, // default 1
      snaping: 40, // default false
    });
  }

  handleStart(event: TouchEvent) {
    this.scroller.doStart(event.touches.item(0).clientY, event.timeStamp);
  }

  handleEnd(event: TouchEvent) {
    this.scroller.doEnd(event.timeStamp);
  }

  handleMove(event: TouchEvent) {
    this.scroller.doMove(event.touches.item(0).clientY, event.timeStamp);

    return false;
  }

  public scrollHandler = (pos: number, relativePos: number) => {
    console.log(pos, relativePos);
  }
}
```
```html
<div class="scroll"
  (touchstart)="handleStart($event)"
  (touchmove)="handleMove($event)"
  (touchend)="handleEnd($event)"
>
  ...
</div>
```
