function encounterMultiEnemy(enemies) {
	player.switchTab('area', 'multifight');

	enemyStats = [];
	
	let i = 0;
	for (const id of enemies) {
		const enemy = getEnemy(id);
		enemyStats.push({ atk: enemy.atk, maxhp: enemy.hp, hp: enemy.hp, accy: enemy.accy, blk: enemy.blk });
		document.getElementById('battle-enemies').appendChild(generateEnemyCard(id, i));
		i++;
	}

	setByClass('battle-player-hp', `${format(playerStats.HP)}/${format(playerStats.MAXHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerStats.ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerStats.ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerStats.BLOCK)} BLK`, 'innerHTML');

	battleTurns = setInterval(() => { multiBattleTurn(id) }, player.TBA);
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

	be_hp.innerHTML = `${format(enemy.hp)}/${format(enemy.hp)}`;
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
	areaVars.battle.target = number;
	document.querySelector('div.battle-enemy-card.target').classList.remove('target');
	document.querySelector(`div.battle-enemy-card[n="${number}"]`).classList.add('target');
}

function multiBattleTurn(id) {
	console.log('a');
}

function updateAreaBattleStats(number, pastPHP, pastEHP, playerMiss, enemyMiss) {
	setByClass('battle-player-hp', `${format(playerStats.HP)}/${format(playerStats.MAXHP)} HP`, 'innerHTML');
	setByClass('battle-player-atk', `${format(playerStats.ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-player-accy', `${format(playerStats.ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-player-blk', `${format(playerStats.BLOCK)} BLK`, 'innerHTML');

	setByClass('battle-enemy-hp', `${format(enemyStats[number].HP)}/${format(enemyStats[0].MAXHP)} HP`, 'innerHTML');
	setByClass('battle-enemy-atk', `${format(enemyStats[number].ATTACK)} ATK`, 'innerHTML');
	setByClass('battle-enemy-accy', `${format(enemyStats[number].ACCURACY)} ACCY`, 'innerHTML');
	setByClass('battle-enemy-blk', `${format(enemyStats[number].BLOCK)} BLK`, 'innerHTML');

	if (pastPHP == undefined || pastEHP == undefined) return true;
	setByClass('battle-player-decrease', enemyMiss ? 'Missed!' : `${(pastPHP.minus(playerStats.HP)) * -1}`, 'innerHTML');
	setByClass('battle-enemy-decrease', playerMiss ? 'Missed!' : `${(pastEHP.minus(enemyStats[0].HP)) * -1}`, 'innerHTML');
	setByClass('battle-player-decrease', '#00000099', 'style', 'color');
	setByClass('battle-enemy-decrease', '#00000099', 'style', 'color');
	setTimeout(decreaseStuff, 200);
	return true;
}