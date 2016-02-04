function stateMatch(stateTest, state) {
	if (!stateTest) {
		return true;
	}
	if (stateTest) {
		if (Array.isArray(stateTest)) {
			if (stateTest.length) {
				if (!stateTest.includes(state)) {
					return false;
				}
			}
		} else if (typeof stateTest === 'string') {
			if (!(stateTest === te.fromState)) {
				return false;
			}
		}
	}
}

class MCPTransitionWatcher {

	constructor(response, conditions) {
		this.response = response;
		this.filtered = false;
		if (conditions) {
			if (typeof conditions === 'string') {
				this.filter.set('toState', conditions);
				this.filtered = true;
			} else {
				if (conditions.hasOwnProperty('action') && conditions.action) {
					this.filter.set('action', action);
					this.filtered = true;
				}
				if (conditions.hasOwnProperty('fromState') && conditions.fromState) {
					this.filter.set('fromState', conditions.fromState);
					this.filtered = true;
				}
				if (conditions.hasOwnProperty('toState') && conditions.toState) {
					this.filter.set('toState');
					this.filtered = true;
				}
			}
		}
	}

	get filter() {
		if (!this._filter) {
			this._filter = new Set();
		}
		return this._filter;
	}

	has(prop) {
		if (!this._filter) {
			return false;
		}
		return this.filter.has(prop);
	}

	/**
	 *
	 * @param te {MCPTransitionEvent}
	 */
	caresAbout(te) {
		if (!this.filtered) {
			return true;
		}
		if (this.has('action') && !(this.filter.get('action') === te.action)) {
			return false;
		}

		if (this.has('fromState')) {
			if (!stateMatch(this.filter.get('fromState'), te.fromState)) {
				return false;
			}

			if (te.fromState === te.toState) {
				// since we care about state -- and the state is not actually CHANGING.....
				return false;
			}
		}

		if (this.has('toState')) {
			if (!stateMatch(this.filter.get('toState'), te.toState)) {
				return false;
			}
		}

		return true;
	}

	reactTo(te) {
		if (this.caresAbout(te)) {
			this.response(te);
		}
	}
}