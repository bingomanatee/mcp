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

chessPieceState.mcpFromState("inbox").mcpChangeState("onboard");
chessPieceState.mcpFromState("onboard")

```

Why MCP?

State machines are a part of a larger family of domain management. Observing state change is a very nuanced business 
and the standard eventEmitter filters are not up to the task of the kind of variations that state observations provide.

while complex listener logic can handle a lot, there's no reason why the common patterns of state observations can't be
inserted into the logic of the state machine itself. 

### Use case: the rat and the radio. 

<svg width="911px" height="129px" viewBox="0 0 911 129" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.4.4 (17249) - http://www.bohemiancoding.com/sketch -->
    <title>state_example</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <path d="M120.104065,16 C157.821431,16 168.744751,73.6686605 168.744751,73.6686605 C168.744751,73.6686605 152.441996,34.8001506 120.104065,34.8001506 C111.921358,34.8001506 92.0891927,34.8001506 92.0891927,34.8001506 L92,16 C92,16 106.832439,16 120.104065,16 Z" id="Path-1" fill="#D8D8D8" sketch:type="MSShapeGroup"></path>
        <path d="M646.104065,16 C683.821431,16 694.744751,73.6686605 694.744751,73.6686605 C694.744751,73.6686605 678.441996,34.8001506 646.104065,34.8001506 C637.921358,34.8001506 618.089193,34.8001506 618.089193,34.8001506 L618,16 C618,16 632.832439,16 646.104065,16 Z" id="Path-1-Copy-2" fill="#D8D8D8" sketch:type="MSShapeGroup"></path>
        <path d="M264.640686,16 C226.92332,16 216,73.6686605 216,73.6686605 C216,73.6686605 232.302755,34.8001506 264.640686,34.8001506 C272.823393,34.8001506 292.655558,34.8001506 292.655558,34.8001506 L292.744751,16 C292.744751,16 277.912312,16 264.640686,16 Z" id="Path-1-Copy" fill="#D8D8D8" sketch:type="MSShapeGroup"></path>
        <path d="M790.640686,16 C752.92332,16 742,73.6686605 742,73.6686605 C742,73.6686605 758.302755,34.8001506 790.640686,34.8001506 C798.823393,34.8001506 818.655558,34.8001506 818.655558,34.8001506 L818.744751,16 C818.744751,16 803.912312,16 790.640686,16 Z" id="Path-1-Copy-3" fill="#D8D8D8" sketch:type="MSShapeGroup"></path>
        <polygon id="Star-1" fill="#F60000" sketch:type="MSShapeGroup" points="191.125 104.941406 181.059178 109.461585 182.981579 99.8876933 174.838157 93.1074259 186.092089 91.710614 191.125 83 196.157911 91.710614 207.411843 93.1074259 199.268421 99.8876933 201.190822 109.461585 "></polygon>
        <polygon id="Star-1-Copy" fill="#F60000" sketch:type="MSShapeGroup" points="717.125 104.941406 707.059178 109.461585 708.981579 99.8876933 700.838157 93.1074259 712.092089 91.710614 717.125 83 722.157911 91.710614 733.411843 93.1074259 725.268421 99.8876933 727.190822 109.461585 "></polygon>
        <rect id="Rectangle-1" fill="#F6A623" sketch:type="MSShapeGroup" x="0" y="16" width="82.0572917" height="18.5520833"></rect>
        <rect id="Rectangle-1-Copy" fill="#F6A623" sketch:type="MSShapeGroup" x="301" y="16" width="148" height="18.5520833"></rect>
        <circle id="Oval-1" fill="#4990E2" sketch:type="MSShapeGroup" cx="469.5" cy="109.5" r="19.5"></circle>
        <path d="M463.5,108.5 L474.5,92.5" id="Line" stroke="#FFFFFF" stroke-width="4" stroke-linecap="square" sketch:type="MSShapeGroup"></path>
        <rect id="Rectangle-1-Copy-2" fill="#F6A623" sketch:type="MSShapeGroup" x="828.229126" y="16" width="82.0572917" height="18.5520833"></rect>
        <rect id="Rectangle-1-Copy-3" fill="#7ED321" sketch:type="MSShapeGroup" x="482" y="16" width="129" height="18.5520833"></rect>
        <text id="Rock-and-Roll" sketch:type="MSTextLayer" font-family="Helvetica" font-size="12" font-weight="normal" fill="#000000">
            <tspan x="15" y="10">Rock and </tspan>
            <tspan x="15" y="24">Roll</tspan>
        </text>
        <text id="Rock-and-Roll-Copy" sketch:type="MSTextLayer" font-family="Helvetica" font-size="12" font-weight="normal" fill="#000000">
            <tspan x="316" y="10">Rock and </tspan>
            <tspan x="316" y="24">Roll</tspan>
        </text>
        <text id="Rock-and-Roll" sketch:type="MSTextLayer" font-family="Helvetica" font-size="12" font-weight="normal" fill="#000000">
            <tspan x="843.229126" y="10">Rock and </tspan>
            <tspan x="843.229126" y="24">Roll</tspan>
        </text>
        <text id="Country-Western-Copy" sketch:type="MSTextLayer" font-family="Helvetica" font-size="12" font-weight="normal" fill="#000000">
            <tspan x="504" y="10">Country </tspan>
            <tspan x="504" y="24">Western</tspan>
        </text>
    </g>
</svg>

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
  .mcpWhen('songOver').mcpStateIs('nextSong')
  
  .mcpWatchState('nextsong', () => {
  	if (Math.random() > 0.5) mcp.chooseeCountry()
  	else mcp.chooseRock();
  })
  .mcpWatchAction('leverHit', () => {
  	if (mcp.mcpState === 'countryplaying') {
  	++ ratAdvancesCountry;
  	} else if (mcp.mcpState === 'rockPlaying') {
  	++ ratAdvancesRock;
  	}
  }) 
```

this example shows both the utility of watching actions (the rat hitting the lever, which is data, 
whereas the song just running out is not useful to the study*) and states (a song change, which
triggers a random song selection) 

Even more specific watchers can be used instead of the last watcher:

``` javascript
radio.mcpWatch({action: 'leverHit', fromState: 'countryplaying'} () => ++ ratAdvancesCountry)
     .mcpWatch({action: 'leverHit', fromState: 'rockPlaying'}    () => ++ ratAdvancesRodck);
```

This very compressed use of the event system shows how nuanced use of the event watchers can express
a very rich vocabulary of observational technique. 

*although it might be useful in combination with the state 
-- a rat letting a country song run its course indicates that the rat likes country, 
similarly with rock, but the lever data is kind of redundant with this information.

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
