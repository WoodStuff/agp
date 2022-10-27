/**
 * Start a multi-enemy battle.
 * @param {string[]} enemies The enemies that will be battled.
 */
function encounterMultiEnemy(enemies) {
	player.switchTab('area', 'multifight');

	enemyStats = [];
	
	let i = 0;
	areaVars.battle.enemies = [];
	for (const id of enemies) {
		const enemy = getEnemy(id);
		areaVars.battle.enemies.push(id);
		areaVars.battle.alive.push(i);
		enemyStats.push(new Stats(enemy.atk, enemy.hp, enemy.accy, enemy.blk));
		document.getElementById('battle-enemies').appendChild(generateEnemyCard(id, i));
		i++;
	}

	areaVars.battle.target = 0;

	setByClass('battle-player-hp', `${format(playerStats.HP)}/${format(playerStats.MAXHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerStats.ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerStats.ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerStats.BLOCK)} BLK`, 'innerHTML');

	battleTurns = setInterval(() => { multiBattleTurn() }, player.TBA);
}

function generateEnemyCard(id, number) { // number is which position the enemy is in
	const enemy = getEnemy(id);

	const card = document.createElement('div');
	card.classList.add('battle-enemy-card');
	if (number == 0) card.classList.add('target');
	card.setAttribute('n', number);
	card.onclick = () => changeTarget(number);

	const be_decrease = document.createElement('p');
	const be_hp = document.createElement('p');
	const be_imgdiv = document.createElement('div');
	const be_img = document.createElement('img');
	const be_atk = document.createElement('p');
	const be_accy = document.createElement('p');
	const be_blk = document.createElement('p');

	be_decrease.classList.add('battle-stat', 'battle-enemy-decrease');
	be_hp.classList.add('battle-stat', 'battle-enemy-hp');
	be_img.classList.add('battle-enemy-img');
	be_atk.classList.add('battle-stat', 'battle-enemy-atk');
	be_accy.classList.add('battle-stat', 'battle-enemy-accy');
	be_blk.classList.add('battle-stat', 'battle-enemy-blk');

	be_hp.innerHTML = `${format(enemy.hp)}/${format(enemy.hp)} HP`;
	be_atk.innerHTML = `${format(enemy.atk)} ATK`;
	be_accy.innerHTML = `${format(enemy.accy)} ACCY`;
	be_blk.innerHTML = `${format(enemy.blk)} BLK`;

	be_imgdiv.classList.add('enemycard-imgdiv');
	be_imgdiv.style.width = '100%';
	be_imgdiv.style.display = 'flex';
	be_imgdiv.style.justifyContent = 'center';

	be_img.width = 128;
	be_img.height = 128;
	be_img.src = `media/enemies/${id}.png`;
	be_imgdiv.appendChild(be_img);

	card.appendChild(be_decrease);
	card.appendChild(be_hp);
	card.appendChild(be_imgdiv);
	card.appendChild(be_atk);
	card.appendChild(be_accy);
	card.appendChild(be_blk);

	return card;
}

function changeTarget(number) {
	if (!areaVars.battle.alive.includes(number)) return;
	areaVars.battle.target = number;
	document.querySelector('div.battle-enemy-card.target').classList.remove('target');
	document.querySelector(`div.battle-enemy-card[n="${number}"]`).classList.add('target');
}

function multiBattleTurn() {
	if (!player.inBattle) return false;
	
	const target = areaVars.battle.target;

	let factor = new Decimal(1); // placeholder, gonna remove in uhhh a few years when areas get to challenging difficulty or something
	let playerMiss = chance(factor.times(100).minus(playerStats.ACCURACY).div(factor).max(0).min(100).mag);
	let enemyMiss = [];
	for (const enemy of enemyStats) {
		if (enemy.dead()) {
			enemyMiss.push(true);
			continue;
		}
		enemyMiss.push(chance(new Decimal(100).minus(enemy.ACCURACY).mag));
	}

	console.log(enemyStats, target);
	let pastEHP = enemyStats[target].HP;
	let pastPHP = playerStats.HP;
	if (!playerMiss) enemyStats[target].damage(playerStats.ATTACK);
	for (const miss of enemyMiss) {
		if (!miss) playerStats.damage(enemyStats[target].ATTACK);
	}

	updateAreaBattleStats(target, pastPHP, pastEHP, playerMiss, enemyMiss);

	if (playerStats.dead()) {

	}
	let i = 0;
	for (const enemy of enemyStats) {
		if (enemy.dead()) {
			document.querySelector(`div.battle-enemy-card[n="${i}"]`).classList.add('dead');
			removeValue(areaVars.battle.alive, i);
			if (!areaVars.battle.alive.includes(i)) changeTarget(areaVars.battle.alive[0]);
		}
		i++;
	}
}

function updateAreaBattleStats(target, pastPHP, pastEHP, playerMiss, enemyMiss) {
	setByClass('battle-player-hp', `${format(playerStats.HP)}/${format(playerStats.MAXHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerStats.ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerStats.ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerStats.BLOCK)} BLK`, 'innerHTML');

	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-hp').innerHTML
		= `${format(enemyStats[target].HP)}/${format(enemyStats[target].MAXHP)} HP`;
	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-atk').innerHTML
		= `${format(enemyStats[target].ATTACK)} ATK`;
	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-accy').innerHTML
		= `${format(enemyStats[target].ACCURACY)} ACCY`;
	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-blk').innerHTML
		= `${format(enemyStats[target].BLOCK)} BLK`;

	if (pastPHP == undefined || pastEHP == undefined) return true;

	setByClass('battle-player-decrease', enemyMiss ? 'Missed!' : `${(pastPHP.minus(playerStats.HP)) * -1}`, 'innerHTML');
	setByClass('battle-player-decrease', '#00000099', 'style', 'color');
	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-decrease').innerHTML
	= playerMiss ? 'Missed!' : `${(pastEHP.minus(enemyStats[target].HP).times(-1))}`;
	document.querySelector('div.battle-enemy-card.target > p.battle-enemy-decrease').style.color = '#00000099';
	
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