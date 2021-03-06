/**
 * the record of a routing solution for when an action is triggered.
 * note -- the action is a memo for which action created the handler
 * but in truth it has no effect on flow.
 */

class MCPHandler {
    /**
     *
     * @param fromStates [{State}]
     * @param toState {String}
     * @param action {String}
     */
    constructor(fromStates, toState, action) {
        this._fromStates = fromStates;
        this._toState = toState;
        this.action = action;
    }

    empty() {
        return !(this._fromStates && this._fromStates.length);
    }

    handles(pState) {
        for (let state of this._fromStates) {
            if (pState === state) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @returns [{String}]
     */
    get fromStates() {
        return this._fromStates;
    }

    /**
     * @returns {String}
     */
    get toState() {
        return this._toState;
    }
}

export default MCPHandler;
