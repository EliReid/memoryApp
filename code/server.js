/*
  Name: Elisabeth Reid

*/
// Open web browser to address: http://localhost:4201/
// Participant data will be stored in file with name participantID+Date

// load necessary modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var hex = require('./res/hexcodes.js');
const url = require('url');
const ROOT = "./public_html";
const querystring = require('querystring');

// Variables which are used as settings and/or keep track of game progress
var boardSize = [4,8];
var maxNum = 3;
var game = [];
var numbers = [];
var clickedNumbers = [];
var userID = "";
var mode;
var obj = {};
var clock = new Date();
var startTime
var endTime

// create http server
var server = http.createServer(handleRequest);
server.listen(4201);
console.log('Server listening on port 4201');
console.log(' Visit http://localhost:4201/');

function handleRequest(req, res) {

	//process the request
	console.log("Request for: "+req.url);
	var filename = ROOT+req.url;
	
	//parse the url
	var code = 500;
	var data = "";
	
	var urlObject = url.parse(req.url,true);

	//print request details
	console.log("Request path name: " + urlObject.pathname);

	if(urlObject.pathname==="/game"){

		// Record the data of the previouse game if it is available
		recordData(userID,obj);

		// Prepare variables
		clearLastGameData();

		if(urlObject.search){

			q = querystring.parse(urlObject.search.substring(1));
			console.log(q);

			mode = q.difficulty;
			userID = q.ID;

			if(mode === "diff"){
				maxNum = 9;
			}
			
			// Construct the board and save it in game vairable
			gameData = hex.makeBoard(boardSize,maxNum);
			numbers = gameData.numbers;
			game = gameData.board;
			console.log(game);
		}

		// Prepare the game.html file
		file = ROOT+"/game.html"
		console.log("Getting file: "+ file);
		data = fs.readFileSync(ROOT+"/game.html");
		code = 200;

		// sor the recently added game numbers (lowest to highest)
		numbers.sort();

	}else if(urlObject.pathname==="/board"){
		//console.log(urlObject.search);

		if(urlObject.search){

			q = querystring.parse(urlObject.search.substring(1));

			if(req.method==="GET"){
				var n = q.n;
				var m = q.m;
				
				if(game[n][m]){

					number = game[n][m];
					numbers.push(number);
					respond(200,JSON.stringify(number));
				}
				//send the tile message if nothing is there
				if(mode !== "easy"){
					respond(200,JSON.stringify("black"));
				}else{
					respond(200,JSON.stringify("tile"));
				}
			}
		}
	}else if(urlObject.pathname==="/board/guess"){

		if(urlObject.search){

			q = querystring.parse(urlObject.search.substring(1));

			if(req.method==="GET"){

				var n = q.n;
				var m = q.m;

				if(mode === 'mid'){
					obj.clearAll = true;
				}
				
				console.log("n = "+n+"m = "+m);

				try{
					if(game[n][m]){

						number = game[n][m];
						obj.tile = number;
						clickedNumbers.push(number);

						if(number === numbers[clickedNumbers.length - 1]){

							obj.accuracy = "correct";
						} else {
							obj.accuracy = "incorrect";
						}

						obj.end = clickedNumbers.length === maxNum;

						respond(200,JSON.stringify(obj));
					}else{

						obj.accuracy = "incorrect";
						if(mode === "diff") obj.tile = "black";
						else obj.tile = "tile";
					}
				}

				catch(err){
					console.log(err);
					obj = {}
				}
				
				respond(200,JSON.stringify(obj));
			}
		}

	}
	//serve defult page
	else if(fs.existsSync(filename)){		
		var stats = fs.statSync(filename);
		if(stats.isDirectory()){
			filename += "/index.html";
		}
		console.log("Getting file: "+filename);
		data = fs.readFileSync(filename);
		code = 200;
	//Returns 404 page if file dosen't exist	
	}else{
		console.log("File not found");
		code = 404;
		data = fs.readFileSync(ROOT+"/404.html");
	}

	// content header
	res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
	// write message and signal communication is complete
	res.end(data);
	
	//locally defined helper function
	//sends off the response message for json objects
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'application/json'});
		// write message and signal communication is complete
		res.end(data);
	}
};

// Helper functions

function clearLastGameData(){

	maxNum = 3;
	game = [];
	numbers = [];
	clickedNumbers = [];
	userID = "";
	obj = {};
	clock = new Date();
}

function recordData(id,data){

	if(!id || id === "") { return; }

	//create the file name to append to
	var fileName = "./data/"+id+".csv";
	var time = timeStamp(clock);

	//create the text to append to the file
	dataString = id+","+mode+","+data.accuracy+","+time+"\n"

	fs.appendFile(fileName, dataString, function (err) {
  		if (err) throw err;
  		console.log(' Updated!');
	});
}

function timeStamp(clock){

	var dd = clock.getDate();
	var mm = clock.getMonth() + 1; //January is 0
	var yyyy = clock.getFullYear();
	var hours = clock.getHours();
	var min = clock.getMinutes();
	var seconds = clock.getSeconds();
	var milliseconds = clock.getMilliseconds();

	if (dd < 10) {
  		dd = '0' + dd;
	}
	if (mm < 10) {
  	mm = '0' + mm;
	}

	now = mm + '/' + dd + '/' + yyyy + "-" + hours + ":" + min + ":" + seconds + ":" + milliseconds;
	return now;
}