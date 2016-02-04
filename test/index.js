import test from "tape";
import utilsTest from './utilsTest';
import workerTest from './Worker-test';
import stateDefTest from './StateDefTest';
import mcpTest from './MCPTest';
import transitionWatcherTest from './TransitionWatcher-test';

test("mcp", (t) => {
	workerTest(t);
	utilsTest(t);
	stateDefTest(t);
	mcpTest(t);
	transitionWatcherTest(t);
	t.end();
});
