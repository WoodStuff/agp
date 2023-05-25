const calcstats = {
	attack() {
		let stat = new Decimal(SWORDS[player.sword].power);
		stat = stat.plus(player.getBuffStats().atk);
		return stat;
	},
	hp() {
		let stat = new Decimal(10);
		stat = stat.plus(player.getBuffStats().hp);
		return stat;
	},
	accy() {
		let stat = new Decimal(75);
		stat = stat.plus(player.getBuffStats().accy);
		return stat;
	},
	block() {
		let stat = new Decimal(SHIELDS[player.shield].power);
		stat = stat.plus(player.getBuffStats().blk);
		return stat;
	},
}