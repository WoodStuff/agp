var zoneSelected = 0;

const canvas = document.createElement('canvas');
canvas.id = 'area-canvas';
canvas.innerHTML = 'sorry, internet exploder 0.3.1 is not supported for agp';
document.getElementById('area-play').appendChild(canvas);

const ctx = canvas.getContext('2d');

const DIFFS = {
	basic: {
		dp: [0, 100],
		color: '#676ab8',
		display: 'Basic',
	},
	easy: {
		dp: [101, 500],
		color: '#63c7cc',
		display: 'Easy',
	},
	medium: {
		dp: [501, 1500],
		color: '#5fd058',
		display: 'Medium',
	},
	challenging: {
		dp: [1501, 3000],
		color: '#ced058',
		display: 'Challenging',
	},
	hard: {
		dp: [3001, 5000],
		color: '#d05858',
		display: 'Hard',
	},
	extreme: {
		dp: [5001, 15000],
		color: '#873a3a',
		display: 'Extreme',
	},
	insane: {
		dp: [15001, 50000],
		color: '#a6469e',
		display: 'Insane',
	},
	fargame: {
		dp: [50001, 500000],
		color: '#d4d4d4',
		display: 'Far Game',
	},
	endgame: {
		dp: [500001, Infinity],
		color: '#353535',
		display: 'End-game',
	},
}
const firstZoneButton = document.getElementById('first-zone');
const prevZoneButton = document.getElementById('prev-zone');
const nextZoneButton = document.getElementById('next-zone');
const lastZoneButton = document.getElementById('last-zone');
const selectZoneButton = document.getElementById('select-zone');
const areaDiffsButton = document.getElementById('go-to-area-diffs');
const areaBox = document.getElementById('area-box');
const areaContainer = document.getElementById('area-container');
const areaInfo = document.getElementById('area-info');
const areaInfos = document.getElementById('area-infos');

firstZoneButton.addEventListener('click', () => navigateZone('first'));
prevZoneButton.addEventListener('click', () => navigateZone('prev'));
nextZoneButton.addEventListener('click', () => navigateZone('next'));
lastZoneButton.addEventListener('click', () => navigateZone('last'));
selectZoneButton.addEventListener('click', selectArea);
areaDiffsButton.addEventListener('click', () => player.switchTab('area', 'diffs'));

function navigateZone(direction) {
	switch (direction) {
		case 'first':
			zoneSelected = 0;
			break;

		case 'prev':
			zoneSelected--;
			break;

		case 'next':
			zoneSelected++;
			break;

		case 'last':
			zoneSelected = AREAS.length - 1;
			break;
	
		default:
			break;
	}

	if (zoneSelected < 0) zoneSelected = 0;
	if (zoneSelected > AREAS.length - 1) zoneSelected = AREAS.length - 1;

	document.getElementById('picked-zone').innerHTML = zoneSelected;
	document.getElementById('select-zone').innerHTML = `Go to Zone ${zoneSelected}`;

	return rbSelected;
}

function getDifficulty(dp) {
	for (const d in DIFFS) {
		if (dp >= DIFFS[d].dp[0] && dp <= DIFFS[d].dp[1]) return d;
	}
	return null;
}
function getDiffDisplay(dp) {
	for (const d in DIFFS) {
		if (dp >= DIFFS[d].dp[0] && dp <= DIFFS[d].dp[1]) return DIFFS[d].display;
	}
	return null;
}

function selectArea() {
	player.switchTab('area', 'select');

	while (areaContainer.firstChild) {
		areaContainer.removeChild(areaContainer.lastChild);
	}
	
	let lockNext = [false, false];
	for (const area of AREAS[zoneSelected]) {
		if (lockNext[0]) lockNext[1] = true;

		const areaButton = document.createElement('button');
		areaButton.classList.add('area-box');
		areaButton.id = `area-box-${area.area[0]}-${area.area[1]}`;
		areaButton.innerHTML = area.name;
		areaButton.addEventListener('click', () => startArea(area.area[0], area.area[1]));

		if (area.area[0] == player.areas.progress[0] && area.area[1] == player.areas.progress[1]) lockNext[0] = true;

		const areaID = document.createElement('span');
		areaID.classList.add('area-id');
		areaID.id = `area-id-${area.area[0]}-${area.area[1]}`;
		areaID.innerHTML = `${area.area[0]}-${area.area[1]}`;
		areaButton.appendChild(areaID);

		const areaColor = document.createElement('div');
		areaColor.classList.add('area-color');
		areaColor.id = `area-color-${area.area[0]}-${area.area[1]}`;
		areaColor.style.backgroundColor = DIFFS[getDifficulty(area.dp)].color;
		areaColor.title = getDiffDisplay(area.dp);
		areaButton.appendChild(areaColor);

		areaContainer.appendChild(areaButton);
		if (lockNext[1]) {
			/*areaButton.disabled = true;
			break;*/
		}
	}
}

const DIR = {
	up: 0,
	left: 1,
	down: 2,
	right: 3,
}
const areaVars = {
	zone: 0,
	area: 0,
	tileSize: 1,
	spawnX: -1,
	spawnY: -1,
	player: {
		x: 0,
		y: 0,
		direction: DIR.up,
	}
}

