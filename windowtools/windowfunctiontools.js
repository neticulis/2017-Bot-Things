// Holds all the tool functions
window.tools={};


			/* Tools made during/for the ByteBuster strategy prototyping */


 /* tools.get_betForDesiredProfitAtX([profitDesiredInSatoshis],[Multiplier])
 |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|
 | returns the bet amount needed to make [profitDesired] at [Multiplier]x                           |
 | Example: "I want to make 100 bits profit, at multiplier 3.3x, what should I bet?"                |
 | Answer: betAmount=tools.get_betForDesiredProfitAtX(10000,330) // returns 4400 (44.00 bit bet)    |
 |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.tools.get_betForDesiredProfitAtX = function (profitDesired = 1600, MultiplierX = 200) {
	let amountToBet = null;
	amountToBet = (profitDesired / ((MultiplierX / 100) - 1));
	return amountToBet;
}

 /* tools.get_martingaleBetMultiple([Multiplier]) - Perfect martingales / chase for any multiplier
 |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
 | Given a multiplier, returns the "Increase bet by ___x on loss" multiple/number needed in order to recover losses   /
 | Example for 2x: tools.get_martingaleBetMultiple(200) // returns 2, every time you lose, you double your bet       /
 | Example for 1000x: tools.get_martingaleBetMultiple(100000) // returns 1.001 (increase bet * 1.001 on every loss) /
 | Example for 12.34x: tools.get_martingaleBetMultiple(1234) // returns 1.087 (increase bet * 1.087 on every loss) /
 |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
window.tools.get_martingaleBetMultiple = function (yourMultiplier = 200) {
	((yourMultiplier + '').includes('.') || yourMultiplier<100)?yourMultiplier=Math.round(yourMultiplier*100):null;
	let digits = (yourMultiplier + '').length-1;
	return (((Math.ceil((1 / (1 - (Math.ceil(((100 / 101) * (99 / (((yourMultiplier*1)/100) * 100 - 1))) * (10 ** digits))) / (10 ** digits))) * (100 ** (digits-1))) / (100 ** (digits-1))).toFixed(digits))/1)
}


			/* Tools made during/for the group follow prototyping */


// pip: players in profit
// return array of players in iprofit seen within last 12 minutes with 2+ games played
// iprofit is netProfit with all player bets being identical, a better way to compare
// by default all ibets (identical bets) are set at 100 bits
// max will return only the top n players
// identicalBets set to true will use the iProfit value of a player, else will use the real netProfit
window.tools.get_pip=function(max=200,identicalBets=true,seenInLastMins=12,minGamesPlayed=2,minProfit=10000) {
	game.playersThatPlayed = Array.from(game.playersJoined);
    if (!players.known || players.known.length<1){
		console.log(`get_playersInProfitAsArray error: 0 players.known`)
		return null
	}
	let pip = [];
	let msSeen = ((seenInLastMins*60)*1000);
   
	if (identicalBets==true){
		for (var userkey in players.known) {
			if (((Date.now() - players.known[userkey].lastSeen) <= msSeen) && (players.known[userkey].gamesPlayed>=minGamesPlayed) && (players.known[userkey].iProfit > minProfit)) {
				pip.push(Math.round(players.known[userkey].iProfit)+'|'+players.known[userkey].username);
			}
		}
	}
	else if (identicalBets==false){
		for (var userkey in players.known) {
			if (((Date.now() - players.known[userkey].lastSeen) < msSeen) && (players.known[userkey].gamesPlayed>=minGamesPlayed) && (players.known[userkey].netProfit > minProfit)) {
				pip.push(Math.round(players.known[userkey].netProfit)+'|'+players.known[userkey].username);
			}
		}
	}
    
	if (!pip || pip.length<1){
		console.log(`get_playersInProfitAsArray counted 0 players`)
		return null
	}
    // Sort in descending profit, cell 0 is the top player
    pip.sort(function(a,b){return b.split('|')[0]-a.split('|')[0]});
	pip=pip.slice(0,max);
	players.playersInProfit=Array.from(pip);
    return pip;
}
window.tools.get_playersInProfitAsArray=window.tools.get_pip;

