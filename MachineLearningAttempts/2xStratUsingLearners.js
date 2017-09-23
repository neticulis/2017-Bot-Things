
window.miniStrats.learner2xStrats[0]=function(){
	if (player.numGamesPlayed==0){
		let loaded=window.learner.loadLearnersFromLocalStorage();
		if (!loaded){
			console.log('Couldnt load learners from local storage');
		}
	}
	if (crashes.history.length<72){	return {'amount':0,'multiplier':0};	} 
	medians.generate_medians();
	window.learner.getAllOutcomes();
	window.learner.saveLearnersToLocalStorage();
	// Set the binary ID's for all learners
	window.learner.setAllID();
	// display learner stats for patterns with at least 4 predictions logged 
	learner.displayCurrentIDStats(4);
	let SumSum=(learner.getSumSum());
	let nPositive=learner.getNPositiveSums();
	let nTotal=(learner.getNLearners());
	let learnerNames=learner.getLearnerNames();
	// Total modifier float
	let totalPercent=learner.getTotalPercents();
	// Average modifier float, 0-2
	let averagePercent=(totalPercent/nTotal)
	let totalPatterns=learner.getAll_numPossiblePatterns();
	// learners with a positive sum, as a percentage
	let percentPositive=nPositive/nTotal;
	let sumcolor="white";
	if (SumSum>0){
		sumcolor="Lime";
	}
	if (SumSum<0){
		sumcolor="Orange";
	}
	let percentcolor="white";
	if (percentPositive>0.5){
		percentcolor="Lime";
	}
	if (percentPositive<0.5){
		percentcolor="Orange";
	}
	let percentcolorb="white";
	if (percentPositive>1){
		percentcolorb="Lime";
	}
	if (percentPositive<1){
		percentcolorb="Orange";
	}
	
	console.log(`%cMachine Learning 2x Strategy ~~ Learning From ${(tools.addCommas(totalPatterns))} Patterns`,'color:White;font-size:16px;');
	console.log(`%cSum of Learner Sums: ${SumSum}`,'color:'+sumcolor);
	console.log(`%cAverage Learner Mod: ${(averagePercent*100).toFixed(0)}% ~~~ Total Mod Sum: ${(totalPercent*100).toFixed(0)}% `,'color:'+percentcolorb);
	console.log(`%cPositive Learner Sums: ${nPositive} out of ${nTotal} (only patterns with at least 4+ predictions and +-1% sum rate counted)`,'color:'+percentcolor);
	let GODLY={}; // our bet holder
	if (nPositive>0){
		if (player.netProfit>0){
			// using initialBankroll, bet will remain similar when in profit 
			GODLY.BET=(player.initialBankroll/(198/averagePercent));	
		} else {
			//  using currentBankroll, bet will scale down when in debt
			GODLY.BET=(player.currentBankroll/(198/averagePercent));	
		}
		
		if ((SumSum/nTotal)>nTotal){
			GODLY.BET*=(1+averagePercent);	

		} else if (SumSum>nTotal){
			GODLY.BET*=(0.6667+averagePercent);	

		} else  if (SumSum>0){
			GODLY.BET*=(0.3334+averagePercent);		

		} else if (SumSum==0){
			GODLY.BET*=averagePercent;	

		} else {
			GODLY.BET*=averagePercent;
			GODLY.BET/=(1+(Math.abs(SumSum)/(nTotal)));	
		}
		GODLY.BET=(GODLY.BET*(((percentPositive*2)+(averagePercent))/2));
		GODLY.MULTIPLIER=200;
	} else {
		GODLY.BET=0;
		GODLY.MULTIPLIER=0;
	}
	
	
	// Set minimum and maximum bets based on net profit
	if (player.netProfit>0){
		//  using initialBankroll, max bet will remain similar when in profit, and bets under 1 bit will be played at 1 bit
		GODLY.BET>(player.initialBankroll/(44.5/averagePercent))?GODLY.BET=(player.initialBankroll/(44.5/averagePercent)):null;
		if (GODLY.BET!=0 && GODLY.BET<100){
			GODLY.BET=100; 
			GODLY.MULTIPLIER=200;
		}
	} else {
		//  using currentBankroll, max bet will scale down when in debt, and bets under 1 bit will be sat out
		GODLY.BET>(player.currentBankroll/(44.5/averagePercent))?GODLY.BET=(player.currentBankroll/(44.5/averagePercent)):null;
		if (GODLY.BET!=0 && GODLY.BET<100){
			GODLY.BET=0; 
			GODLY.MULTIPLIER=0;
		}
	}
	return {'amount':(GODLY.BET),'multiplier':GODLY.MULTIPLIER};
}
