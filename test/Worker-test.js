import {Worker } from "../src"

export default (t) => {
	t.test("Worker", (tWorker) => {
		let worker = new Worker();

		tWorker.equal(worker.mode, Worker.MODE_SYNC, "Worker is a synchronous worker by default");
		tWorker.equal(worker.state, Worker.STATE_IDLE_NO_TASKS, "Worker starts idle with no tasks");
		worker.destroy();

		tWorker.test("adding adding one task", (tWorkerAT) => {
			tWorkerAT.test("without starting", (tWorkerATWS) => {
				let worker = new Worker(task => {
				});
				worker.addTask({data: 'foo'});
				tWorkerATWS.equal(worker.state, Worker.STATE_IDLE_WITH_TASKS, "Worker is idle with tasks");
				tWorkerATWS.equal(worker.tasks, 1, "Worker has one task");
				worker.destroy();
				tWorkerATWS.end();
			});
			tWorkerAT.end();
		});
		tWorker.test("adding adding two tasks", (tWorkerAT) => {
			tWorkerAT.test("without starting", (tWorkerATWS) => {
				let worker = new Worker(task => {
				});
				worker.addTask({data: 'foo'})
						.addTask({data: 'bar'});
				tWorkerATWS.equal(worker.state, Worker.STATE_IDLE_WITH_TASKS, "Worker is idle with tasks");
				tWorkerATWS.equal(worker.tasks, 2, "Worker has 2 tasks");
				worker.destroy();
				tWorkerATWS.end();
			});

			tWorkerAT.test("starting(parametric)", (tWorkerATWS) => {
				let worker = new Worker(task => {
				});
				worker.addTask({data: 'foo'})
						.addTask({data: 'bar'}, true);

				tWorkerATWS.equal(worker.state, Worker.STATE_WORKING, "worker is still working");
				tWorkerATWS.equal(worker.tasks, 1, "one task done, one remaining");

				setTimeout(() => {
					tWorkerATWS.equal(worker.state, Worker.STATE_IDLE_NO_TASKS, "Worker is idle with tasks");
					tWorkerATWS.equal(worker.tasks, 0, "Worker has 0 tasks");
					worker.destroy();
					tWorkerATWS.end();
				}, 100);
			});

			tWorkerAT.test("starting(chained)", (tWorkerATWS) => {
				let worker = new Worker(task => {
				});
				worker.addTask({data: 'foo'})
						.addTask({data: 'bar'})
						.andStart();

				tWorkerATWS.equal(worker.state, Worker.STATE_WORKING, "worker is still working");
				tWorkerATWS.equal(worker.tasks, 1, "one task done, one remaining");

				setTimeout(() => {
					tWorkerATWS.equal(worker.state, Worker.STATE_IDLE_NO_TASKS, "Worker is idle with tasks");
					tWorkerATWS.equal(worker.tasks, 0, "Worker has 0 tasks");
					worker.destroy();
					tWorkerATWS.end();
				}, 100);
			});
			tWorkerAT.end();
		});
		tWorker.end();
	});
}