<big><h1 align="center">mcp</h1></big>

<p align="center">
  <a href="https://npmjs.org/package/mcp">
    <img src="https://img.shields.io/npm/v/mcp.svg?style=flat-square"
         alt="NPM Version">
  </a>

  <a href="https://coveralls.io/r/bingomanatee/mcp">
    <img src="https://img.shields.io/coveralls/bingomanatee/mcp.svg?style=flat-square"
         alt="Coverage Status">
  </a>

  <a href="https://travis-ci.org/bingomanatee/mcp">
    <img src="https://img.shields.io/travis/bingomanatee/mcp.svg?style=flat-square"
         alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/mcp">
    <img src="http://img.shields.io/npm/dm/mcp.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/bingomanatee/mcp.svg">
    <img src="https://david-dm.org/bingomanatee/mcp.svg?style=flat-square"
         alt="Dependency Status">
  </a>

  <a href="https://github.com/bingomanatee/mcp/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/mcp.svg?style=flat-square"
         alt="License">
  </a>
</p>

<p align="center"><big>
a flow control system for JS/Node.js
</big></p>


## Install

```sh
npm i -D mcp
```

## Usage

```js
import {MCP} from "mcp"

let chessPieceState = new MCP("inbox");

chessPieceState.mcpWhen("inbox").mcpStateIs("onboard");
chessPieceState.mcpFromState("onboard").mcpWhen("taken").mcpStateIs("captured");

```

Why MCP?

State machines are a part of a larger family of domain management. Observing state change is a very nuanced business 
and the standard eventEmitter filters are not up to the task of the kind of variations that state observations provide.

while complex listener logic can handle a lot, there's no reason why the common patterns of state observations can't be
inserted into the logic of the state machine itself. 

### Use case: the rat and the radio. 

![Radio Timeline](docs/state_example.png?raw=true)

Scientists want to find out of rats like country western music or rock and roll. They set up a radio to change randomly
between songs from a collection of country music and rock. (Both provided by k-tel of course.) 

The songs last an average of four minutes. The rat is given a lever that when he hits the lever, will advance to the 
next song. The next selection is random -- the rat is not guaranteed that he won't advance from counry to country
or from rock to rock, but of course there is a 50/50 chance that he will change themes and songs (and a 100% chance
that he will not have to listen to whatever he is listening to. 

The state machine looks like this: 

``` javsacript
import {MCP} from 'mcp';

const radio = new MCP();
var ratAdvancesCountry = 0;
var ratAdvancesRock = 0;

radio.mcpWhen('leverhit').mcpStateIs('nextsong')
  .mcpWhen('choosecountry').mcpStateIs('countryplaying')
  .mcpWhen('chooserock').mcpStateIs('rockplaying')
  .mcpWhen('songOver').mcpStateIs('nextSong');
  
radio.mcpWatchState('nextsong', () => {
  	if (Math.random() > 0.5) mcp.chooseeCountry()
  	else mcp.chooseRock();
  });
radio.mcpWatchAction('leverHit', () => {
  	if (mcp.mcpState === 'countryplaying') {
  	++ ratAdvancesCountry;
  	} else if (mcp.mcpState === 'rockPlaying') {
  	++ ratAdvancesRock;
  	}
  }) 
```

note, watchers do NOT chain; this is because they return the watcher, not the state instance.

this example shows both the utility of watching actions (the rat hitting the lever, which is data, 
whereas the song just running out is not useful to the study*) and states (a song change, which
triggers a random song selection) 

Even more specific watchers can be used instead of the last watcher:

``` javascript
radio.mcpWatch({action: 'leverHit', fromState: 'countryplaying'} () => ++ ratAdvancesCountry);
radio.mcpWatch({action: 'leverHit', fromState: 'rockPlaying'}    () => ++ ratAdvancesRodck);
```

This very compressed use of the event system shows how nuanced use of the event watchers can express
a very rich vocabulary of observational technique. 

*although it might be useful in combination with the state 
-- a rat letting a country song run its course indicates that the rat likes country, 
similarly with rock, but the lever data is kind of redundant with this information.

### Cancelling watches

`mcpWatch*` method return the instance of TransitionWatcher that is used to enable watching.
To stop watching, capture that watcher and call its' `destroy()` method.

``` javascript
let m = new MCP();
m.mcpWhen('start').mcpStateIs('off')
		.mcpFromState('off').mcpWhen('turnKey').mcpStateIs('on')
		.mcpFromState('on').mcpWhen('turnKey').mcpStateIs('off');

var turnKeyTimes = 0;
let w = m.mcpWatchAction('turnKey', () => ++turnKeyTimes);
m.start();
m.turnKey(); // turnKeyTimes === 1
w.destroy();

m.turnKey();
m.turnKey(); // turnKeyTimes still === 1;
```

To clear all watchers, call `mcpInstance.mcpUnwatchAll()`;

## Limiting Transitions

There are two types of transition rules: unqualified actions and qualified actions.

Actions that can be taken no matter what the current state (as all the ones above, 
for the rats) are unqualified. 

Actions whose effects require that the mcp be in a particular state are qualified. 

for instance, you can only wake up when you are asleep, and you can only go to sleep
when you are awake. so: 

``` javascript

var sleeper = new MCP();

sleeper.mcpWhen('start').mcpStateIs('awake'); // an unqualified startup action
sleeper.mcpFromState('awake').mcpWhen('goToSleep').mcpStateIs('asleep') // qualified 
	   .mcpFromState('sleep').mcpWhen('wakeUp').mcpStateIs('awake');
	   
sleeper.start();

sleeper.goToSleep();
console.log('sleeper state:', sleeper.mcpState); // 'asleep';
sleeper.wakeUp();
console.log('sleeper state:', sleeper.mcpState); // 'awake';
```

### A note on method names

The MCP class is intended to serve as a foundation for a potentially significantly sized 
control/model class. As such the mcp external methods are all prefixed with 
mcp, to differentatiate the constructivve methods from the resulting actions and properties. 

#### MCP?

MCP is the original Master Control Program from Tron, the movie that made me want to
get into computers in the first place. 

## License

MIT © [Wonderland Labs](http://www.wonderlandlabs.com)

[npm-url]: https://npmjs.org/package/mcp
[npm-image]: https://img.shields.io/npm/v/mcp.svg?style=flat-square

[travis-url]: https://travis-ci.org/bingomanatee/mcp
[travis-image]: https://img.shields.io/travis/bingomanatee/mcp.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/bingomanatee/mcp
[coveralls-image]: https://img.shields.io/coveralls/bingomanatee/mcp.svg?style=flat-square

[depstat-url]: https://david-dm.org/bingomanatee/mcp
[depstat-image]: https://david-dm.org/bingomanatee/mcp.svg?style=flat-square

[download-badge]: http://img.shields.io/npm/dm/mcp.svg?style=flat-square
