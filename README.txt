
############################
#  Title: Memory Task App  #
#  Author: Elisabeth Reid  #
############################

version 1.0

 ----------------------------
| Requrements/How to run App |
 ----------------------------

 Required:
	node.js is required to run the server.
	You can install node.js from: https://nodejs.org/en/
        
        Chrome is required to play the app. Other web browsers may work but have not been tested.

 Setup:
       In the the terminal, while in the directory where the server.js is, type node server.js
       then open chrome to localhost:4201

 Operating System: 
       Windows 10


 -------------
| App Deatail |
 -------------

 Game Description:

	This app starts with a settings page where the pardicipant id can be entered, the game
	level can be selected (easy, medium, or difficult) before starting the actual memory task.
	Once settings are given click start to begin.

	The goal of the task is to recall numbers randomly placed on a grid of tiles (board) in accending order.
	To finish a game of any level sucessfuly, the participantd must complete the goal without
	any error. After which a new board will appear.

	If an error is made a buzz sound will occur and a new board will be displayed.


 Data recording:

	Data is automatically recorded as a CSV file and is stored in the data folder.
	Data file name is the participant ID.
	The saved CSV file includes;
		- user ID
		- game level (easy, medium, difficult)
		- accuracy (was the goal sucessfully completed)
		- time stamp (year,month,day,hour,min,seconds,milliseconds)
		
	Note: the time stamp is recorded at the very start of a new board before any tiles are clicked.

 Levels:

	Easy game level:
		Three numbers in random positions on the board must be remembered and clicked in acending order.
		
		To start all grid spaces are filled and numbers are visible.

		The participant may begin clicking numbers at anytime. However, once the first number
		is clicked all unclicked number tiles will be covered by pattern tiles.

	Medium game level:
		Three numbers in random positions on the board must be remembered and clicked in acending order.
		
		To start only number tiles are present. Numbers are visible.

		The participant may begin clicking numbers at anytime. However, once the first number
		is clicked all grid spaces will be covered by tiles and unclicked number tiles will be covered.

	Difficult game level:
		Nine numbers in random positions on the board must be remembered and clicked in acending order.
		
		To start only the nine number tiles are present. Numbers are visible.

		The participant may begin clicking numbers at anytime. However, once the first number
		is clicked all number tiles will be covered by pattern tiles.
		
 ----------------------------
| Know Bugs and Improvements |
 ----------------------------
 
 Bugs:
 - Error when csv file being recorded to is open in another program
 
 Improvements:
 - Need to change how the board is constructed on the client end to improve loading speed. Right now each tile is requires a async call to the server. Changing the board generating to initially occur on the client end may speed things up.
 
