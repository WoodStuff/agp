/**
 * The player.
 */
const player = new Player();
const decimalstats = ['currency', 'rocks', 'attack', 'maxhp', 'hp', 'accy', 'block'];
const objdecimals = { rbu: ['current', 'collect', 'gained'] };
const allobjdec = ['xp', 'bars', 'items'];

function start() {
	startUpdateStats();
};


function tick() {
	if (typeof player == 'undefined') return false;

	player.updateTiles();

	if (player.rbu.cooldown < 1) {
		player.rbu.cooldown = 2;
		player.rbu.disabled = false;
	}
	document.getElementById('collect-rbu').disabled = player.rbu.disabled;

	if (player.battles.won > 0) document.getElementById('spawner-tutorial-thingy').style.display = 'none';

	return true;
}
const tickloop = setInterval(tick, 50);


// main stuff
let updateStats;
function startUpdateStats() {
	updateStats = setInterval(() => {
		document.getElementById('currencyDisplay').innerHTML = formatWhole(player.currency);
		document.getElementById('rbu-counter').innerHTML = document.getElementById('rbuDisplay').innerHTML = formatWhole(player.rbu.current);
		document.getElementById('levelDisplay').innerHTML = formatWhole(player.xp.level);
		document.getElementById('xpDisplay').innerHTML = formatWhole(player.xp.current);
		document.getElementById('maxXpDisplay').innerHTML = formatWhole(player.xp.max);
		document.getElementById('toggle-spawn-img').src = player.spawner.on ? 'media/spawner on.png' : 'media/spawner off.png';
		document.getElementById('rbu-per-collect').innerHTML = player.rbu.collect;

		if (!(player.inBattle || player.inArea)) {
			console.log('a');
			player.attack = calcstats.attack();
			player.maxhp = calcstats.hp();
			player.hp = calcstats.hp();
			player.accy = calcstats.accy();
			player.block = calcstats.block();
		}

		const counts = document.getElementsByClassName('consumable-count');
		let hovered = '';
		for (const item of document.getElementsByClassName('consumable-item')) {
			if (getItemCount(item.id.slice(4)).eq(0)) item.style.display = 'none';
			else item.style.display = 'block';
			if (!item.matches(':hover')) continue;
			hovered = item.id.slice(4);
			break;
		}
		for (const count of counts) {
			if (hovered == '') {
				count.innerHTML = '';
				continue;
			}
			count.innerHTML = `${getItem(hovered).display}: ${formatWhole(getItemCount(hovered))}`;
		}

		areaInfo.style.width = `${areaBox.offsetWidth - areaContainer.offsetWidth - 20}px`;

		let area;
		for (const item of document.getElementsByClassName('area-box')) {
			if (!item.matches(':hover') || item.disabled) continue;
			hovered = item.id.slice(9);
			area = getArea(hovered);
			break;
		}
		if (hovered) {
			document.getElementById('area-info-header').innerHTML = `${hovered}: ${area.name}`;

			while (areaInfos.firstChild) {
				areaInfos.removeChild(areaInfos.lastChild);
			}

			let enemyTypes = [];
			for (const type in area.enemies.groups) {
				if (Object.hasOwnProperty.call(area.enemies.groups, type)) {
					const count = area.enemies.groups[type];
					enemyTypes.push(`${count} ${type}`);
				}
			}
			enemyTypes = enemyTypes.join(', ');
			
			const areaIDesc = document.getElementById('area-idesc');
			areaIDesc.innerHTML = area.desc;

			const areaIDiff = document.createElement('li');
			areaIDiff.id = `area-idiff`;
			areaIDiff.innerHTML = `<b>Difficulty:</b> ${area.dp} DP - ${getDiffDisplay(area.dp)}`;
			areaInfos.appendChild(areaIDiff);

			const areaIEnemy = document.createElement('li');
			areaIEnemy.id = `area-ienemy`;
			areaIEnemy.innerHTML = `<b>Enemies:</b> ${area.enemies.total} enemies, ${area.enemies.kinds} different kinds. ${enemyTypes}`;
			areaInfos.appendChild(areaIEnemy);

			const areaIReward = document.createElement('li');
			areaIReward.id = `area-ireward`;
			areaIReward.innerHTML = `<b>Rewards: </b> ${formatWhole(area.rewards.currency)} currency, ${formatWhole(area.rewards.xp)} XP${area.rewards.display ? `, ${area.rewards.display}` : ''}`
			areaInfos.appendChild(areaIReward);
		}
	}, 50);
}

const autoSave = setInterval(() => {
	//save();
}, 15000);


function fixStuff() {
	if (typeof player.buffs[0] == 'object') player.buffs = [];
	if (player.items == undefined) player.items = {};
	if (player.attack) player.stats = new Stats(player.attack, player.maxhp, player.accy, player.block)
	if (player.attack != undefined) player.attack = undefined;
	if (player.maxhp != undefined) player.maxhp = undefined;
	if (player.hp != undefined) player.hp = undefined;
	if (player.accy != undefined) player.accy = undefined;
	if (player.block != undefined) player.block = undefined;
}