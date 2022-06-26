// utility
function chance(ch) {
	return Math.random() < (ch / 100);
}

function countValues(array, value) {
	return array.filter((v) => (v === value)).length;
}

function randomValue(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function removeValue(array, value) {
	var index = array.indexOf(value);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
}

function el(e) {
	return document.getElementById(e);
}