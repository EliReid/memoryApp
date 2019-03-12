function randomColor(){
	var r = Math.floor(Math.random()*256);	
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	return rgbToHex(r,g,b);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function makeColorList(len){
	var res=[];
	for(var i=0;i<len;i++){
		res.push(randomColor());
	}
	return res;
}

function rgbToHex(r,g,b){
	return "#"+byteToHex(r)+byteToHex(g)+byteToHex(b);
}

function byteToHex(n){
	return ""+numToHexChar(Math.floor(n/16))+""+numToHexChar(n%16);
}

function numToHexChar(num){
	switch(num){
		case 10: return "A";
		case 11: return "B";
		case 12: return "C";
		case 13: return "D";
		case 14: return "E";
		case 15: return "F";
		default: return ""+num;
	}	
}

function makeBoard(size,num){
	// assume square board
	// spaces without numbers are left empty (undifined)
	
	[n,m] = size;

	board = {'board':[]};
	for(var i=0;i<n;i++){
		board.board.push(Array(m));
	}

	// getting 3 or 9 non repeating random numbers
	numbers = new Set();
	while(numbers.size < num){
		z = getRandomInt(9);
		numbers.add(z + 1);
	}
	numbers = Array.from(numbers).sort();
	board.numbers = numbers;
	console.log(numbers);

	// creating random positions to put the numbers in
	positions = randomPositions(size, num);
	console.log(positions);
	for(var i=0;i<num;i++){
		[x,y] = positions[i];
		board.board[x][y] = numbers[i];
	}

	return board;
}

function randomPositions(size, num){
	
	[n,m] = size;

	set = new Set();
	map = {};

	while(set.size < num){
		x = getRandomInt(n);
		y = getRandomInt(m);

		key = ""+x+y;

		console.log(map[key]);

		if(!(map[key])){
			set.add([x,y]);
			map[key] = "set";
		}
	}

	return Array.from(set);
}

module.exports.makeBoard = makeBoard;
module.exports.randomColor = randomColor;
module.exports.rgbToHex = rgbToHex;
module.exports.byteToHex = byteToHex;
module.exports.numToHexChar = numToHexChar;
module.exports.makeColorList = makeColorList;