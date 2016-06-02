import flattenArray from './utils/flattenArray';
import TransitionEvent from './utils/TransitionEvent';
import TransitionWatcher from './utils/TransitionWatcher';
import MCPHandler from './utils/MCPHandler';

/**
 * Note - MCP is a domain class that is intended to function as the basis
 * for any number of control classes; as such, all the public properties/methods of this class
 * are prefixed by mcp to distinguish them from any properties/methods of the specialized class.
 *
 * note the _actions array is an array of handling route instructions
 * that define the qualifying prestate as fromStates
 * which is an array of zero or more qualifying states.
 *
 * the idea is, the _first_ handler that is stored under the action being called
 * that has the fromState equal to the current state
 * determines the state to transition to.
 *
 * Note, there is nothing currently blocking multiple handlers from having similar/overlapping/identical
 * profiles; its up to you to not shoot your own foot that way, but I may add some reflection
 * analytic code for overlaps later.
 *
 * If a handler's fromState array is empty it is a "Catchall" handler that will transition
 * from any state unless there is a specific handler designed for a particular fromState scenario
 * that overrides it.
 *
 */
export default class MCP {

    constructor() {
        this._actions = {}; // @TODO: Map?
        this._states = {}; // @TODO: Map?
        this._propsInitialValues = {};
        this._transitionWatchers = [];

        this.mcpState = null;
        this._mcpHasErrored = false;
    }

    get mcpState() {
        return this._state;
    }

    /**
     * note - usually mcpState is set by calling a method
     * that was created by _makeAction.
     * @param s
     */
    set mcpState(s) {
        if (this._mcpHasErrored) {
            return;
        }
        if (s !== this._state) {
            this._state = s;

            if (s) {
                this._changePropsAfterState(s);
            }
        }
    }

    _changePropsAfterState(s) {
        if (!s) {
            s = this._state;
        }
        // if s === null we are reinitializing the class.
        if (s && this._states.hasOwnProperty(s)) {
            // bulk assign the deltas in states.
            Object.assign(this, this._states[s]);
        }
    }

    /**
     * this method is the beginning of an instruction authoring chain.
     *
     * @param actionName {string}
     * @param pState {StateDef} (optional)
     * @param pFromStates [{StateDef}] optional; can be completed with thenState.
     * @returns {MCP}
     */
    mcpWhen(actionName, pState, pFromStates) {
        if (this._mcpHasErrored) {
            return this;
        }
        if (!(actionName && (typeof actionName === 'string'))) {
            return this._error('bad action');
        }

        //@TODO: good name tests.

        this._lastAction = actionName;
        if (pFromStates) {
            this.mcpFromStates(pFromStates);
        } // either wipes the from filter or
        // sets the from filter to the parameter.
        if (pState) {
            return this.changeState(pState);
        } else {
            return this;
        }
    }

    mcpFromState() {
        if (this._mcpHasErrored) {
            return this;
        }
        let states = Array.prototype.slice.call(arguments);
        return this.mcpFromStates.apply(this, states);
    }

    mcpFromStates() {
        if (this._mcpHasErrored) {
            return this;
        }
        let states = Array.prototype.slice.call(arguments);


        this._lastFromStates = flattenArray(states);
        return this;
    }

    // intended as a chained call from onAction
    mcpStateIs(pState) {
        if (this._mcpHasErrored) {
            return this;
        }
        if (!this._lastAction) {
            this._error("called changeState before whenAction");
        }

        this._makeAction(pState);
        this._lastFromStates = null;
        this._onState = pState;
        // note -- lastAction is NOT cleared -- can be reused
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
        const action = this._lastAction;


        this._ensureAction(action);
        this._actions[action].push(new MCPHandler(flattenArray(this._lastFromStates), toState, action));

        // one initialization of an action handles any number of resolved actions.
        if (!this[action]) {
            this[action] = () => this._mcpDo(action);
        }
    }

    _ensureAction(action) {
        if (!this._actions[action]) {
            this._actions[action] = [];
        }
    }

    /**
     * the handler for an action created by _makeAction.
     * @param action {String} the name of an action to perform
     *
     * @private
     */
    _mcpDo(action) {
        if (this._mcpHasErrored) {
            return;
        }
        if (!action) {
            this._error("_mcpDo requires one parameter of an action");
        }
        if (!(typeof action === 'string')) {
            this._error('_mcpDo requires action (string) property');
        }
        if (!this._actions.hasOwnProperty(action)) {
            this._error('unknown action ' + action);
        }

        if (!this._actions[action].length) {
            this._error('no instructions  for action ' + action);
        }

        let emptyHandler = null;
        let foundHandler = null;

        for (let handler of this._actions[action]) {
            if (handler.handles(this.mcpState)) {
                foundHandler = handler;
                break;
            } else if (!emptyHandler && (handler.empty())) {
                // empty handler is resolved to the first handler that has no fromStates.
                // creating a handler without a fromState accepts transitions from any state.
                emptyHandler = handler;
            }
        }

        if (foundHandler) {
            this._mcpTransitionState(foundHandler, action);
        } else if (emptyHandler) {
            this._mcpTransitionState(emptyHandler, action);
        } else {
            this._cantHandleAction(action);
        }
        return this;
    }

