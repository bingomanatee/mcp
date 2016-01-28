export default class Worker {
	constructor(executor, mode) {
		this.mode = mode || Worker.MODE_SYNC;
		this.executor = executor;
		this._tasks = [];
		this.state = Worker.STATE_IDLE_NO_TASKS;
		this.failures = [];
	}

	get state() {
		return this._state;
	}

	set state(s) {
		this._state = s;
	}

	addTask(task, start) {
		this._tasks.push(task);
		if (this.state < Worker.STATE_IDLE_WITH_TASKS) {
			this.state = Worker.STATE_IDLE_WITH_TASKS;
		}
		if (start) {
			this.start();
		}
		return this;
	}

	andStart() {
		return this.start();
	};

	start() {
		if (!this.tasks) {
			return this;
		}
		this.work();
		return this;
	}

	nextTask() {
		return this.tasks ? this._tasks.shift() : null;
	}

	addFailure(task, err) {
		if (typeof err === 'string') {
			err = new Error(err);
		}
		this.failures.push({
			err: err, task: task
		});
	}

	work() {
		this.state = Worker.STATE_WORKING;
		let task = this.nextTask();
		try {
			this.executor(task); // currently only operating in sync mode.
		} catch (err) {
			this.addFailure(ask, err);
		}
		if (!this._tasks.length) {
			this.state = Worker.STATE_IDLE_NO_TASKS;
		} else {
			if (typeof process !== 'undefined') {
				process.nextTick(() => this.work());
			} else {
				setTimeout(() => this.work(), 0);
			}
		}
	}

	get tasks() {
		return this._tasks.length;
	}

	destroy() {
		while (this.tasks) {
			this.addFailure(this.nextTask(), "worker destroyed with unfinished task");
		}
	}
}

Worker.STATE_NEW = 1;
Worker.STATE_IDLE_NO_TASKS = 2;
Worker.STATE_IDLE_WITH_TASKS = 3;
Worker.STATE_WORKING = 4;

Worker.MODE_SYNC = 'MODE_SYNC';
Worker.MODE_CALLBACK = 'MODE_CALLBACK';
Worker.MODE_PROMISE = 'MODE_PROMISE';