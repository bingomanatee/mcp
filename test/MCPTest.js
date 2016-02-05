import {MCP} from '../src';

export default t => {

	t.test('MCP', mcpTest => {
		mcpTest.test("initial mcpState", ist => {
			let mcp = new MCP();
			ist.same(mcp.mcpState, null, "starts as null");
			ist.end();
		});

		mcpTest.test("actions", aTest => {
			let mcp = new MCP();
			mcp.mcpState = 'off';
			mcp.mcpWhen('turnon').mcpStateIs('on');

			mcp.turnon();
			aTest.same(mcp.mcpState, 'on');
			aTest.end();
		});

		mcpTest.test("actions - overloaded", aTest => {
			let mcp = new MCP();
			mcp.mcpState = 'Sunday';
			mcp.mcpWhen('tomorrow')
					.mcpFromState('Saturday').mcpStateIs('Sunday')
					.mcpFromState('Sunday').mcpStateIs('Monday')
					.mcpFromState('Monday').mcpStateIs('Tuesday')
					.mcpStateIs('Saturday'); // if tomorrow called on any other mcpState go to saturday.

			mcp.tomorrow();
			aTest.same(mcp.mcpState, 'Monday', 'should be Monday');
			mcp.tomorrow();
			aTest.same(mcp.mcpState, 'Tuesday', 'should be Tuesday');
			mcp.tomorrow();
			aTest.same(mcp.mcpState, 'Saturday', 'should be Saturday');
			mcp.tomorrow();
			aTest.same(mcp.mcpState, 'Sunday', 'should be Sunday');
			mcp.tomorrow();
			aTest.same(mcp.mcpState, 'Monday', 'should be Monday');
			aTest.end();
		});

		mcpTest.test("actions - ending overload", aeTest => {

			let mcp = new MCP();
			mcp.mcpState = 'Saturday';
			let err = null;

			try {
				mcp.mcpWhen('tomorrow')
						.mcpFromState('Saturday').mcpStateIs('Sunday').mcpDone()
						.mcpFromState('Sunday').mcpStateIs('Monday');
				// should throw error because the mcpDone erases default
				// start mcpState ('tomorrow');
			} catch (e) {
				err = e;
			}
			aeTest.ok(err, "has an error from bad construction");
			aeTest.same(err.message, "called changeState before whenAction");
			aeTest.end();
		});

		mcpTest.test('qualified actions', qTest => {
			var sleeper = new MCP();

			sleeper.mcpWhen('start').mcpStateIs('awake'); // an unqualified startup action
			sleeper.mcpFromState('awake').mcpWhen('goToSleep').mcpStateIs('asleep').mcpDone();// qualified
			sleeper.mcpFromState('awake').mcpWhen('drive').mcpStateIs('driving').mcpDone();
			sleeper.mcpFromState('driving').mcpWhen('park').mcpStateIs('awake').mcpDone();
			sleeper.mcpFromState('asleep').mcpWhen('wakeUp').mcpStateIs('awake');
			console.log('sleeper!', require('util').inspect(sleeper, {depth: 5}));
			sleeper.start();
			qTest.same(sleeper.mcpState, 'awake', 'starting made us awake');
			sleeper.goToSleep();
			qTest.same(sleeper.mcpState, 'asleep', 'go to sleep put us asleep');
			try {
				sleeper.drive();
			} catch (err) {
				qTest.same(err.message, 'cannot handle action drive from asleep');
			}
			qTest.same(sleeper.mcpState, 'asleep', 'driving didn\'t work');
			qTest.ok(sleeper.mcpIsErrored, 'in an errored state');

			sleeper.wakeUp();
			qTest.same(sleeper.mcpState, 'asleep', 'waking didn\'t work because we are errored');
			// note - state machine is broken at this point because of the attempt to drive;
			sleeper.mcpRecoverFromError();
			qTest.notOk(sleeper.mcpIsErrored, 'mcpRecoverFromError worked');
			sleeper.wakeUp();
			qTest.same(sleeper.mcpState, 'awake', 'waking works now');

			sleeper.drive();
			qTest.same(sleeper.mcpState, 'driving', 'we can drive now without crashing');
			sleeper.park().goToSleep();
			qTest.same(sleeper.mcpState, 'asleep', 'we can sleep after we park');

			qTest.end();
		});

		mcpTest.test("properties", seTest => {

			let m = new MCP();

			m.mcpInitProp('x', 0);
			m.mcpInitProp('y', 0);

			m.mcpWhen('goNorth').mcpStateIs('north')
					.mcpPropIs('x', 0)
					.mcpPropIs('y', 1)
					.mcpDone();
			m.mcpWhen('goSouth').mcpStateIs('south')
					.mcpPropIs('x', 0)
					.mcpPropIs('y', -1)
					.mcpDone();
			m.mcpWhen('goEast').mcpStateIs('east')
					.mcpPropIs('x', 1)
					.mcpPropIs('y', 0)
					.mcpDone();
			m.mcpWhen('goWest').mcpStateIs('west')
					.mcpPropIs('x', -1)
					.mcpPropIs('y', 0)
					.mcpDone();

			seTest.equal(m.x, 0, 'initialisation of x');
			seTest.equal(m.y, 0, 'initialisation of y');

			m.goNorth();

			seTest.equal(m.x, 0, 'staying the same on x for north');
			seTest.equal(m.y, 1, 'going up for north');

			m.goEast();

			seTest.equal(m.x, 1, 'going right for east');
			seTest.equal(m.y, 0, 'staying the same y for east');

			seTest.end();
		});

		mcpTest.test('watchers', wTest => {

			wTest.test('action watcher', aTest => {
				let m = new MCP();

				m.mcpWhen('start').mcpStateIs('off')
						.mcpFromState('off').mcpWhen('turnKey').mcpStateIs('on')
						.mcpFromState('on').mcpWhen('turnKey').mcpStateIs('off');


				var turnKeyTimes = 0;

				let w = m.mcpWatchAction('turnKey', () => ++turnKeyTimes);

				m.start();

				aTest.equal(turnKeyTimes, 0, 'starts at 0 times');
				m.turnKey();
				aTest.equal(turnKeyTimes, 1, 'found one turn');
				m.turnKey();
				aTest.equal(turnKeyTimes, 2, 'found one turn');
				m.turnKey();
				aTest.equal(turnKeyTimes, 3, 'found one turn');

				w.destroy();

				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();

				aTest.equal(turnKeyTimes, 3, 'watching is stopped');

				aTest.end();
			});

			wTest.test('state watcher', sTest => {
				let m = new MCP();

				m.mcpWhen('start').mcpStateIs('off')
						.mcpFromState('off').mcpWhen('turnKey').mcpStateIs('on')
						.mcpFromState('on').mcpWhen('turnKey').mcpStateIs('off');


				var onTimes = 0;

				let w = m.mcpWatchState('on', () => ++onTimes);

				m.start();

				sTest.equal(onTimes, 0, 'starts at 0 times');
				m.turnKey();
				sTest.equal(onTimes, 1, 'found one on');
				m.turnKey();
				sTest.equal(onTimes, 1, 'found one on');
				m.turnKey();
				sTest.equal(onTimes, 2, 'found one on');

				w.destroy();

				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();
				m.turnKey();

				sTest.equal(onTimes, 2, 'watching is stopped');

				sTest.end();
			});

			wTest.end();
		});

		mcpTest.end();
	});
}