// ppinp: players playing in profit
// return array of players in iprofit that are playing in current game
// iprofit is netProfit with all player bets being identical, a better way to compare
// by default all ibets (identical bets) are set at 100 bits
window.tools.get_ppinp=function(max=200,identicalBets=true,seenInLastMins=12,minGamesPlayed=2,minProfit=10000,theTop=20){
				  // max,identicalBets,seenInLastMins,minGamesPlayed,minProfit
	let pipamt=tools.get_pip(500,identicalBets,seenInLastMins,minGamesPlayed,minProfit);
	// get the top 75% of players in profit
	let pip=tools.get_pip((pipamt.length*0.75),identicalBets,seenInLastMins,minGamesPlayed,minProfit);
	
	let plinp=[];
	for (var i in pip){
		pip[i]=pip[i].split('|')[1];
		if (game.playersThatPlayed.indexOf(pip[i])>=0){
			plinp.push(pip[i]);
        }
    }
	players.playersPlayingInProfit=Array.from(plinp);

	
	return plinp
}
// Verbose function name
window.tools.get_playersPlayingInProfit=window.tools.get_ppinp;

// pwinp: players won in profit
// return array of players in iprofit that are have cashed out in current game
// iprofit is netProfit with all player bets being identical, a better way to compare
// by default all ibets (identical bets) are set at 100 bits
window.tools.get_pwinp=function(max=200,identicalBets=true,seenInLastMins=20,minGamesPlayed=8,minProfit=10000){
	
				  // max,identicalBets,seenInLastMins,minGamesPlayed,minProfit
	let pip=Array.from(players.playersInProfit);
	let pwinp=[];
	for (var i in pip){
		pip[i]=pip[i].split('|')[1];
		if (game.playersWon.indexOf(pip[i])>=0){
			pwinp.push(pip[i]);
        }
    }
	players.playersWinningInProfit=Array.from(pwinp);
	return pwinp
}

// Verbose function name
window.tools.get_playersWonInProfit=window.tools.get_pwinp;


// if cullThem is true, will delete LTNS (long time no see) players from players.known
// else logs number of total players that are LTNS to console
// run occasionally to keep player list fresh
window.tools.cullOldPlayers=function(cullThem=false,notSeenForMins=60){
	let msSeen = ((notSeenForMins*60)*1000);
	let ltns=[]; // long time no see - players not seen in minMS
	let totpl=0;
	for (var userkey in players.known) {
		totpl++
		if (((Date.now() - players.known[userkey].lastSeen) >= msSeen)) {
			ltns.push(userkey);
			if (cullThem==true){
				delete players.known[userkey]
			}
		}
	}
	if (cullThem==true){
		console.log(`${ltns.length} of ${totpl} players were removed from players.known database`);
	} else {
		console.log(`${ltns.length} of ${totpl} players are LTNS (long time no see) - none removed`);
	}
}
// Will remove PIPHistory logs older than keepLast games
// PIPHistory Logs are: player.strategy.copercHistory
// 			player.strategy.copercTargetHistory
//			player.strategy.percPIPSPlayed
window.tools.cullPIPHistory=function(keepLast=12){

	player.strategy.copercHistory=player.strategy.copercHistory.slice(0,keepLast); 
	player.strategy.copercTargetHistory=player.strategy.copercTargetHistory.slice(0,keepLast); 
	player.strategy.percPIPSPlayed=player.strategy.percPIPSPlayed.slice(0,keepLast); 
}

// normalizeProfit makes the script increase initial bankroll at steady rate when in profit (thus reducing profit) 
// a way to scoot our borderline up so the bot continously pushes to make more profit
window.tools.normalizeProfit=function(normalizationRate=2){
	player.netProfit=(player.currentBankroll-player.initialBankroll);
	if (player.netProfit!=null && player.netProfit!=0 && player.currentBankroll>player.initialBankroll*1.03){
		let profitPerGame=((player.netProfit) / player.numGamesPlayed);
		let percProf=(Math.abs(player.netProfit)/player.initialBankroll);
		player.initialBankroll+=(profitPerGame*(percProf*normalizationRate));
		console.log('Decreasing Profit: '+(((profitPerGame*(percProf*normalizationRate))/100).toFixed(2))+' Normalization Rate: ((2% of ProfitPerGame) * '+normalizationRate+') ('+(((profitPerGame*(percProf*normalizationRate))/100).toFixed(2))+' bits added to initial bankroll)');
	}
	
}

// returns gamestate ID's that are over [percent] of probability average
window.tools.bestStates=function(stateLog=Array.from(player.strategy.sotg144),percent=0.6,minGamesLogged=16){
	let bests=[];
	for (var i in stateLog) {
		let x = (tools.get_binarySum(stateLog[i]) / stateLog[i].length);
		(x >= percent && stateLog[i].length >= minGamesLogged) ? bests.push(i): null;
	}
	return bests
}

