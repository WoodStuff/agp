function load(savefile = 'agpSave') {
	if (localStorage.getItem(savefile) == null) start();
	/** @type Player */
	let save = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem(savefile)))));

	for (const v in save) {// some random af code i dont understand that converts some strings into decimals because json sucks
		if (typeof save[v] != 'object') {
			if (decimalstats.includes(v)) save[v] = new Decimal(save[v]);
		}
		else {
			if (objdecimals.hasOwnProperty(v) || allobjdec.includes(v)) {
				for (const val in save[v]) {
					if (allobjdec.includes(v)) {
						if (typeof save[v][val] != 'object') save[v][val] = new Decimal(save[v][val]);
						else {
							for (const value in save[v][val]) {
								if (typeof save[v][val][value] == 'string') save[v][val][value] = new Decimal(save[v][val][value]);
							}
						}
					}
					else if (objdecimals[v].includes(val)) save[v][val] = new Decimal(save[v][val]);
				}
			}
		}
	} // its not worth adding comments to it anyway because too much work
	// if any of you feel like refactoring this i beg you please do it

	for (const v in save) {
		player[v] = save[v];
	}

	player.stats = new Stats(save.stats.attack, save.stats.maxhp, save.stats.accuracy, save.stats.block);
	
	const startData = new Player();
	for (const v in startData) if (player[v] == undefined) player[v] = startData[v];

	player.switchTab(player.tab/*,'finish'*/);
	startUpdateStats();

	for (enemy of player.spawner.content) {
		renderEnemy(enemy);
	}

	player.inBattle = false;
	player.inArea = false;

	return true;
}
function save(savefile = 'agpSave') {
	localStorage.setItem(savefile, btoa(unescape(encodeURIComponent(JSON.stringify(player)))));
	return player;
}
function hardReset(savefile = 'agpSave') {
	if (!confirm('Are you sure you want to hard reset? There is no going back!')) return false;

	const p = player;
	localStorage.removeItem(savefile);
	location.reload();
	return p;
}
function pageLoad(savefile = 'agpSave') {
	if (localStorage.getItem(savefile) != null) { // if the savefile exists
		load();
		fixStuff();
		return false;
	} 
	
	start(); // generate savefile
	save(savefile); // save the game so this doesn't happen again
	load(savefile); // load the game because why not i forgot why so

	return true;
}