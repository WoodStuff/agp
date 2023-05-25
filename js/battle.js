/**
 * The player's stats in the current enemy fight.
 * @type {Stats}
 */
let playerStats = player.stats;

/**
 * A list of the enemy stats in the current enemy fight.
 * 
 * For a single enemy fight, the stats are in index 0.
 * @type {Stats[]}
 */
let enemyStats = [];

/**
 * The battle turn interval.
 * @type {number}
 */
let battleTurns;

function fightEnemy(id, buff = 1) {
	if (!player.inArea) {
		let index = player.spawner.content.indexOf(id);
		if (index > -1) {
			player.spawner.content.splice(index, 1);
		}
	}

	if (player.inArea) player.switchTab('area', 'fight');
	else player.switchTab('enemy', 'battle');
	player.inBattle = true;

	if (!player.inArea) playerStats.HP = player.stats.MAXHP; // refill the player's hp
	playerStats.ATTACK = player.stats.ATTACK;
	playerStats.MAXHP = player.stats.MAXHP;
	playerStats.ACCURACY = player.stats.ACCURACY;
	playerStats.BLOCK = player.stats.BLOCK;

	enemyStats = [];
	enemyStats.push(new Stats(
		getEnemy(id).atk.times(buff),
		getEnemy(id).hp.times(buff),
		getEnemy(id).accy,
		getEnemy(id).blk.times(buff),
	));

	setByClass('battle-rewards', 'none', 'style', 'display')
	setByClass('battle-title', `Vs. ${getEnemy(id).name}`, 'innerHTML')
	setByClass('battle-enemy-img', `${getEnemy(id).img}`, 'src')
	
	updateBattleStats(true);
	setByClass('battle-player-decrease', '0s', 'style', 'transition')
	setByClass('battle-player-decrease', '#00000000', 'style', 'color')
	setByClass('battle-enemy-decrease', '0s', 'style', 'transition')
	setByClass('battle-enemy-decrease', '#00000000', 'style', 'color')

	battleTurns = setInterval(() => { battleTurn(id, 0) }, player.TBA);
	return true;
}

function battleTurn(id) {
	if (!player.inBattle) return false;

	let factor = new Decimal(1); // placeholder, gonna remove in uhhh a few years when areas get to challenging difficulty or something
	let playerMiss = chance(factor.times(100).minus(playerStats.ACCURACY).div(factor).max(0).min(100).mag);
	let enemyMiss = chance(new Decimal(100).minus(enemyStats[0].ACCURACY).mag);

	let pastEHP = enemyStats[0].HP;
	let pastPHP = playerStats.HP;
	console.log(playerStats.ATTACK, enemyStats[0].ATTACK);
	if (!playerMiss) enemyStats[0].damage(playerStats.ATTACK);
	if (!enemyMiss) playerStats.damage(enemyStats[0].ATTACK);

	customTurns(id);

	if (playerStats.HP.gt(playerStats.MAXHP)) playerStats.HP = playerStats.MAXHP;
	
	const updateStatArglist = [pastPHP, pastEHP, playerMiss, enemyMiss];
	updateBattleStats(...updateStatArglist);

	if (!(enemyStats[0].HP.lte(0) || playerStats.HP.lte(0))) return; // battle has ended if continues past this

	clearInterval(battleTurns);
	setByClass('battle-end', 'block', 'style', 'display');
	setByClass('battle-end-message', player.inArea ? 'Returning in a bit.' : 'Click the button at the top left to exit.', 'innerHTML')
	
	if (enemyStats[0].HP.lte(0) && !playerStats.HP.lte(0)) win();
	if (enemyStats[0].HP.lte(0) && playerStats.HP.lte(0)) {
		if (player.inArea) lose();
		else tie();
	}
	if (!enemyStats[0].HP.lte(0) && playerStats.HP.lte(0)) lose();


	function win(regenerateRBU = true) {
		setByClass('battle-result', 'You won!', 'innerHTML');
		setByClass('battle-rewards', 'block', 'style', 'display');
		setByClass('b-cr-value', format(getEnemy(id).curr), 'innerHTML');
		setByClass('b-xp-value', format(getEnemy(id).xp), 'innerHTML');

		if (player.inArea) setTimeout(() => {
			player.switchTab('area', 'play');
			player.inBattle = false;
			setByClass('battle-end', 'none', 'style', 'display');
			areaVars.invulnerable = true;
		}, player.TBA * 1.5);

		player.addCurrency(getEnemy(id).curr);
		player.addXP(getEnemy(id).xp);

		player.battles.total++;
		player.battles.won++;

		if (player.rbu.disabled && regenerateRBU) player.rbu.cooldown--;
	}
	function tie() {
		setByClass('battle-result', 'It\'s a tie!', 'innerHTML');

		player.battles.total++;
		player.battles.tied++;
	}
	function lose() {
		setByClass('battle-result', `${getEnemy(id).name} won!`, 'innerHTML');

		if (player.inArea) setTimeout(() => {
			selectZone();
			player.inArea = false;
			player.inBattle = false;
			player.areas.lost++;
		}, player.TBA * 1.5);

		player.battles.total++;
		player.battles.lost++;
	}
}

function customTurns(id, number) {
	if (player.hasBuff('healthpotion') && chance(25)) playerStats.HP = playerStats.HP.add(1);
}

function updateBattleStats(pastPHP, pastEHP, playerMiss, enemyMiss) {
	setByClass('battle-player-hp', `${format(playerStats.HP)}/${format(playerStats.MAXHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerStats.ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerStats.ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerStats.BLOCK)} BLK`, 'innerHTML');

	setByClass('battle-enemy-hp', `${format(enemyStats[0].HP)}/${format(enemyStats[0].MAXHP)} HP`, 'innerHTML');
	setByClass('battle-enemy-atk', `${format(enemyStats[0].ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-enemy-accy', `${format(enemyStats[0].ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-enemy-blk', `${format(enemyStats[0].BLOCK)} BLK`, 'innerHTML');

	if (pastPHP == undefined || pastEHP == undefined) return true;
	setByClass('battle-player-decrease', enemyMiss ? 'Missed!' : `${(pastPHP.minus(playerStats.HP)) * -1}`, 'innerHTML');
	setByClass('battle-enemy-decrease', playerMiss ? 'Missed!' : `${(pastEHP.minus(enemyStats[0].HP)) * -1}`, 'innerHTML');
	setByClass('battle-player-decrease', '#00000099', 'style', 'color');
	setByClass('battle-enemy-decrease', '#00000099', 'style', 'color');

	setTimeout(() => {
		setByClass('battle-player-decrease', '0.8s', 'style', 'transition');
		setByClass('battle-enemy-decrease', '0.8s', 'style', 'transition');
		setByClass('battle-player-decrease', '#00000000', 'style', 'color');
		setByClass('battle-enemy-decrease', '#00000000', 'style', 'color');
		setTimeout(() => {
			setByClass('battle-player-decrease', '0s', 'style', 'transition');
			setByClass('battle-enemy-decrease', '0s', 'style', 'transition');
		}, 520)
	}, 200);
	return true;
}

function forfeitFight() {
	player.switchTab('enemy');
	player.inBattle = false;
	setByClass('battle-end', 'none', 'style', 'display');
	clearInterval(battleTurns);
}