// returns gamestate ID's that are under [percent] of probability average
window.tools.worstStates=function(stateLog=Array.from(player.strategy.sotg144),percent=0.4,minGamesLogged=16){
	let worsts=[];
	for (var i in stateLog) {
		let x = (tools.get_binarySum(stateLog[i]) / stateLog[i].length);
		(x < percent && stateLog[i].length >= minGamesLogged) ? worsts.push(i): null;
	}
	return worsts
}

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

window.tools.chatPPPInfo = function () {
	let minsTracked= (((Date.now() - player.timeStarted) / 60000));
	window.tools.chat('Game #' + game.gameID + ' has started with ' + game.playersThatPlayed.length + ' players. ' + window.tools.get_numPlayersPlayingInProfit() + ' of them have a positive net profit since I started tracking ' + (minsTracked.toFixed(0)) + ' minutes ago. The #1 player is ' + (players.playersInProfit[0].split('|')[1]) + ' at a net profit rate of ' + tools.addCommas(Math.floor((players.playersInProfit[0].split('|')[0] / 100)/minsTracked)) + '  bits per minute. #2 : ' + (players.playersInProfit[1].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[1].split('|')[0] / 100)/minsTracked) + ' bpm] #3: ' + (players.playersInProfit[2].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[2].split('|')[0] / 100)/minsTracked) + 'bpm] #4: ' + (players.playersInProfit[3].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[3].split('|')[0] / 100)/minsTracked) + 'bpm] #5: ' + (players.playersInProfit[4].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[4].split('|')[0] / 100)/minsTracked) + 'bpm] #6: ' + (players.playersInProfit[5].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[5].split('|')[0] / 100)/minsTracked) + 'bpm]');
	window.tools.chat(' #7 : ' + (players.playersInProfit[6].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[6].split('|')[0] / 100)/minsTracked) + ' bpm] #8: ' + (players.playersInProfit[7].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[7].split('|')[0] / 100)/minsTracked) + 'bpm] #9: ' + (players.playersInProfit[8].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[8].split('|')[0] / 100)/minsTracked) + 'bpm] #10: ' + (players.playersInProfit[9].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[9].split('|')[0] / 100)/minsTracked) + 'bpm] #11: ' + (players.playersInProfit[10].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[10].split('|')[0] / 100)/minsTracked) + 'bpm] #12 : ' + (players.playersInProfit[11].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[11].split('|')[0] / 100)/minsTracked) + ' bpm] #13: ' + (players.playersInProfit[12].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[12].split('|')[0] / 100)/minsTracked) + 'bpm] #14: ' + (players.playersInProfit[13].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[13].split('|')[0] / 100)/minsTracked) + 'bpm] #15: ' + (players.playersInProfit[14].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[14].split('|')[0] / 100)/minsTracked) + 'bpm] #16: ' + (players.playersInProfit[15].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[15].split('|')[0] / 100)/minsTracked) + 'bpm] #17 : ' + (players.playersInProfit[16].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[16].split('|')[0] / 100)/minsTracked) + ' bpm] #18: ' + (players.playersInProfit[17].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[17].split('|')[0] / 100)/minsTracked) + 'bpm] #19: ' + (players.playersInProfit[18].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[18].split('|')[0] / 100)/minsTracked) + 'bpm] #20: ' + (players.playersInProfit[19].split('|')[1]) + ' [' + Math.floor((players.playersInProfit[19].split('|')[0] / 100)/minsTracked) + 'bpm]');
}
	

window.tools.sitOutFor=function(gamesToSitOut = 1) {
		console.log(`Sitting out the next ${gamesToSitOut} games`);
		gamesToSitOut = Math.round(gamesToSitOut);
		for (var gts = 1; gts <= gamesToSitOut; gts++) {
			C++
			player.strategy.addFuture(gts, 0, 0, false); // -1 so we sit out the current game for first sitout
		}
	}

window.tools.chatPlayerInfo = function (usah = 'Shiba') {
	let usahdata = players.known['user_' + usah];
	tools.chat('data for user bustabit.com/user/' + usah + ' (since tracking started ' + (((Date.now() - player.timeStarted) / 60000).toFixed(1)) + ' minutes ago) ~ Games Played: ' + usahdata.gamesPlayed + ' ~ Games Won: ' + usahdata.wins + ' ~ Games Lost: ' + usahdata.losses + ' ~ Net Profit: ' + tools.addCommas((usahdata.netProfit/100).toFixed(0)) + ' bits ~ Gross Profit: ' + tools.addCommas((usahdata.grossProfit/100).toFixed(0)) + ' bits ~ Messages Sent: ' + usahdata.messagesSent);
}
