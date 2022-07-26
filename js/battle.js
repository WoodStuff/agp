var playerHP, playerMaxHP, playerATK, playerACCY, playerBLK, playerMiss;
var enemyHP, enemyMaxHP, enemyATK, enemyACCY, enemyBLK, enemyMiss, factor;
var battleTurns;
var pastEHP, pastPHP;

function fightEnemy(id, buff = 1) {
	let index = player.spawner.content.indexOf(id);
	if (index > -1) {
		player.spawner.content.splice(index, 1);
	}

	if (player.inArea) player.switchTab('area', 'fight');
	else player.switchTab('enemy', 'battle');
	player.inBattle = true;

	if (!player.inArea) {
		playerHP = player.maxhp;
		playerMaxHP = player.maxhp;
	}
	playerATK = player.attack;
	playerACCY = player.accy;
	playerBLK = player.block;

	enemyHP = getEnemy(id).hp.times(buff);
	enemyMaxHP = getEnemy(id).hp.times(buff);
	enemyATK = getEnemy(id).atk.times(buff);
	enemyACCY = getEnemy(id).accy;
	enemyBLK = getEnemy(id).blk.times(buff);
	factor = getEnemy(id).accyfactor;

	setByClass('battle-rewards', 'none', 'style', 'display')
	setByClass('battle-title', `Vs. ${getEnemy(id).name}`, 'innerHTML')
	setByClass('battle-enemy-img', `${getEnemy(id).img}`, 'src')
	
	updateBattleStats(true);
	setByClass('battle-player-decrease', '0s', 'style', 'transition')
	setByClass('battle-player-decrease', '#00000000', 'style', 'color')
	setByClass('battle-enemy-decrease', '0s', 'style', 'transition')
	setByClass('battle-enemy-decrease', '#00000000', 'style', 'color')

	battleTurns = setInterval(() => { battleTurn(id) }, player.TBA);
	return true;
}

function battleTurn(id) {
	if (!player.inBattle) return false;

	playerMiss = chance(factor.times(100).sub(playerACCY).div(factor).max(0).min(100).mag);
	enemyMiss = chance(new Decimal(100).sub(enemyACCY).mag);

	pastEHP = enemyHP;
	pastPHP = playerHP;
	if (!playerMiss) enemyHP = enemyHP.sub(Decimal.max(playerATK.sub(enemyBLK), new Decimal(0)));
	if (!enemyMiss) playerHP = playerHP.sub(Decimal.max(enemyATK.sub(playerBLK), new Decimal(0)));

	customTurns(id);

	if (playerHP.gt(playerMaxHP)) playerHP = playerMaxHP;
	
	updateBattleStats();

	if (!(enemyHP.lte(0) || playerHP.lte(0))) return; // battle has ended if continues past this

	clearInterval(battleTurns);
	setByClass('battle-end', 'block', 'style', 'display');
	setByClass('battle-end-message', player.inArea ? 'Returning in a bit.' : 'Click the button at the top left to exit.', 'innerHTML')
	
	if (enemyHP.lte(0) && !playerHP.lte(0)) win();
	if (enemyHP.lte(0) && playerHP.lte(0)) {
		if (player.inArea) lose();
		else tie();
	}
	if (!enemyHP.lte(0) && playerHP.lte(0)) lose();


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
			selectArea();
			player.inArea = false;
			player.inBattle = false;
			player.areas.lost++;
		}, player.TBA * 1.5);

		player.battles.total++;
		player.battles.lost++;
	}
}

function customTurns(id) {
	if (player.hasBuff('healthpotion') && chance(25)) playerHP = playerHP.add(1);
}

function updateBattleStats(first = false) {
	setByClass('battle-player-hp', `${format(playerHP)}/${format(playerMaxHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerATK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerACCY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerBLK)} BLK`, 'innerHTML');

	setByClass('battle-enemy-hp', `${format(enemyHP)}/${format(enemyMaxHP)} HP`, 'innerHTML');
	setByClass('battle-enemy-atk', `${format(enemyATK)} ATK`, 'innerHTML');
	setByClass('battle-enemy-accy', `${format(enemyACCY)} ACCY`, 'innerHTML');
	setByClass('battle-enemy-blk', `${format(enemyBLK)} BLK`, 'innerHTML');

	if (first) return true;
	setByClass('battle-player-decrease', enemyMiss ? 'Missed!' : `${(pastPHP.sub(playerHP)) * -1}`, 'innerHTML');
	setByClass('battle-enemy-decrease', playerMiss ? 'Missed!' : `${(pastEHP.sub(enemyHP)) * -1}`, 'innerHTML');
	setByClass('battle-player-decrease', '#00000099', 'style', 'color');
	setByClass('battle-enemy-decrease', '#00000099', 'style', 'color');
	setTimeout(decreaseStuff, 200);
	return true;
}

function decreaseStuff() {
	setByClass('battle-player-decrease', '0.8s', 'style', 'transition');
	setByClass('battle-enemy-decrease', '0.8s', 'style', 'transition');
	setByClass('battle-player-decrease', '#00000000', 'style', 'color');
	setByClass('battle-enemy-decrease', '#00000000', 'style', 'color');
	setTimeout(() => {
		setByClass('battle-player-decrease', '0s', 'style', 'transition');
		setByClass('battle-enemy-decrease', '0s', 'style', 'transition');
	}, 520)
	return true;
}

function forfeitFight() {
	player.switchTab('enemy');
	player.inBattle = false;
	setByClass('battle-end', 'none', 'style', 'display');
	clearInterval(battleTurns);
}