    mcpDone() {
        this._lastFromStates = null;
        this._lastAction = null;
        this._onState = null;
        this._mcpHasErrored = false;
        return this;
    }

    /** ***************** OBSERVING ************************* */
    /**
     * there is a lot of nuance to observing things in a fininte state machine.
     * you can care about leaving states, entering states, or the actions that cause
     * state to be changed --- of a combination of these.
     *
     * For now we are not caring about overlap conditions.
     */

    /**
     *
     * @param state {string}
     * @param handler {function}
     */
    mcpWatchState(state, handler) {
        return this.mcpWatch(state, handler);
    }

    /**
     *
     * @param action {string}
     * @param handler {function}
     */
    mcpWatchAction(action, handler) {
        return this.mcpWatch({action: action}, handler);
    }

    /**
     * if you want a nuanced watcher, use your own conditions.
     * @param conditions
     * @param handler
     */
    mcpWatch(conditions, handler) {
        const watch = new TransitionWatcher(this, handler, conditions);
        this._transitionWatchers.push(watch);
        return watch;
    }

    mcpUnwatch(watcher) {
        this._transitionWatchers = this._transitionWatchers.filter(w => (w !== watcher));
    }

    mcpUnwatchAll() {
        this._transitionWatchers.forEach(w => w.removed = true);
        this._transitionWatchers = [];
    }

    /**
     * this is the method when a handler is chosen to initiate
     * a transition to another state.
     *
     * note -- the 'transition to another state' doesn't necessarily mean
     * that the state is actually CHANGING.
     * @param handler
     * @param action
     * @private
     */
    _mcpTransitionState(handler, action) {
        if (this._mcpHasErrored) {
            return;
        }

        if (this._transitionWatchers.length) {
            let event = new TransitionEvent(handler, action, this);
            this._transitionWatchers.forEach(watcher => watcher.reactTo(event));
        }


        this.mcpState = handler.toState;
    }

    _cantHandleAction(action) {
        this._error(`cannot handle action ${action} from ${this.mcpState}`);
    }

    /**
     * Side Effects -- these method trigger simple side effects upon entering a specific state.
     *
     * the concept is you call myMCP.mcpOnState('foo').mcpPropIs('bar', 3');
     * or, mcpWhen('onfoo').mcpStateIs('foo').mcpPropIs('bar', 3)
     *    .mcpPropIs('vey', 2)...
     *
     * note -- props change as the result of entering a state -- regardless of what
     * the former state was, OR which action caused the state transition.
     * If you want to react to particular actions or transitions, listen to those
     * specific filter.
     */

    /**
     *
     * @param pState
     */
    mcpOnState(pState) {
        if (this._mcpHasErrored) {
            return;
        }
        if (!(pState && (typeof pState === 'string'))) {
            this._error('bad onState value');
        } else {
            this._onState = pState;
            return this;
        }
    }

    mcpPropIs(pProp, pValue) {
        if (this._mcpHasErrored) {
            return;
        }
        if (!this._onState) {
            this._error('must be preceded to a call mcpOnState');
        }
        if (!(pProp && (typeof pProp === 'string'))) {
            this._error('bad onSate value');
        }

        if (!this._states[this._onState]) {
            this._states[this._onState] = {};
        }
        this._states[this._onState][pProp] = pValue;

        return this;
    }

    /**
     * records that value as the initial value of the property
     * in case the properties need to be reset.
     *
     * Also, sets the given property to the given value immediately.
     *
     * @param pProp
     * @param pValue
     */
    mcpInitProp(pProp, pValue) {
        if (this._mcpHasErrored) {
            return this;
        }
        this[pProp] = pValue;
        // records the desired props' value to reset when the class is reset
        this._propsInitialValues[pProp] = pValue;
        return this;
    }

    mcpRecoverFromError() {
        this._mcpHasErrored = false;
        this._lastMCPerror = null;
    }

    mcpReset() {
        this._mcpHasErrored = false;
        this._lastMCPerror = null;
        this.mcpState = null;
        Object.assign(this, this._propsInitialValues);
        return this;
    }

    get mcpIsErrored() {
        return this._mcpHasErrored || false;
    }

    /**
     *  handles logging an error.
     *  Once an error has been recorded, all other public MCP methods
     *  are exited before any side effect can take place
     *  effectively having the same effect of throwing -- i.e., it prevents subsequent activity
     */
    _error(message) {
        console.log('MCP ERROR IN ', this, message);
        this._mcpHasErrored = true;
        this._lastMCPerror = message;
        if (this.mcpOnError) {
            this.mcpError(message);
            return this;
        } else {
            throw new Error(message);
        }
    }


}
