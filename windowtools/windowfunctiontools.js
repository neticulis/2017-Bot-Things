// Holds all the tool functions
window.tools={};

		/*		BALANCE / BANKROLL TOOLS	*/
		/*		Balance Vs History	*/

// true if balance history is saved (disableHogs.balanceHistory==false)
// if false, balance tools will not work. 
tools.is_balance_historySaved=function(){
	if (disableHogs.balanceHistory==true){
		console.log('Notice: balance/bankroll tools cannot check history, it is disabled. To enable, type:\ndisableHogs.balanceHistory=false');
		return false
	} else {
		return true
	}
}
// Returns true if balance increased of numGames 
tools.has_balance_Increased=function(numGames=1){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	return (player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-numGames)]);
}

// Returns balance difference over numGames diff=(current-previous)
tools.get_balance_diff=function(numGames=1){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	return (player.balanceHistory['gid_'+(game.gameID-numGames)]-player.currentBankroll);
}
// compare current balance to previous games, to get the lowest amount under 0 - this is amount to make up for
// if returns -1000, it was 10 bits above our current balace, and that was the highest we were at 
tools.get_balance_highestNegative=function(numGames=null){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	var balanceHistoryLength=Array.from(Object.keys(player.balanceHistory)).length; 
	var bald=[]; var lowest=0; 
	numGames==null?numGames=balanceHistoryLength:null; 
	for (var a=1;a<numGames;a++){tools.get_balance_diff(a)<lowest?lowest=tools.get_balance_diff(a):null;bald.push(tools.get_balance_diff(a));} 
	return lowest
}

// returns the number of games where your balance was higher than current balance
// If this number is lowering over time, you are winning
// If this number is 0, you are at the highest balance youve been at since you started the bot
tools.get_balance_numGamesWereHigher=function(numGames=null){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	var balanceHistoryLength=Array.from(Object.keys(player.balanceHistory)).length; 
	var higherB=0; var lowerB=0; var lowest=0; 
	numGames==null?numGames=balanceHistoryLength:null; 
	for (var a=1;a<numGames;a++){
		
		tools.get_balance_diff(a)>0?higherB++:lowerB++;
	} 
	return higherB
}

// returns the number of games where your balance was lower than current balance
// If this number is rising over time, you are winning
// If this number is 0, you are at the lowest balance youve been at since you started the bot
tools.get_balance_numGamesWereLower=function(numGames=null){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	var balanceHistoryLength=Array.from(Object.keys(player.balanceHistory)).length; var higherB=0; var lowerB=0; var lowest=0; 
	numGames==null?numGames=balanceHistoryLength:null; 
	for (var a=1;a<numGames;a++){tools.get_balance_diff(a)<0?lowerB++:higherB++;} 
	return lowerB
}

tools.get_balance_closestNegative=function(numGames=null){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	var balanceHistoryLength=Array.from(Object.keys(player.balanceHistory)).length; var bald=[]; var lowest=0; 
	numGames==null?numGames=balanceHistoryLength:null; 
	for (var a=1;a<numGames;a++){
		if (tools.get_balance_diff(a)<lowest){
			lowest=tools.get_balance_diff(a);
			//if we break here, we will have the first neg
			break;
		}
	}
	return lowest
}
// compare current balance to previous games, to get the highest amount over 0 - this is what we want to stay above
// if returns 1000, it was 10 bits below our current balace
tools.get_balance_highestPositive=function(numGames=null){
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length==0){return null} 
	var balanceHistoryLength=Array.from(Object.keys(player.balanceHistory)).length; 
	numGames==null?numGames=balanceHistoryLength:null;
	var bald=[]; 
	var highest=0; 
	for (var a=1;a<numGames;a++){
		tools.get_balance_diff(a)>highest?highest=tools.get_balance_diff(a):null;bald.push(tools.get_balance_diff(a));
	} 
	return highest
}


			/* BINARY STRING TOOLS */ 
// adds a binary string together, EX 1011001=4
tools.get_binarySum=function(binstring=null){
		if (binstring==null){
			console.log('get_binarySum needed binary string');
			return null
		}
		return eval(Array.from(binstring).join('+'))
	}

			/* STRING ANALYZING TOOLS */ 

// returns the number of times a string was seen inside of another string - mostly for analyzing binary strings
tools.occurences=function(string, subString, allowOverlapping=1){
	
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

tools.chat=function(say){
	// we cant call engine from window functions, but we can call our chat function in the player class
	player.chat(say);	
}

tools.addCommas=function(largeNumber) {
	return largeNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// Window Engine Triggers
// Can run all when triggered via: window.tools['on_'+this.trigger.arguments[0]]();
tools.on_game_starting(data=null){
	// window function to run on game_starting trigger
}
tools.on_game_started(data=null){
	// window function to run on game_started trigger
}
tools.on_game_crash(data=null){
	// window function to run on game_crash trigger
}
tools.on_cashed_out(data=null){
	// window function to run on cashed_out trigger
}
tools.on_player_bet(data=null){
	// window function to run on player_bet trigger
}
tools.on_msg(data=null){
	// window function to run on incoming msg trigger
}

// Profitable Players
tools.get_playersInProfitAsArray=function() {
    let pip = [];
    for (var userkey in players.known) {
        // if seen within last 6 minutes
        // and net profit is positive...
        // push to pip array
        if ((Date.now() - players.known[userkey].lastSeen) < 360000 && players.known[userkey].netProfit > 0) {
            pip.push(Math.round(players.known[userkey].netProfit)+'|'+players.known[userkey].username);
        }

    }
    // Sort in descending profit, cell 0 is the top player
    players.playersInProfit=pip=pip.sort(function(a,b){return b.split('|')[0]-a.split('|')[0]});
    return pip;
}

tools.get_numPlayersPlayingInProfit = function () {
	window.tools.get_playersInProfitAsArray();
	players.profitablePlayersPlaying = 0;
	for (pr in players.profitablePlayers) {
		game.playersJoined.toString().indexOf(players.profitablePlayers[pr]) >= 0 ? players.profitablePlayersPlaying++ : null;
	}
	return players.profitablePlayersPlaying
}

tools.chatPPPInfo = function () {
	window.tools.chat('Game #' + game.gameID + ' has started with ' + game.playersThatPlayed.length + ' players. ' + window.tools.get_numPlayersPlayingInProfit() + ' of them have a positive net profit since I started tracking ' + (((Date.now() - player.timeStarted) / 60000).toFixed(1)) + ' minutes ago. The #1 net profit is ' + (players.playersInProfit[0].split('|')[1]) + ' at ' + tools.addCommas((players.playersInProfit[0].split('|')[0] / 100).toFixed(0)) + ' bits. The #2 net profit is ' + (players.playersInProfit[1].split('|')[1]) + ' at ' + tools.addCommas((players.playersInProfit[1].split('|')[0] / 100).toFixed(0)) + ' bits. The #3 net profit is ' + (players.playersInProfit[2].split('|')[1]) + ' at ' + tools.addCommas((players.playersInProfit[2].split('|')[0] / 100).toFixed(0)) + ' bits.');
}