var areaTick;
function startArea(zone, area) {
	player.switchTab('area', 'play');
	player.inArea = true;
	areaVars.zone = zone;
	areaVars.area = area;

	areaVars.player.direction = getArea(zone, area).startDir;
	
	areaTick = setInterval(progressArea, player.TBM);
	
	renderArea();
}

function progressArea() {
	// BM = before movement
	const tileAtBM = getMeaning(getArea(areaVars.zone, areaVars.area),
		getArea(areaVars.zone, areaVars.area).data[areaVars.player.y].charAt(areaVars.player.x));

	if (tileAtBM.category == 'control' && ['up', 'left', 'down', 'right'].includes(tileAtBM.name)) {
		areaVars.player.direction = DIR[tileAtBM.name];
	}

	if (tileAtBM.category == 'enemy') {
		if (!tileAtBM.name == 'multi') {
			
		}
	}

	switch (areaVars.player.direction) {
		case DIR.up:
			areaVars.player.y--;
			break;

		case DIR.left:
			areaVars.player.x--;
			break;

		case DIR.down:
			areaVars.player.y++;
			break;

		case DIR.right:
			areaVars.player.x++;
			break;
	
		default:
			break;
	}

	// AM = after movement
	const tileAtAM = getMeaning(getArea(areaVars.zone, areaVars.area),
		getArea(areaVars.zone, areaVars.area).data[areaVars.player.y].charAt(areaVars.player.x));

}

function renderArea() {
	const width = canvas.width = 0.85 * window.innerWidth;
	const height = canvas.height = window.innerHeight - document.getElementById('area-current-title').clientHeight;

	const area = getArea(areaVars.zone, areaVars.area);

	const areaWidth = area.data[0].length;
	const areaHeight = area.data.length;

	const resizeSide = ((height / width) * areaHeight < areaWidth) ? 'width' : 'height'; // the thing that covers the entire screen
	areaVars.tileSize = resizeSide == 'width' ? width / areaWidth * 0.9 : height / areaHeight * 0.9;

	ctx.clearRect(0, 0, width, height);

	let x = 0;
	let y = 0;

	const offsetX = (width / 2) - (areaVars.tileSize * areaWidth / 2);
	const offsetY = (height / 2) - (areaVars.tileSize * areaHeight / 2);
	
	for (const row of area.data) {
		for (const tile of row) {
			const meaning = getMeaning(area, tile);

			// this needs to be done as soon as possible
			if (meaning.name == 'start') {
				areaVars.spawnX = x;
				areaVars.spawnY = y;
				if (areaVars.player.x == -1 && areaVars.player.y == -1) {
					areaVars.player.x = x;
					areaVars.player.y = y;
				}
			}

			if (!(meaning.category == 'control' && meaning.name == 'none')) {
				ctx.fillStyle = '#00000033';
				ctx.lineWidth = 1;
				ctx.strokeRect((areaVars.tileSize * x) + offsetX, (areaVars.tileSize * y) + offsetY, areaVars.tileSize, areaVars.tileSize);
				ctx.fillRect((areaVars.tileSize * x) + offsetX, (areaVars.tileSize * y) + offsetY, areaVars.tileSize, areaVars.tileSize);

				ctx.drawImage(meaning.image,
					(areaVars.tileSize * x) + offsetX + areaVars.tileSize * 0.125,
					(areaVars.tileSize * y) + offsetY + areaVars.tileSize * 0.125,
					areaVars.tileSize * 0.75, areaVars.tileSize * 0.75);
			}

			if (areaVars.player.x == x && areaVars.player.y == y) {
				ctx.globalAlpha = meaning.invisible ? 0.5 : 0.25;
				const playerImg = new Image();
				playerImg.src = `media/player.png`;
				ctx.drawImage(playerImg,
					(areaVars.tileSize * x) + offsetX + areaVars.tileSize * 0.125,
					(areaVars.tileSize * y) + offsetY + areaVars.tileSize * 0.125,
					areaVars.tileSize * 0.75, areaVars.tileSize * 0.75);
				ctx.globalAlpha = 1;
			}
			x++;
		}
		y++;
		x = 0;
	}


	requestAnimationFrame(renderArea);
}

function getArea(p1, p2) { // function overloading lmao
	// 1. p1 is the zone and p2 is the area (getArea(5, 2))
	// 2. p1 is a string thats just both (getArea('5-2'))

	if (typeof p2 !== 'undefined') return AREAS[p1][p2];

	const array = p1.split('-');
	return AREAS[array[0]][array[1]];
}
function getMeaning(area, char) { // area is the whole area and char is the character to get info out
	const info = {
		category: 'none',
		name: 'none',
		image: new Image(),
		extra: [], // this is for extra parameters
		invisible: false,
	}
	string = area.key[char];
	const split = string.split('-');
	info.name = split[1];
	switch (split[0]) {
		case 'c':
			info.category = 'control';

			// add control tiles here to make them not show on the area, they'll be invisible
			const invisible = ['path', 'none', 'up', 'left', 'down', 'right'];
			if (!invisible.includes(info.name)) info.image.src = `media/areaicons/control ${info.name}.png`;
			else info.invisible = true;
			break;

		case 'e':
			info.category = 'enemy';

			if (info.name == 'multi') {
				info.extra = split.slice(2);
				info.image.src = 'media/areaicons/multi enemy.png';
			}
			else {
				info.image.src = `media/enemies/${info.name}.png`;
			}
			break;
	
		default:
			break;
	}

	return info;
}