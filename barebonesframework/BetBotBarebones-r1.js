'use strict';
/* ~~~~~ GAMBLETRON BARE BONES BET BOT - (C) Neti AKA MathWins 2017 All Rights Reserved ~~ \
 * This is only a skeleton bot, it has the bare essentials needed for the framework
 * all upgrades are in the Addons folder, and code must be copied and pasted directly into this script 
 * Eventually this should be automated so it builds a script using only the parts we need for a strategy
\~~~~~ */ window.gtbb={}; gtbb.ver= 'GTBB (Bare) v0.0101a'; /* ~~~~~~~~ */ 


 /* ~~~~~~~	The Match Class handles the main game data ~~~~~~/
  * window.gtbb.game will contain a new match spawn during init
\ ~~~~ */ window.gtbb.game=null; /* ~~~~~~~~ */ 
class Match(){
	constructor(data=null){
		
	}
	addToHistory(data=null) {
		
	}
	reset(data = null) {
		// Variables that should be reset between games
	}
	game_starting(data = null) {

	}
	game_started(data = null) {

	}
	game_crash(data = null) {
		
	}
	player_bet(data = null) {
		
	}
	cashed_out(data = null) {

	}
	msg(data = null) {
		
	}
}

 /* ~~~~~~~	Bustabit Engine Triggers/API ~~~~~ (paste addons ABOVE this)~~~~~~/
  * All game data is pushed to us via engine.on 
  * This should stay at the bottom of the script with the engine.on's
  \ ~~~~ */	window.babListen={} /* ~~~~~~~~ */ 

// the incomingData function directs incoming data to the correct functions and classes based on the trigger
babListen.incomingData=function(data=null){
	(typeof window.betbotinit=='undefined' || window.betbotinit==null)?betbotinit=true:null;
	if (!data){ return null	}
	// triggerFired will be a string with one of the 6 engine.on triggers
	let triggerFired=this.trigger.arguments[0];
	// if betbotinit is true, the script is being ran for the first time
	// otherwise gtbb should contain the match class and its trigger handlers
	if (betbotinit!=true && gtbb.game){
		// Bot initiated, start handling incoming data
		// Send data to match class trigger routine
		gtbb.game[triggerFired](data);

	} else if (betbotinit===true){
		// Create the bot framework
		
		// Initialize the Match class to handle incoming betting data
		gtbb.game=new Match();
	}
	
}

engine.on('game_starting', engineListener);
engine.on('game_started', engineListener);
engine.on('game_crash', engineListener);
engine.on('cashed_out', engineListener);
engine.on('player_bet', engineListener);
engine.on('msg', engineListener);
