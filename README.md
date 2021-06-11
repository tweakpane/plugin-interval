# tweakpane-plugin-interval
[Tweakpane][tweakpane] plugin that provides a range slider control for an interval value.


## Install


### Browser
```html
<script src="tweakpane.min.js"></script>
<scirpt src="tweakpane-plugin-interval.min.js"></script>
<script>
  const pane = new Tweakpane.Pane();
  pane.registerPlugin(TweakpaneIntervalPlugin);
</script>
```


### Node.js
```js
import {Pane} from 'tweakpane';
import * as TweakpaneIntervalPlugin from '@tweakpane/plugin-interval';

const pane = new Pane();
pane.registerPlugin(TweakpaneIntervalPlugin);
// ...
```


## Usage
```js
const PARAMS = {
  range: {min: 20, max: 80},
};

const pane = new Tweakpane.Pane();
pane.registerPlugin(TweakpaneIntervalPlugin);

pane.addInput(PARAMS, 'range', {
  min: 0,
  max: 100,
  step: 1,
});
```


## License
MIT License. See `LICENSE.txt` for more information.


[tweakpane]: https://github.com/cocopon/tweakpane/
