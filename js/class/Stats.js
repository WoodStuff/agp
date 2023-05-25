class Stats {
	/**
	 * Create a new stats object.
	 * 
	 * It starts with max HP, to decrease HP do `new Stats(...).setHP(hp)`.
	 * @constructs
	 * @param {DecimalSource} atk The number of attack.
	 * @param {DecimalSource} hp The number of HP.
	 * @param {DecimalSource} accy The number of accuracy.
	 * @param {DecimalSource} atk The number of blk.
	 */
	constructor(atk, hp, accy, blk) {
		/**
		 * The attack value. Measures how strong the attacks are.
		 * @type {Decimal}
		 */
		this.ATTACK = new Decimal(atk);
		/**
		 * The max HP value. The HP starts with this value and cannot go above this.
		 * @type {Decimal}
		 */
		this.MAXHP = new Decimal(hp);
		/**
		 * The HP value. Once it reaches 0, you lose.
		 * @type {Decimal}
		 */
		this.HP = new Decimal(hp);
		/**
		 * The accuracy value. The bigger this is, the more likely attacks are to hit.
		 * @type {Decimal}
		 */
		this.ACCURACY = new Decimal(accy);
		/**
		 * The block value. Allows negating some of the damage taken.
		 * @type {Decimal}
		 */
		this.BLOCK = new Decimal(blk);
	}

	
	/**
	 * Check if the user is dead.
	 */
	dead() {
		return this.HP.lte(0);
	}

	/**
	 * Damage the user by the value. Automatically handles block (unless disabled).
	 * @param {DecimalSource} atk The value to damage by.
	 * @param {boolean} ignoreBlock Ignores block, resulting in more damage taken.
	 * @returns {boolean} If dead.
	 */
	damage(atk, ignoreBlock = false) {
		/** @type {Decimal} */
		let dmg = ignoreBlock ? new Decimal(atk) : new Decimal(atk).sub(this.BLOCK);
		dmg = dmg.max(1);
		this.setHP(this.HP - dmg);
		return this.HP.lte(0);
	}

	/**
	 * Heal the user by the value. Automatically handles not going above max HP.
	 * @param {DecimalSource} amount The value to damage by.
	 * @returns {boolean} If fully healed to max HP.
	 */
	heal(amount) {
		let amt = this.HP.plus(amount);
		amt = amt.min(this.MAXHP);
		return this.HP.eq(this.MAXHP);
	}

	/**
	 * Sets the HP to the amount provided. Mainly for setting HP in one line.
	 * @param {DecimalSource} hp The HP to set to.
	 * @returns {boolean} If still alive.
	 */
	setHP(hp) {
		this.HP = new Decimal(hp).min(this.MAXHP);
		return this.HP.gt(0);
	}
}