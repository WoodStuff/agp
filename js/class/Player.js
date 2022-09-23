class Player {
	constructor() {
		/** @type {Decimal} */
		this.currency = new Decimal(50);
		/** @type {object} */
		this.xp = {
			level: new Decimal(1),
			current: new Decimal(0),
			max: new Decimal(25),
			total: new Decimal(0),
		};
		/** @type {Stats} */
		this.stats = new Stats(2, 10, 75, 0);
		/** @type {object} */
		this.rbu = {
			current: new Decimal(0),
			collect: new Decimal(15),
			gained: new Decimal(0),
			disabled: false,
			cooldown: 1,
		};
		/** @type {Decimal} */
		this.rocks = new Decimal(0);
		/** @type {number} */
		this.sword = 1;
		/** @type {number} */
		this.shield = 0;
		/** @type {boolean} */
		this.inBattle = false;
		/** @type {boolean} */
		this.inArea = false;
		/** @type {number} */
		this.TBA = 800;
		/** @type {number} */
		this.TBM = 600;
		/** @type {number} */
		this.areaReward = 5;
		/** @type {string[]} */
		this.tilesUnlocked = [
			'enemy',
		];
		/** @type {object} */
		this.items = {};
		/** @type {object} */
		this.battles = {
			total: 0,
			won: 0,
			tied: 0,
			lost: 0,
		};
		/** @type {object} */
		this.areas = {
			total: 0,
			won: 0,
			lost: 0,
			progress: [0, 0], // this tells which area the savefile HAS YET to beat, not the last area beaten
		};
		/** @type {object} */
		this.spawner = {
			on: false,
			level: 1,
			limit: 3,
			content: [],
		};
		/** @type {string[]} */
		this.buffs = [];
		/** @type {object} */
		this.bars = {
			basic: {
				progress: new Decimal(0),
				max: new Decimal(6),
				total: new Decimal(0),
				activated: new Decimal(0),
			},
		};
		/** @type {string} */
		this.tab = 'main';
		/** @type {string} */
		this.subtab = 'main';
	}


	/**
	 * Add some currencies to the player.
	 * @param {DecimalSource} amount The amount of currencies to add.
	 */
	addCurrency(amount) {
		this.currency = this.currency.plus(amount);
	}
	/**
	 * Add XP to the player. Automatically handles leveling up.
	 * @param {DecimalSource} amount The amount of XP to add.
	 */
	addXP(amount) {
		this.xp.current = this.xp.current.plus(amount);
		this.xp.total = this.xp.total.plus(amount);
		if (this.xp.current.gte(this.xp.max)) {
			do {
				this.xp.current = this.xp.current.sub(this.xp.max);

				let temp = this.xp.max;
				this.xp.level = this.xp.level.plus(1);

				// increase max xp: this adds 25 to it
				this.xp.max = this.xp.max.plus(25);
				if (this.xp.max.eq(temp)) {
					// if the max xp is ridiculously large it gets multiplied by 25 instead
					this.xp.max = this.xp.max.times(25);
				}
			} while (this.xp.current.gte(this.xp.max));
		}
	}
	/**
	 * Add RBU to the player.
	 * @param {DecimalSource} amount The amount of RBU to add.
	 */
	addRBU(amount) {
		this.rbu.current = this.rbu.current.plus(amount);
		this.rbu.gained = this.rbu.gained.plus(amount);
	}

	/**
	 * Check if the spawner is maxed.
	 * @returns {boolean} If the spawner has the most amount of enemies possible.
	 */
	spawnerMaxed() {
		return this.spawner.content.length >= this.spawner.limit;
	}

	/**
	 * Check if the player has the buff.
	 * @param {string} buff The buff to check.
	 * @returns {boolean} The existence of the buff on this player.
	 */
	hasBuff(buff) {
		return this.buffs.includes(buff);
	}
	/**
	 * Get how much buffs boost the basic 4 stats.
	 * @returns {{atk: Decimal, hp: Decimal, accy: Decimal, blk: Decimal}} An object with the 4 basic stats having how much each stat gets boosted by buffs.
	 */
	getBuffStats() {
		let stats = {
			atk: d(0), hp: d(0), accy: d(0), blk: d(0),
		}
		if ((!this.buffs.length == 0 || typeof this == 'undefined')) {
			for (const buff of this.buffs) {
				stats.ATTACK = stats.ATTACK.plus(BUFFS[buff].atk);
				stats.MAXHP = stats.MAXHP.plus(BUFFS[buff].hp);
				stats.ACCURACY = stats.ACCURACY.plus(BUFFS[buff].accy);
				stats.BLOCK = stats.BLOCK.plus(BUFFS[buff].blk);
			}
		}
		return stats;
	}

	/**
	 * Check if the player has the buff.
	 * @param {string} tab The tab to switch to.
	 * @param {string} subtab The subtab to switch to.
	 * @returns {boolean} The existence of the buff on this player.
	 */
	switchTab(tab = 'main', subtab = 'main') {
		const tabs = ['main', 'enemy', 'area', 'shop', 'rbu'];
		const bgs = {
			main: 'main',
			enemy: 'red',
			area: 'orange',
			shop: 'yellow',
			rbu: 'purple',
		}
		if (!tabs.includes(tab)) throw new Error('Cannot switch tab to non-tab');
	
		for (const v in tabs) {
			for (const s of document.getElementById(tabs[v]).children) {
				s.style.display = 'none';
			}
			document.getElementById(tabs[v]).style.display = 'none';
		}
		document.getElementById(`${tab}-${subtab}`).style.display = 'block';
		document.getElementById(`${tab}`).style.display = 'block';
		document.getElementById('bg').src = `media/bg/${bgs[tab]}.png`;
	
		this.tab = tab;
		this.subtab = subtab;
	
		if (tab == 'shop') generateShopItems();
	
		return this.tab;
	}
	updateTiles() {
		let tiles = ['enemy'];
		if (this.battles.won > 0) tiles.push('area', 'shop', 'rbu');
	
		this.tilesUnlocked = tiles;
	
		for (const tile of document.getElementsByClassName('tile')) {
			const unlocked = this.tilesUnlocked.includes(tile.id.slice(5));
			tile.classList.remove('tile-locked');
			if (!unlocked) tile.classList.add('tile-locked');
		}
	}
	clickTile(tile) {
		if (!this.tilesUnlocked.includes(tile)) return false;
		this.switchTab(tile);
	}
}