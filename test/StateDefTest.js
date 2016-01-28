import {StateDef} from "../src"

export default (t) => {
	t.test("StateDef", stateDefTest => {
		stateDefTest.test("(constructor)", conTest => {
			let stateDef = new StateDef('foo');

			conTest.equal(stateDef.name, 'foo', "name parameter");

			conTest.test("Renaming StateDef", conTestRename => {
				let stateDef = new StateDef('bar');
				let err = null;
				try {
					stateDef.name = 'bob';
				} catch (e) {
					err = e;
				}

				conTestRename.equal(err.message, "StateDef cannot be renamed");
				conTestRename.end();
			});
			conTest.end();
		});

		stateDefTest.end();
	});
}