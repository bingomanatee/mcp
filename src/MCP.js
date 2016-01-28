const compactArray = require('./utils/compactArray');

export default class MCP {

	constructor() {
		this.states = [];
		this.actions = {};
		this.state = null;
	}

	/**
	 * this method is the beginning of an instruction authroring chain.
	 *
	 * @param actionName {string}
	 * @param pState {StateDef} (optional)
	 * @param pFromStates [{StateDef}] optional; can be completed with thenState.
	 * @returns {MCP}
	 */
	whenAction(actionName, pState, pFromStates) {
		if (!(actionName && (typeof actionName === 'string'))) {
			throw new Error('bad action');
		}

		//@TODO: good name tests.

		this._lastAction = actionName;
		this.fromStates(pFromStates); // either wipes the from filter or
		// sets the from filter to the parameter.
		if (pState) {
			return this.changeState(pState);
		} else {
			return this;
		}
	}

	fromState(pState) {
		return this.fromStates(pState);
	}

	fromStates() {
		let states = Array.prototype.slice.call(arguments);
		this._lastFromStates = compactArray(states);
	}

	// intended as a chained call from onAction
	changeState(pState) {
		if (!this._lastAction) {
			throw new Error("called doState before onAction");
		}

		this._makeAction(pState);
		this._lastFromStates = null;
		return this;
	}

	/**
	 * this saves a change instruction to the actions collection.
	 *
	 * Note -- we are not checking for conflicts yet; the first actionable
	 * instruction is executed.
	 *
	 * @param toState
	 * @private
	 */
	_makeAction(toState) {
		const fromStates = this._lastFromStates;
		const action = this._lastAction;
		if (!this._actions[action]) {
			this._actions[action] = [];
		}
		this._actions[action].push({
			fromStates: fromStates,
			toState: toState
		});
	}

}