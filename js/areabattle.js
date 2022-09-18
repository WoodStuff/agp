function encounterMultiEnemy(enemies) {
	player.switchTab('area', 'multifight');
	
	let i = 0;
	for (const id of enemies) {
		const enemy = getEnemy(id);
		console.log(generateEnemyCard(id, i));
		i++;
	}
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

	document.getElementById('battle-enemies').appendChild(card);
}

function changeTarget(number) {
	areaVars.battle.target = number;
	document.querySelector('div.battle-enemy-card.target').classList.remove('target');
	document.querySelector(`div.battle-enemy-card[n="${number}"]`).classList.add('target');
}