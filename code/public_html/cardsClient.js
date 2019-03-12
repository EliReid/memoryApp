/*
  Name: Elisabeth Reid

*/

var boardSize = [4,8];
var clicked = false;
var tiles = [];
var allTiles = [];
var clickable = true;
var correct = new Audio('sounds/Click.mp3');
var error = new Audio('sounds/buzz.mp3');
var happy = new Audio('sounds/HappyShort.wav');

window.onload = startGame

function startGame(){
	
    //fetchBordSize();
	buildBoard(boardSize);
}

function fetchBoardSize(){

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://ipinfo.io/json", false);
    xhr.send();

    var res = xhr.response;
}

function buildBoard(boardSize){

	[n,m] = boardSize;
	// Find a <table> element with id="gameboard":
	var board = document.getElementById("gameboard");

	// Create an empty <tr> element and add it the table:
	for (var i =0; i < n; i++){

		var row = board.insertRow();
		tableRow(row, m, i);
	}

    // Now that board has been created add an event 
    // listener <table> element with id="gameboard":
	board.addEventListener("click", checkTile, false);
 
	function checkTile(e) {
    	if (e.target !== e.currentTarget && clickable) {

    		var target = e.target;
        	var clickedItem = e.target.id;

        	[n,m] = clickedItem.split(" ");
       
        	if(!clicked && n && m){
        		console.log("first click!");
        		coverTiles(tiles,target);
        	}

        	// ask server what's under the tile and reveal accordingly
        	if(n && m){ look(n,m,target); }
    	}
    	e.stopPropagation();
	}

	function coverTiles(tiles, target){

		console.log("Covering tiles");

		for (var i =0; i < tiles.length; i++){
			tile = tiles[i];
			console.log(tile.id);
			if(tile !== target){tile.src = "images/tile.jpg";}
		}
	}

	function look(n,m,tile){
		var xhr = new XMLHttpRequest();
		xhr.open("GET","/board/guess?n="+n+"&m="+m, true);
		xhr.onload = function (e) {
  		if(xhr.readyState === 4) {
    		if(xhr.status === 200) {

    			var response = JSON.parse(xhr.responseText);

    			if(response.clearAll && !clicked){
    				for (var i =0; i < allTiles.length; i++){
						allTiles[i].src = "images/tile.jpg";
					}
    			}
    			clicked = true;

    			if(response.tile){

    				tile.src = "images/"+response.tile+".jpg";
    			}

    			if(response.accuracy === 'correct'){
    				correct.play();

    				// Check if server says all number buttons have been pressed.
    				if(response.end){
    					//happy.play();
    					clickable = false;
    					setTimeout(function(){location.reload();}, 100);
    				}

    			}else if(response.accuracy === 'incorrect'){
    				
    				clickable = false;
    				error.play();
    				setTimeout(function(){location.reload();}, 720);
    			}

    			console.log(response);
    		} else { console.error(xhr.statusText); }
  		}};
		xhr.onerror = function(e) { console.error(xhr.statusText); };
		xhr.send(null);
	}
}

function tableRow(row, n, rowNum){
    // Create an empty <tr> element and add it to last position of the table:
    // The server will rellay what each tile should display

    function look(rowNum,cellNum){
        var xhr = new XMLHttpRequest();
        xhr.open("GET","/board?n="+rowNum+"&m="+cellNum, true);
        xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                var cell = row.insertCell();

                var defultImg = document.createElement('img');
                defultImg.id = ""+rowNum+" "+cellNum;
                allTiles.push(defultImg);

                img = "images/tile.jpg"
                if(xhr.responseText !== '"tile"'){

                    if(xhr.responseText === '"black"'){
                        img = "images/black.jpg";
                    } else {

                        img = "images/" + xhr.responseText + ".jpg";
                        tiles.push(defultImg);
                    }
                }

                defultImg.src = img;
                defultImg.alt = "white and grey diagonal striped tile";
                cell.appendChild(defultImg);

            } else {
                console.error(xhr.statusText);
            }
        }};
        xhr.onerror = function (e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }

    for (var i =0; i < n; i++){

        look(rowNum,i);
    }
}