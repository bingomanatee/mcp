import test from "tape"

import workerTest from './Worker-test';
import stateDefTest from './StateDefTest';

test("mcp", (t) => {
	workerTest(t);
	stateDefTest(t);
	t.end();
});
