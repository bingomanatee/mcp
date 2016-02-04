import flattenArray from '../src/utils/flattenArray';

export default (t) => {
	t.test("flattenArray", flattenArrayTest => {
		flattenArrayTest.test("doesn't mess with a good array", dm => {
			dm.same(flattenArray([1,2,3,4]), [1,2,3,4], "doesn't mess with a good array");
			dm.end();
		});

		flattenArrayTest.test("flattens nested arrays", fl => {
			fl.same(flattenArray([1, [2, 3], 4]), [1, 2, 3, 4], "flattens nested arrays");
			fl.end();
		});

		flattenArrayTest.test("returns empty array mcpWhen passed null or no args", e => {
			e.same(flattenArray(null), [], "null converted to empty array");
			e.same(flattenArray(), [], "no args converted to empty array");
			e.end();
		});

		flattenArrayTest.end();
	})
}