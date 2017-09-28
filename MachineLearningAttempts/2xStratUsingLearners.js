// NOTICE: This file will not work without the full gambletron script (private until release)
//         However, you are free to muscle it into whatever script you currently use 
//         No support will be given, you are on your own if you want to mess with this


window.learner.strategy=[];

tools.get_balance_gamesSinceHighest = function (numGames = null) {
	// return null if balance history is not being saved, or there is not yet any history
	if (!tools.is_balance_historySaved() || player.balanceHistory.length == 0) {
		return null
	}
	var balanceHistoryLength = Array.from(Object.keys(player.balanceHistory)).length;
	numGames == null ? numGames = 1024 : null;
	numGames>balanceHistoryLength?numGames=balanceHistoryLength-1:null;
	var bald = [];
	var highestBalanceNGamesAgo=0
	var highest = 0;
	for (var a = 1; a < numGames; a++) {
		(player.balanceHistory['gid_' + (game.gameID - a)]) > highest ? highestBalanceNGamesAgo=a : null;
		(player.balanceHistory['gid_' + (game.gameID - a)]) > highest ? highest = (player.balanceHistory['gid_' + (game.gameID - a)]) : null;

	}
	return {'gamesAgo':highestBalanceNGamesAgo,'balanceWas':highest}
}



