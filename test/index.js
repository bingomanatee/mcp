import test from "tape";
import utilsTest from './utilsTest';
import workerTest from './Worker-test';
import stateDefTest from './StateDefTest';
import mcpTest from './MCPTest';

test("mcp", (t) => {
	workerTest(t);
	utilsTest(t);
	stateDefTest(t);
	mcpTest(t);
	t.end();
});
