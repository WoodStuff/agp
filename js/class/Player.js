class Player {
	constructor() {
		this.currency = new Decimal(50);
		this.xp = {
			level: new Decimal(1),
			current: new Decimal(0),
			max: new Decimal(25),
			total: new Decimal(0),
		};
		this.attack = new Decimal(2);
		this.maxhp = new Decimal(10);
		this.hp = new Decimal(10);
		this.accy = new Decimal(75);
		this.block = new Decimal(0);
		this.rbu = {
			current: new Decimal(0),
			collect: new Decimal(15),
			gained: new Decimal(0),
			disabled: false,
			cooldown: 1,
		};
		this.rocks = new Decimal(0);
		this.sword = 1;
		this.shield = 0;
		this.inBattle = false;
		this.inArea = false;
		this.TBA = 800;
		this.TBM = 600;
		this.areaReward = 5;
		this.tilesUnlocked = [
			'enemy',
		];
		this.items = {};
		this.battles = {
			total: 0,
			won: 0,
			tied: 0,
			lost: 0,
		};
		this.areas = {
			total: 0,
			won: 0,
			lost: 0,
			progress: [0, 0], // this tells which area the savefile HAS YET to beat, not the last area beaten
		};
		this.spawner = {
			on: false,
			level: 1,
			limit: 3,
			content: [],
		};
		this.buffs = [];
		this.bars = {
			basic: {
				progress: new Decimal(0),
				max: new Decimal(6),
				total: new Decimal(0),
				activated: new Decimal(0),
			},
		};
		this.tab = 'main';
		this.subtab = 'main';
	}


	addCurrency(amount) {
		this.currency = this.currency.add(amount);
	}
	addXP(amount) {
		this.xp.current = this.xp.current.add(amount);
		this.xp.total = this.xp.total.add(amount);
		if (this.xp.current.gte(this.xp.max)) {
			do {
				this.xp.current = this.xp.current.sub(this.xp.max);

				let temp = this.xp.max;
				this.xp.level = this.xp.level.plus(1);

				// increase max xp: this adds 25 to it
				this.xp.max = this.xp.max.add(25);
				if (this.xp.max.eq(temp)) {
					// if the max xp is ridiculously large it gets multiplied by 25 instead
					this.xp.max = this.xp.max.times(25);
				}
			} while (this.xp.current.gte(this.xp.max));
		}
	}
	addRBU(amount) {
		this.rbu.current = this.rbu.current.add(amount);
		this.rbu.gained = this.rbu.gained.add(amount);
	}

	spawnerMaxed() {
		return this.spawner.content.length >= this.spawner.limit;
	}

	hasBuff(buff) {
		return this.buffs.includes(buff);
	}
	getBuffStats() {
		let stats = {
			atk: d(0), hp: d(0), accy: d(0), blk: d(0),
		}
		if ((!this.buffs.length == 0 || typeof this == 'undefined')) {
			for (const buff of this.buffs) {
				stats.atk = stats.atk.add(BUFFS[buff].atk);
				stats.hp = stats.hp.add(BUFFS[buff].hp);
				stats.accy = stats.accy.add(BUFFS[buff].accy);
				stats.blk = stats.blk.add(BUFFS[buff].blk);
			}
		}
		return stats;
	}

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