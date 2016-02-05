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
			if (!(stateTest === state)) {
				return false;
			}
		}
	}
	return true;
}

class MCPTransitionWatcher {

	/**
	 *
	 * @param mcp {MCP}
	 * @param response
	 * @param conditions
	 */
	constructor(mcp, response, conditions) {
		this.mcp = mcp;
		this.response = response;
		this.filtered = false;
		this.removed = false;

		if (conditions) {
			if (typeof conditions === 'string') {
				console.log('setting filter of toState to string', conditions);
				this.filter.set('toState', conditions);
				this.filtered = true;
			} else {
				if (conditions.hasOwnProperty('action') && conditions.action) {
					this.filter.set('action', conditions.action);
					this.filtered = true;
				}
				if (conditions.hasOwnProperty('fromState') && conditions.fromState) {
					this.filter.set('fromState', conditions.fromState);
					this.filtered = true;
				}
				if (conditions.hasOwnProperty('toState') && conditions.toState) {
					this.filter.set('toState', conditions.toState);
					this.filtered = true;
				}
			}
		}

		// console.log('transition watcher created: ', this.toString());
	}

	destroy() {
		this.mcp.mcpUnwatch(this);
		this.removed = true;
	}

	get filter() {
		if (!this._filter) {
			this._filter = new Map();
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

			if (te.fromState === te.toState) {
				// since we care about state -- and the state is not actually CHANGING.....
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

	toString() {
		var so = {};

		so.response = this.response.toString();
		if (this._filter) {
			this.filter.forEach((value, key) => so[key] = value);
		}

		return JSON.stringify(so);
	}
}

export default MCPTransitionWatcher;