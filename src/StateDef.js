export default class StateDef {
	constructor(name, rank, description, ctx) {
		this.name = name;
		this.rank = rank;
		this.description = description || name;
		this.context = ctx;
	}

	set context(value){
		this._ctx = value;
	}

	get name() {
		return this._name;
	}

	set name(n) {
		if (this._name) {
			throw new Error("StateDef cannot be renamed");
		}
		if (!(typeof n === 'string' && n)) {
			throw new Error('bad name');
		}

		if (!/^[\w_-]+$/.test(n)) {
			throw new Error(`bad name (${n})`);
		}

		this._name = n;
	}

	/**
	 * rank is an optional concept of how close to the mcpDone
	 * your subject is.
	 * There's no defined scale/range.
	 * @param r {Number)
	 */

	set rank(r) {
		this._rank = parseInt(r) || 0;
	}

	get rank() {
		return this._rank;
	}
}