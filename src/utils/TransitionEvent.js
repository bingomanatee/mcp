/**
 * a record of a mid-transition condition that
 * exists when leaving one state for another
 * due to an action.
 */
class MCPTransitionEvent {

	/**
	 *
	 * @param handler {Object}
	 * @param action {String}
	 * @param mcp {MCP}
	 */
	constructor(handler, action, mcp) {
		this._action = action;
		this._fromState = mcp.mcpState;
		this._toState = handler.toState;
		this.handler = handler;
		this.target = mcp;
	}

	/**
	 *
	 * @returns {String}
	 */
	get action() {
		return this._action;
	}

	/**
	 *
	 * @returns {String}
	 */
	get fromState () {
		return this._fromState;
	}

	/**
	 *
	 * @returns {String}
	 */
	get toState () {
		return this._toState;
	}
}

export default MCPTransitionEvent;