window.learner.strategy[0]=function(){
		if (crashes.history.length >= 34) {
		// getAllOutcomes: 
		//		- Updates learner data based on where the game just crashed, fuzzes, sums, totals, etc.
		// 		- Sets window.learner[learnerName].current and .previous variables for all active learners - the result comes from that learners current pattern
		console.log('getting learner');
		window.learner.getAllOutcomes();
		// setAllTotalsAndAverages:
		//		- This will set window.learner.total and window.learner.average amounts, done after getting outcomes and before setting the new ID/Pattern
		window.learner.setAllTotalsAndAverages();
		// Save full learner object to local storage stringified
		window.learner.saveLearnersToLocalStorage();
		// Set the binary ID's the learners will use for the upcoming game, GET OUTCOMES FIRST!
		window.learner.setAllID();
	} 
	let ourBet=100;
	let ourMultiplier=200;
	let LSUMS={};
	let LNAMES=learner.getLearnerNames();
	let LTOTAL=learner.getAllTotals();
	let LAVERAGE=learner.getAllAverages();
	let LPERCENT={};
	let LFUZZ={};
	let LMODS={};
	learner.displayCurrentIDStats();
	console.log(`LNAMES ~~~~~~~~~~~~~~~~~~~ LNAMES\n${JSON.stringify(LNAMES)}\nLTOTAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~ LTOTAL\n${JSON.stringify(LTOTAL)}\nLAVERAGE ~~~~~~~~~~~~~~~~~~~~~~~ LAVERAGE\n${JSON.stringify(LAVERAGE)}\n`);
	// Takes a floating point number, returns an integer percent and 1 decimal (EX 85.3%, 128.1%)
	
	if (LTOTAL.learnersUsed<2){
		return {
			'amount': 0,
			'multiplier':0
		};
	}

	function dispMod(theMod){
		return (((theMod*100).toFixed(1))+'%');
	}
	let highestBalanceNGamesAgo=tools.get_balance_gamesSinceHighest(512); //  {'gamesAgo':highestBalanceNGamesAgo,'balanceWas':highest}
	let highestBalanceWasNGamesAgo=highestBalanceNGamesAgo.gamesAgo;
	let highestBalanceWas=highestBalanceNGamesAgo.balanceWas;
	let highestBalance128NGamesAgo=tools.get_balance_gamesSinceHighest(128); //  {'gamesAgo':highestBalanceNGamesAgo,'balanceWas':highest}
	let highestBalance128WasNGamesAgo=highestBalance128NGamesAgo.gamesAgo;
	let highestBalance128Was=highestBalance128NGamesAgo.balanceWas;
	let highestBalance32NGamesAgo=tools.get_balance_gamesSinceHighest(32); //  {'gamesAgo':highestBalanceNGamesAgo,'balanceWas':highest}
	let highestBalance32WasNGamesAgo=highestBalance32NGamesAgo.gamesAgo;
	let highestBalance32Was=highestBalance32NGamesAgo.balanceWas;
	
	let percentOfHighestBalance=(highestBalanceWas/player.currentBankroll);
	let percentOfHighestBalance128=(highestBalance128Was/player.currentBankroll);
	let percentOfHighestBalance32=(highestBalance32Was/player.currentBankroll);
	
	let percentOfLearnersUsed=LTOTAL.learnersUsed/LTOTAL.learners;
	
	let percentOfPosSumVsNegSumLearners=(LTOTAL.PositiveSumLearners+1)/(LTOTAL.NegativeSumLearners+1);
	let percentOfPosSumLearners=LTOTAL.PositiveSumLearners/LTOTAL.learnersUsed;
	let percentOfNegSumLearners=LTOTAL.NegativeSumLearners/LTOTAL.learnersUsed;
	let percentOutcomesVsPredicts=LTOTAL.Outcomes/LTOTAL.Predictions;
	
	let speedMod=(0.334+(((crashes.getRVGSum(3)/2)+(crashes.getRVGSum(7)/4)+(crashes.getRVGSum(11)/7)+(crashes.getRVGSum(22)/16)+(crashes.getRVGSum(33)/22))/5));
	let winningMod=(((player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-2)])+(player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-4)])+(player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-8)])+(player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-16)])+(player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-32)])+(player.currentBankroll>player.balanceHistory['gid_'+(game.gameID-64)]))/3)
	let balanceModHigh=(0.5+((tools.get_balance_numGamesWereHigher()/(Object.keys(player.balanceHistory).length))*1.5)); // a number 0-2 - higher = worse we are doing, lower = better we are doing - mod /=
	let balanceModLow=(0.5+(((tools.get_balance_numGamesWereLower()/Object.keys(player.balanceHistory).length))*1.5)); // a number 0-2 - higher = better we are doing, lower== worse we are doing - mod *=
	let balanceMod=(1*(balanceModLow))/(balanceModHigh);
	let blendMod=player.strategy.previousValidAmount;
	
	let predict2x=0;
	let rvgMod=(0.02+(((crashes.getRVGSum(4)/2)+(crashes.getRVGSum(8)/4)+(crashes.getRVGSum(16)/8)+(crashes.getRVGSum(32)/16)+(crashes.getRVGSum(64)/32)+(crashes.getRVGSum(128)/64))/6));
	rvgMod=(((rvgMod+rvgMod)+(0.02+(((crashes.getRVGSum(4)/2)+(crashes.getRVGSum(8)/4)+(crashes.getRVGSum(16)/8)+(crashes.getRVGSum(32)/16))/4)))/3)
	rvgMod=(((rvgMod+rvgMod+rvgMod)+(0.02+(((crashes.getRVGSum(4)/2)+(crashes.getRVGSum(8)/4))/2)))/4)
	let ynPercRight=(LTOTAL.totYups/LTOTAL.totNopes); // >1 and these are more often right, else wrong
	let percTotYupsVsTotal=(LTOTAL.totYups/(LTOTAL.totYups+LTOTAL.totNopes)); // >1 and these are more often right, else wrong
	let percTotNopesVsTotal=((LTOTAL.totNopes)/(LTOTAL.totYups+LTOTAL.totNopes)); // >1 and these are more often right, else wrong
	let percTotYupsToNopes=((LTOTAL.totYups+1)/(LTOTAL.totNopes+1)); // >1 and these are more often right, else wrong
	let percTotNopesToYups=((LTOTAL.totNopes+1)/(LTOTAL.totYups+1)); // >1 and these are more often right, else wrong
	let percCurYupsToNopes=((LTOTAL.curYups+1)/(LTOTAL.curNopes+1)); // >1 and these are more often right, else wrong
	let percCurNopesToYups=((LTOTAL.curNopes+1)/(LTOTAL.curYups+1)); // >1 and these are more often right, else wrong
	let percMaxYupsToNopes=((LTOTAL.maxYups+1)/(LTOTAL.maxNopes+1)); // >1 and these are more often right, else wrong
	let percMaxNopesToYups=((LTOTAL.maxNopes+1)/(LTOTAL.maxYups+1)); // >1 and these are more often right, else wrong
	let percCurYupsVsTotal=(LTOTAL.curYups/(LTOTAL.curYups+LTOTAL.curNopes)); // >1 and these are more often right, else wrong
	let percCurNopesVsTotal=(LTOTAL.curNopes/(LTOTAL.curYups+LTOTAL.curNopes)); // >1 and these are more often right, else wrong
	let percMaxYupsVsTotal=(LTOTAL.maxYups/(LTOTAL.maxYups+LTOTAL.maxNopes)); // >1 and these are more often right, else wrong
	let percMaxNopesVsTotal=(LTOTAL.maxNopes/(LTOTAL.maxYups+LTOTAL.maxNopes)); // >1 and these are more often right, else wrong
	let avgFuzz=LAVERAGE.Fuzz;
	LTOTAL.Sums<0?ynPercRight=(LTOTAL.totNopes/LTOTAL.totYups):null;
	let medModTiny=(1-prob(medians.Tiny/100));
	let medModShort=(1-prob(medians.Short/100));
	let medModMid=(1-prob(medians.Mid/100));
	let medMod=(((medModTiny)+(medModShort)+(medModMid))/3);
	rvgMod>1?predict2x+=(0.275*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.325*(LTOTAL.totYups/LTOTAL.totNopes));
	rvgMod>1.25?predict2x+=(0.35*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=0;
	rvgMod>1.5?predict2x+=(0.4*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=0;
	rvgMod>1.75?predict2x+=(0.5*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=0;
	
	LTOTAL.PositiveSumLearners>=LTOTAL.NegativeSumLearners?predict2x+=(0.5*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.5*(LTOTAL.totYups/LTOTAL.totNopes));
	LTOTAL.PositiveSumLearners>LTOTAL.NegativeSumLearners?predict2x+=(0.5*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.25*(LTOTAL.totYups/LTOTAL.totNopes));
	LTOTAL.Sums>0?predict2x+=(1*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(1*(LTOTAL.totYups/LTOTAL.totNopes));
	LTOTAL.Sums>LTOTAL.learnersUsed?predict2x+=(0.50*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.25*(LTOTAL.totYups/LTOTAL.totNopes));
	LAVERAGE.Sums>LTOTAL.learnersUsed?predict2x+=(0.75*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.125*(LTOTAL.totYups/LTOTAL.totNopes));
	LTOTAL.Sums>LTOTAL.learners?predict2x+=(0.50*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.1*(LTOTAL.totYups/LTOTAL.totNopes));
	LAVERAGE.Sums>LTOTAL.learners?predict2x+=(0.75*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.05*(LTOTAL.totYups/LTOTAL.totNopes));
	(LTOTAL.TotalSums*(LTOTAL.totYups/LTOTAL.totNopes))>0?predict2x+=(0.25*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.35*(LTOTAL.totYups/LTOTAL.totNopes));
	LAVERAGE.Sums>0?predict2x+=(0.25*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.13*(LTOTAL.totYups/LTOTAL.totNopes));
	LTOTAL.Fuzz>0.65?predict2x+=(0.15*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.03*(LTOTAL.totYups/LTOTAL.totNopes));
	((LAVERAGE.Fuzz+LAVERAGE.PercentTrue+0.493)/3)>0.493?predict2x+=(0.15*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.25*(LTOTAL.totYups/LTOTAL.totNopes));
	((LAVERAGE.Fuzz+LAVERAGE.PercentTrue+0.493)/3)>0.593?predict2x+=(0.25*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=0;
	((LAVERAGE.Fuzz+LAVERAGE.PercentTrue+0.493)/3)>0.693?predict2x+=0.30:predict2x-=0;
	(LTOTAL.PositiveSumLearners>=LTOTAL.learnersUsed*0.5)?predict2x+=(0.25*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.35*(LTOTAL.totYups/LTOTAL.totNopes));
	(LTOTAL.PositiveSumLearners>=LTOTAL.learnersUsed*0.75)?predict2x+=0.35:predict2x-=0;
	(LTOTAL.PositiveSumLearners==LTOTAL.learnersUsed)?predict2x+=0.4:predict2x-=0;
	((LTOTAL.curYups*(LTOTAL.totYups/LTOTAL.totNopes))>(LTOTAL.curNopes*(LTOTAL.totNopes/LTOTAL.totYups)))?predict2x+=(0.35*(LTOTAL.totYups/LTOTAL.totNopes)):predict2x-=(0.45*(LTOTAL.totYups/LTOTAL.totNopes));
	
	predict2x*=((rvgMod)*(LTOTAL.totYups/LTOTAL.totNopes));
	
	
	predict2x=Math.round(predict2x);
	let brDividerDivider=1;
	if (player.currentBankroll<500000){
		 brDividerDivider=3.14159;
	} else if (player.currentBankroll<100000){
		 brDividerDivider=2.14159;
	} else if (player.currentBankroll<200000){
		 brDividerDivider=1.14159;
	} else if (player.currentBankroll<400000){
		 brDividerDivider=1;
	}
	predict2x<0?ourBet=100:null;
	predict2x==0?ourBet=50+Math.ceil(player.currentBankroll/(3000/brDividerDivider)):null;
	predict2x==1?ourBet=100+Math.ceil(player.currentBankroll/(2300/brDividerDivider)):null;
	predict2x==2?ourBet=200+Math.ceil(player.currentBankroll/(1700/brDividerDivider)):null;
	predict2x==3?ourBet=300+Math.ceil(player.currentBankroll/(1200/brDividerDivider)):null;
	predict2x==4?ourBet=400+Math.ceil(player.currentBankroll/(800/brDividerDivider)):null;
	predict2x==5?ourBet=500+Math.ceil(player.currentBankroll/(500/brDividerDivider)):null;
	predict2x==6?ourBet=600+Math.ceil(player.currentBankroll/(300/brDividerDivider)):null;
	predict2x==7?ourBet=700+Math.ceil(player.currentBankroll/(200/brDividerDivider)):null;
	predict2x==8?ourBet=800+Math.ceil(player.currentBankroll/(150/brDividerDivider)):null;
	predict2x>=9?ourBet=900+Math.ceil(player.currentBankroll/(125/brDividerDivider)):null;
	
	ourBet*=((rvgMod+speedMod)/2);
	if (predict2x>=1){
		ourBet*=((medMod*2));
	}
	
	let balMod=balanceMod;
	if (predict2x>=3 && balanceMod>=3){
		balMod=1+((balanceMod/((3)+(5/predict2x))));
		ourBet*=balMod;
	} else if (predict2x>=2 && balanceMod>=2){
		balMod=1+((balanceMod/((2)+(5/predict2x))));
		ourBet*=balMod;
	} else if (predict2x>=1 && balanceMod>=1){
		balMod=1+((balanceMod/((1)+(5/predict2x))));
		ourBet*=balMod;
	}  else if (predict2x>=1){
		balMod=(percentOfHighestBalance);
		ourBet*=balMod;
	} 
	// Bump down the bet for profit saving (if we hit a high balance in the last 312/96/24 games)
	if (highestBalanceWasNGamesAgo<312 && percentOfHighestBalance>=1.0445){

		highestBalanceWasNGamesAgo<2?ourBet/=((1)+(1/predict2x)):null;
		highestBalanceWasNGamesAgo<4?ourBet/=((1)+(2/predict2x)):null;
		highestBalanceWasNGamesAgo<8?ourBet/=((1)+(4/predict2x)):null;
		highestBalanceWasNGamesAgo<16?ourBet/=((1)+(8/predict2x)):null;
		highestBalanceWasNGamesAgo<32?ourBet/=((1)+(16/predict2x)):null;
		highestBalanceWasNGamesAgo<64?ourBet/=((1)+(32/predict2x)):null;
		highestBalanceWasNGamesAgo<128?ourBet/=((1)+(16/predict2x)):null;
		highestBalanceWasNGamesAgo<256?ourBet/=((1)+(8/predict2x)):null;
		highestBalanceWasNGamesAgo<312?ourBet/=((1)+(4/predict2x)):null;
	}
	if (highestBalance128WasNGamesAgo!=highestBalanceWasNGamesAgo && highestBalance128WasNGamesAgo<96 && percentOfHighestBalance128>=1.0334){

		highestBalance128WasNGamesAgo<2?ourBet/=((1)+(1/predict2x)):null;
		highestBalance128WasNGamesAgo<4?ourBet/=((1)+(2/predict2x)):null;
		highestBalance128WasNGamesAgo<8?ourBet/=((1)+(4/predict2x)):null;
		highestBalance128WasNGamesAgo<16?ourBet/=((1)+(8/predict2x)):null;
		highestBalance128WasNGamesAgo<32?ourBet/=((1)+(16/predict2x)):null;
		highestBalance128WasNGamesAgo<64?ourBet/=((1)+(32/predict2x)):null;
		highestBalance128WasNGamesAgo<96?ourBet/=((1)+(16/predict2x)):null;
	}
	if (highestBalance32WasNGamesAgo!=highestBalance128WasNGamesAgo && highestBalance32WasNGamesAgo<24 && percentOfHighestBalance32>=1.0223){

		highestBalance32WasNGamesAgo<2?ourBet/=((1)+(1/predict2x)):null;
		highestBalance32WasNGamesAgo<4?ourBet/=((1)+(2/predict2x)):null;
		highestBalance32WasNGamesAgo<8?ourBet/=((1)+(4/predict2x)):null;
		highestBalance32WasNGamesAgo<16?ourBet/=((1)+(8/predict2x)):null;
		highestBalance32WasNGamesAgo<24?ourBet/=((1)+(4/predict2x)):null;
		
	}
	// Bump up the bet when gameplay is good and profit saving is on 
	if (predict2x>=6 &&  rvgMod>1.08 && medMod>0.58){
		(highestBalance32WasNGamesAgo>3 && highestBalance32WasNGamesAgo<6)?ourBet/=(2/highestBalance32WasNGamesAgo):null;
		(highestBalance32WasNGamesAgo>6 && highestBalance32WasNGamesAgo<12)?ourBet/=(5/highestBalance32WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>4 && highestBalance128WasNGamesAgo<8)?ourBet/=(3/highestBalance128WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>8 && highestBalance128WasNGamesAgo<16)?ourBet/=(6/highestBalance128WasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalanceWasNGamesAgo>32 && highestBalanceWasNGamesAgo<64)?ourBet/=(28/highestBalanceWasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalanceWasNGamesAgo>64 && highestBalanceWasNGamesAgo<128)?ourBet/=(52/highestBalanceWasNGamesAgo):null;
	}
	else if (predict2x>=4 && rvgMod>1.04 && medMod>0.54){
		(highestBalance32WasNGamesAgo>6 && highestBalance32WasNGamesAgo<12)?ourBet*=(4/highestBalance32WasNGamesAgo):null;
		(highestBalance32WasNGamesAgo>12 && highestBalance32WasNGamesAgo<24)?ourBet*=(8/highestBalance32WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>6 && highestBalance128WasNGamesAgo<12)?ourBet/=(4/highestBalance128WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>12 && highestBalance128WasNGamesAgo<24)?ourBet/=(8/highestBalance128WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>24 && highestBalance128WasNGamesAgo<48)?ourBet/=(20/highestBalance128WasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalanceWasNGamesAgo>64 && highestBalanceWasNGamesAgo<128)?ourBet/=(52/highestBalanceWasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalanceWasNGamesAgo>128 && highestBalanceWasNGamesAgo<256)?ourBet/=(112/highestBalanceWasNGamesAgo):null;
	}
	else if (predict2x>=2 && rvgMod>1.02 && medMod>0.52){
		(highestBalance32WasNGamesAgo>6 && highestBalance32WasNGamesAgo<12)?ourBet*=(4/highestBalance32WasNGamesAgo):null;
		(highestBalance32WasNGamesAgo>12 && highestBalance32WasNGamesAgo<24)?ourBet*=(8/highestBalance32WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>12 && highestBalance128WasNGamesAgo<24)?ourBet/=(10/highestBalance128WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>24 && highestBalance128WasNGamesAgo<48)?ourBet/=(20/highestBalance128WasNGamesAgo):null;
		((highestBalance128WasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalance128WasNGamesAgo>48 && highestBalance128WasNGamesAgo<96)?ourBet/=(40/highestBalance128WasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) &&  highestBalanceWasNGamesAgo>256 && highestBalanceWasNGamesAgo<512)?ourBet/=(224/highestBalanceWasNGamesAgo):null;
		((highestBalanceWasNGamesAgo!=highestBalance128WasNGamesAgo) && (highestBalanceWasNGamesAgo!=highestBalance32WasNGamesAgo) && highestBalanceWasNGamesAgo>512 && highestBalanceWasNGamesAgo<1024)?ourBet/=(448/highestBalanceWasNGamesAgo):null;
	}
	/*
	if (highestBalanceWasNGamesAgo<32){

		highestBalanceWasNGamesAgo<4?ourBet/=1.1:null;
		highestBalanceWasNGamesAgo<8?ourBet/=1.2:null;
		highestBalanceWasNGamesAgo<16?ourBet/=1.3:null;
		highestBalanceWasNGamesAgo<24?ourBet/=1.4:null;
		if (predict2x>=5 && percentOfHighestBalance>=1.04){
			highestBalanceWasNGamesAgo<32?ourBet/=((41-highestBalanceWasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance>=1.02){
			highestBalanceWasNGamesAgo<24?ourBet/=((32-highestBalanceWasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance>=1.01){
			highestBalanceWasNGamesAgo<16?ourBet/=((24-highestBalanceWasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance>=1.001){
			highestBalanceWasNGamesAgo<12?ourBet/=((20-highestBalanceWasNGamesAgo)/8):null;
		} else if (predict2x<5 && percentOfHighestBalance>=1.02){
			highestBalanceWasNGamesAgo<32?ourBet/=((41-highestBalanceWasNGamesAgo)/8):null;
		} else if (predict2x<4 && percentOfHighestBalance>=1.01){
			highestBalanceWasNGamesAgo<32?ourBet/=((37-highestBalanceWasNGamesAgo)/4):null;
		} else if (predict2x<3 && percentOfHighestBalance>=1.00){
			highestBalanceWasNGamesAgo<32?ourBet/=((33-highestBalanceWasNGamesAgo)/2):null;
		} else if (predict2x<2 && percentOfHighestBalance>=1.00){
			highestBalanceWasNGamesAgo<24?ourBet/=((25-highestBalanceWasNGamesAgo)/2):null;
		} else if (predict2x<=0 && percentOfHighestBalance>=1.00){
			highestBalanceWasNGamesAgo<16?ourBet/=((17-highestBalanceWasNGamesAgo)/2):null;
		}
		
	} else if (highestBalance128WasNGamesAgo<32){

		highestBalance128WasNGamesAgo<4?ourBet/=1.1:null;
		highestBalance128WasNGamesAgo<8?ourBet/=1.2:null;
		highestBalance128WasNGamesAgo<16?ourBet/=1.3:null;
		highestBalance128WasNGamesAgo<24?ourBet/=1.4:null;
		if (predict2x>=5 && percentOfHighestBalance128>=1.04){
			highestBalance128WasNGamesAgo<32?ourBet/=((41-highestBalance128WasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance128>=1.02){
			highestBalance128WasNGamesAgo<24?ourBet/=((32-highestBalance128WasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance128>=1.01){
			highestBalance128WasNGamesAgo<16?ourBet/=((24-highestBalance128WasNGamesAgo)/8):null;
		} else if (predict2x>=5 && percentOfHighestBalance128>=1.001){
			highestBalance128WasNGamesAgo<12?ourBet/=((20-highestBalance128WasNGamesAgo)/8):null;
		} else if (predict2x<5 && percentOfHighestBalance128>=1.02){
			highestBalance128WasNGamesAgo<32?ourBet/=((41-highestBalance128WasNGamesAgo)/8):null;
		} else if (predict2x<4 && percentOfHighestBalance128>=1.01){
			highestBalance128WasNGamesAgo<32?ourBet/=((37-highestBalance128WasNGamesAgo)/4):null;
		} else if (predict2x<3 && percentOfHighestBalance128>=1.00){
			highestBalance128WasNGamesAgo<32?ourBet/=((33-highestBalance128WasNGamesAgo)/2):null;
		} else if (predict2x<2 && percentOfHighestBalance128>=1.00){
			highestBalance128WasNGamesAgo<24?ourBet/=((25-highestBalance128WasNGamesAgo)/2):null;
		} else if (predict2x<=0 && percentOfHighestBalance128>=1.00){
			highestBalance128WasNGamesAgo<16?ourBet/=((17-highestBalance128WasNGamesAgo)/2):null;
		}

		
	}  
	
	*/
	
	
	predict2x==1?ourBet+=(player.numGamesPlayed/(32*(brDividerDivider*5.14159))):null;
	predict2x==2?ourBet+=(player.numGamesPlayed/(16*(brDividerDivider*4.14159))):null;
	predict2x==3?ourBet+=(player.numGamesPlayed/(8*(brDividerDivider*3.14159))):null;
	predict2x==4?ourBet+=(player.numGamesPlayed/(4*(brDividerDivider*2.14159))):null;
	predict2x==5?ourBet+=(player.numGamesPlayed/(2*(brDividerDivider*1.14159))):null;
	predict2x==6?ourBet+=(player.numGamesPlayed*brDividerDivider):null;
	predict2x==7?ourBet+=(player.numGamesPlayed*(2/(brDividerDivider*1.14159))):null;
	predict2x==8?ourBet+=(player.numGamesPlayed*(4/(brDividerDivider*2.14159))):null;
	predict2x==9?ourBet+=(player.numGamesPlayed*(8/(brDividerDivider*3.14159))):null;
	predict2x>=10?ourBet+=(player.numGamesPlayed*(16/(brDividerDivider*4.14159))):null;
	
		ourBet=(((ourBet)+(ourBet*percentOfLearnersUsed))/2);
	if (player.currentStreakType=="WON"){
		ourBet*=ynPercRight;
		ourBet=(((ourBet)+(ourBet*ynPercRight))/2);
		ourBet=(((ourBet*((player.currentStreakCount)+1))+blendMod)/((player.currentStreakCount)+2));
	} else {
		
		ourBet=(((ourBet)+(ourBet*ynPercRight))/2);
		ourBet=(((ourBet*((player.currentStreakCount)+2))+blendMod)/((player.currentStreakCount)+3));
	}
	let percsAndMods=["balMod","rvgMod","medMod","speedMod","winningMod","percentOfPosSumVsNegSumLearners","percentOutcomesVsPredicts","percentOfPosSumLearners","percentOfNegSumLearners","percentOfLearnersUsed","balanceMod","balanceModHigh","balanceModLow","medModTiny","medModShort","medModMid","percTotYupsVsTotal","percTotNopesVsTotal","percTotYupsToNopes","percCurYupsToNopes","percMaxYupsToNopes","percCurYupsVsTotal","percCurNopesVsTotal","percMaxYupsVsTotal","percMaxNopesVsTotal","percTotNopesToYups","percCurNopesToYups","percMaxNopesToYups"].sort((a,b)=>a<b);
	
	let modString='';
	for (var pm in percsAndMods){
		modString+=(((percsAndMods[pm].replace('Total','tot')+'                        ').slice(0,20))+': '+(((((eval(percsAndMods[pm]))*100).toFixed(1))+'%      ').slice(0,7))+'~ ');
		pm%4==0?modString+='\n':null;
	}
	predict2x<0?ourBet=100:null;
	console.log(`highestBalance512WasNGamesAgo   : ${highestBalanceWasNGamesAgo} @ ${(highestBalanceWas/100).toFixed(0)} bits ~~~ currentBalance ${(player.currentBankroll/100).toFixed(0)} bits as a percentOfHighestBalance ${dispMod(percentOfHighestBalance)}
highestBalance128WasNGamesAgo: ${highestBalance128WasNGamesAgo} @ ${(highestBalance128Was/100).toFixed(0)} bits ~~~ currentBalance ${(player.currentBankroll/100).toFixed(0)} bits as a percentOfHighestBalance128 ${dispMod(percentOfHighestBalance128)}
highestBalance32WasNGamesAgo : ${highestBalance32WasNGamesAgo} @ ${(highestBalance32Was/100).toFixed(0)} bits ~~~ currentBalance ${(player.currentBankroll/100).toFixed(0)} bits as a percentOfHighestBalance32 ${dispMod(percentOfHighestBalance32)}
|~~~~~~~~~~~~~~~ MODS ~~~~ MODS ~~~~ MODS ~~~~~~~~~~~~~~~
${modString} 
|~~~~~~~~~~~~~~~ MODS ~~~~ MODS ~~~~ MODS ~~~~~~~~~~~~~~~
ourBet: ${(ourBet/100).toFixed(1)} ~~ predict2x: ${predict2x.toFixed(1)} `);
	
	
	
	
	/* END OF STRATEGY */
	
	if (ourBet!=0 && ourBet<100){
		ourBet=100;
	}
	if (ourBet>player.currentBankroll/44){
		ourBet=player.currentBankroll/44;
	}
	return {
		'amount': ourBet,
		'multiplier':ourMultiplier
	};

}

