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

		mcpTest.end();
	});
}