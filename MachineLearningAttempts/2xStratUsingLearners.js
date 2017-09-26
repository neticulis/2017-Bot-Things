// NOTICE: This file will not work without the full gambletron script (private until release)
//         However, you are free to muscle it into whatever script you currently use 
//         No support will be given, you are on your own if you want to mess with this


window.miniStrats.learner2xStrats[0] = function () {
	
	if (crashes.history.length < 72) {
		return {
			'amount': 0,
			'multiplier': 0
		};
	}
	window.tools.medianCrunch(true)
	if (window.learner.learners.length == 0) {
		return {
			'amount': 0,
			'multiplier': 0
		};
	}
	window.learner.getAllOutcomes();
	window.learner.setAllTotalsAndAverages();
	
	window.learner.saveLearnersToLocalStorage();
	// Set the binary ID's for all learners, GET OUTCOMES FIRST!
	window.learner.setAllID();
	// display learner stats for patterns with at least 4 predictions logged 
	learner.displayCurrentIDStats();
	let SumSum = (learner.getSumSum());
	let nPositive = learner.getNPositiveSums();
	let nTotal = (learner.getNLearners());
	let learnerNames = learner.getLearnerNames();
	
	
	// Total modifier float
	let totalPercent = learner.getTotalPercents();
	let totalFuzz = learner.getTotalFuzz();
	let totalFuzzy = learner.getTotalFuzzy();
	let avgFuzz = learner.getAverageFuzz();
	let avgFuzzy = learner.getAverageFuzzy();
	// Average modifier float, 0-2
	let averagePercent = (totalPercent / nTotal)
	let totalPatterns = learner.getAll_numPossiblePatterns();
	// learners with a positive sum, as a percentage
	let percentPositive = nPositive / nTotal;
	let avgBias = (((averagePercent)) - 1);
	let totalBias = (((totalPercent).toFixed(0)) - (1 * nTotal));
	let avgFuzzyFuzz = ((avgFuzz + avgFuzzy) / 2);
	let sumcolor = "white";
	if (SumSum > 0) {
		sumcolor = "Lime";
	}
	if (SumSum < 0) {
		sumcolor = "Orange";
	}
	let percentcolor = "white";
	if (percentPositive > 0.5) {
		percentcolor = "Lime";
	}
	if (percentPositive < 0.5) {
		percentcolor = "Orange";
	}
	let percentcolorb = "white";
	if (percentPositive > 1) {
		percentcolorb = "Lime";
	}
	if (percentPositive < 1) {
		percentcolorb = "Orange";
	}
	let percentFuzz = "white";
	if (avgFuzz >= 0.5) {
		percentFuzz = "Lime";
	}
	if (avgFuzz < 0.5) {
		percentFuzz = "Orange";
	}
	let percentFuzzy = "white";
	if (avgFuzzy >= 0.5) {
		percentFuzzy = "Lime";
	}
	if (avgFuzzy < 0.5) {
		percentFuzzy = "Orange";
	}
	console.log(`%cMachine Learning 2x Strategy ~~ Learning From ${(tools.addCommas(totalPatterns))} Patterns`, 'color:White;font-size:16px;');
	let tlength = 0;
	let completePattern = '';
	/*
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		completePattern=(completePattern+(window.learner.get_Pattern(name).replace('0b','')));
		let patternLength=window.learner.get_Pattern(name).replace('0b','').length;
		window.learner[name].patternLength=patternLength;
		tlength+=patternLength;
	}
	*/

	//console.log('Total Possible Bot Creatable Strategies: '+tools.addCommas((2**tlength)/1000000000000)+',000,000,000,000'); 
	//console.log('Complete binary pattern: '+completePattern)
	console.log(`%cAverage Bias : ${((avgBias*100).toFixed(0))}% ~~~ Total Bias : ${((totalBias*100).toFixed(0))}% `, 'color:' + percentcolorb);
	console.log(`%cAverage Fuzz : ${(avgFuzz*100).toFixed(0)}% ~~~ Total Fuzz : ${(totalFuzz*100).toFixed(0)}% `, 'color:' + percentFuzz);
	console.log(`%cAverage Fuzzy: ${(avgFuzzy*100).toFixed(0)}% ~~~ Total Fuzzy: ${(totalFuzzy*100).toFixed(0)}% ~~~ Average Fuzzy Fuzz: ${(((avgFuzz+avgFuzzy)/2)*100).toFixed(0)}% `, 'color:' + percentFuzzy);
	// Fixed Probability: (((prob(2)+avgFuzz+avgFuzzy+avgFuzzyFuzz)/4)+avgBias)
	let gtProb = ((((prob(2) + prob(2) + avgFuzz + avgFuzzy + avgFuzzyFuzz + percentPositive) / 6) + avgBias) * averagePercent);
	let gtMod = gtProb * 2; // 0-2 bet modifier
	console.log(`%cNormal 2x Probability: ${(prob(2)*100).toFixed(1)}% ~~~~~ Gambletrons 2x Probability: ${(gtProb*100).toFixed(1)}%`, 'color:' + sumcolor);

	console.log(`%cSum of Learner Sums: ${SumSum}`, 'color:' + sumcolor);
	console.log(`%cPositive Learner Sums: ${nPositive} out of ${nTotal} (only patterns with at least 4+ predictions and +-1% sum rate counted)`, 'color:' + percentcolor);
	let GODLY = {}; // our bet holder
	let ssDivider = 99;
	if (nPositive > 0) {
		if (SumSum < (-1)) {
			ssDivider = ((150) + (Math.abs(SumSum) * 2));
		} else if (SumSum > 1) {
			ssDivider = ((99) + ((9 * (nTotal / nPositive)) / (SumSum * 2)));
		} else {
			ssDivider = 150;
		}
		console.log(`%cSSSSSSSSSSSSSSSSSSS ~~~~ SumSum Divider: ${(ssDivider/gtMod).toFixed(0)} ~~~~ SSSSSSSSSSSSSSSSSSS`, 'text-align:center;');
		if ((player.netProfit / 2) > player.initialBankroll) {
			// our net profit is now >200% of what we started with, we tripled our bankroll, use a mix of net profit and initial bankroll now
			if (gtMod >= 1.25) {
				GODLY.BET = (((player.netProfit / (99)) + (player.initialBankroll / (99))) / 2);
			} else if (gtMod >= 1.12) {
				GODLY.BET = (((player.netProfit / (111)) + (player.initialBankroll / (111))) / 2);
			} else if (gtMod >= 1.07) {
				GODLY.BET = (((player.netProfit / (133)) + (player.initialBankroll / (133))) / 2);
			} else if (gtMod >= 1.03) {
				GODLY.BET = (((player.netProfit / (167)) + (player.initialBankroll / (167))) / 2);
			} else if (gtMod >= 1.01) {
				GODLY.BET = (((player.netProfit / (222)) + (player.initialBankroll / (222))) / 2);
			} else if (gtMod >= 0.99) {
				GODLY.BET = (((player.netProfit / (333)) + (player.initialBankroll / (333))) / 2);
			} else if (gtMod >= 0.97) {
				GODLY.BET = (((player.netProfit / (444)) + (player.initialBankroll / (444))) / 2);
			} else if (gtMod >= 0.94) {
				GODLY.BET = (((player.netProfit / (666)) + (player.initialBankroll / (666))) / 2);
			} else {
				GODLY.BET = (((player.netProfit / (999)) + (player.initialBankroll / (999))) / 2);
			}
			GODLY.BET = ((GODLY.BET + (((player.netProfit / (ssDivider / gtMod)) + (player.initialBankroll / (ssDivider / gtMod))) / 2)) / 2);
		} else if ((player.netProfit * 2) > player.initialBankroll) {
			// our net profit is now >50% of what we started with, we will pretend that it is our bankroll until we fall back down <50% or hit >200%
			if (gtMod >= 1.25) {
				GODLY.BET = (player.netProfit / (99));
			} else if (gtMod >= 1.12) {
				GODLY.BET = (player.netProfit / (111));
			} else if (gtMod >= 1.07) {
				GODLY.BET = (player.netProfit / (133));
			} else if (gtMod >= 1.03) {
				GODLY.BET = (player.netProfit / (167));
			} else if (gtMod >= 1.01) {
				GODLY.BET = (player.netProfit / (222));
			} else if (gtMod >= 0.99) {
				GODLY.BET = (player.netProfit / (333));
			} else if (gtMod >= 0.97) {
				GODLY.BET = (player.netProfit / (444));
			} else if (gtMod >= 0.94) {
				GODLY.BET = (player.netProfit / (666));
			} else {
				GODLY.BET = (player.netProfit / (999));
			}
			GODLY.BET = ((GODLY.BET + (player.netProfit / (ssDivider / gtMod))) / 2);
		} else if (player.netProfit > 0) {
			// using initialBankroll, bet will remain similar when in profit 
			if (gtMod >= 1.25) {
				GODLY.BET = (player.initialBankroll / (99));
			} else if (gtMod >= 1.12) {
				GODLY.BET = (player.initialBankroll / (111));
			} else if (gtMod >= 1.07) {
				GODLY.BET = (player.initialBankroll / (133));
			} else if (gtMod >= 1.03) {
				GODLY.BET = (player.initialBankroll / (167));
			} else if (gtMod >= 1.01) {
				GODLY.BET = (player.initialBankroll / (222));
			} else if (gtMod >= 0.99) {
				GODLY.BET = (player.initialBankroll / (333));
			} else if (gtMod >= 0.97) {
				GODLY.BET = (player.initialBankroll / (444));
			} else if (gtMod >= 0.94) {
				GODLY.BET = (player.initialBankroll / (666));
			} else {
				GODLY.BET = (player.initialBankroll / (999));
			}
			GODLY.BET = ((GODLY.BET + (player.initialBankroll / (ssDivider / gtMod))) / 2);
		} else {
			//  using currentBankroll, bet will scale down when in debt
			if (gtMod >= 1.25) {
				GODLY.BET = (player.currentBankroll / (99));
			} else if (gtMod >= 1.12) {
				GODLY.BET = (player.currentBankroll / (111));
			} else if (gtMod >= 1.07) {
				GODLY.BET = (player.currentBankroll / (133));
			} else if (gtMod >= 1.03) {
				GODLY.BET = (player.currentBankroll / (167));
			} else if (gtMod >= 1.01) {
				GODLY.BET = (player.currentBankroll / (222));
			} else if (gtMod >= 0.99) {
				GODLY.BET = (player.currentBankroll / (333));
			} else if (gtMod >= 0.97) {
				GODLY.BET = (player.currentBankroll / (444));
			} else if (gtMod >= 0.94) {
				GODLY.BET = (player.currentBankroll / (666));
			} else {
				GODLY.BET = (player.currentBankroll / (999));
			}
			GODLY.BET = ((GODLY.BET + (player.currentBankroll / (ssDivider / gtMod))) / 2);
		}
		let ssmodB = 1;
		if (SumSum > nTotal) {
			ssmodB = 1.1;
		} else if (SumSum > 0) {
			ssmodB = 1.05;
		} else if (SumSum < 1 && SumSum > (-1)) {
			ssmodB = 1;
		} else if (SumSum < (0 - nTotal)) {
			ssmodB = 0.9;
		} else {
			ssmodB = 0.95;
		}
		let MajorModB = (((percentPositive * 2) + (averagePercent) + (ssmodB) + (gtMod)) / 4);
		GODLY.BET = (GODLY.BET * MajorModB);
		GODLY.BET *= gtMod;
		GODLY.MULTIPLIER = 200;
		let differ=(gtProb-prob(2));
		GODLY.BET *= (1+differ);
		
	} else {
		GODLY.BET = 0;
		GODLY.MULTIPLIER = 0;
	}


	let ssmod = 1;
	if (SumSum > nTotal) {
		ssmod = 1.2;
	} else if (SumSum > 0) {
		ssmod = 1.1;
	} else if (SumSum < 1 && SumSum > (-1)) {
		ssmod = 1;
	} else if (SumSum < (0 - nTotal)) {
		ssmod = 0.8;
	} else {
		ssmod = 0.9;
	}
	let MajorMod = (((percentPositive * 2) + (averagePercent) + (ssmod) + (gtMod)) / 4);
	// Set minimum and maximum bets based on net profit
	if ((player.netProfit / 2) > player.initialBankroll) {
		GODLY.BET > (((player.netProfit / (44.5 / MajorMod)) + (player.initialBankroll / (44.5 / MajorMod))) / 2) ? GODLY.BET = (((player.netProfit / (44.5 / MajorMod)) + (player.initialBankroll / (44.5 / MajorMod))) / 2) : null;
		if (GODLY.BET != 0 && GODLY.BET < 100) {
			GODLY.BET = 100;
			GODLY.MULTIPLIER = 200;
		}
		GODLY.BET > (((player.netProfit / (22)) + (player.initialBankroll / (22))) / 2) ? GODLY.BET = (((player.netProfit / (22)) + (player.initialBankroll / (22))) / 2) : null;
	} else if ((player.netProfit * 2) > player.initialBankroll) {
		GODLY.BET > (player.netProfit / (44.5 / MajorMod)) ? GODLY.BET = (player.netProfit / (44.5 / MajorMod)) : null;
		if (GODLY.BET != 0 && GODLY.BET < 100) {
			GODLY.BET = 100;
			GODLY.MULTIPLIER = 200;
		}
		GODLY.BET > (player.netProfit / 22) ? GODLY.BET = (player.netProfit / 22) : null;
	} else if (player.netProfit > 0) {
		//  using initialBankroll, max bet will remain similar when in profit, and bets under 1 bit will be played at 1 bit
		GODLY.BET > (player.initialBankroll / (44.5 / MajorMod)) ? GODLY.BET = (player.initialBankroll / (44.5 / MajorMod)) : null;
		if (GODLY.BET != 0 && GODLY.BET < 100) {
			GODLY.BET = 100;
			GODLY.MULTIPLIER = 200;
		}
		GODLY.BET > (player.initialBankroll / 22) ? GODLY.BET = (player.initialBankroll / 22) : null;
	} else {
		//  using currentBankroll, max bet will scale down when in debt, and bets under 1 bit will be sat out
		GODLY.BET > (player.currentBankroll / (44.5 / MajorMod)) ? GODLY.BET = (player.currentBankroll / (44.5 / MajorMod)) : null;
		if (GODLY.BET != 0 && GODLY.BET < 100) {
			GODLY.BET = 0;
			GODLY.MULTIPLIER = 0;
		}
		GODLY.BET > (player.currentBankroll / 22) ? GODLY.BET = (player.currentBankroll / 22) : null;
	}
	
	/*
	// EXPERIMENTAL MULTIPLIER BOOST
	// nTrue is the probability under average, up to 7 can be true, meaning all 7 signal less that probable outcomes
	// in this case, we will experiment with a multiplier boost
	let nTrue=((gtMod<0.8)+(percentPositive<0.4)+(averagePercent<0.8)+(ssmod<0.99)+(avgBias<0)+(avgFuzz<0.4)+(avgFuzzy<0.4));
	if (nTrue>=5 && gtProb<0.493 && GODLY.MULTIPLIER!=0 && GODLY.BET!=0){
		GODLY.MULTIPLIER-=100;
		GODLY.MULTIPLIER=((GODLY.MULTIPLIER+101)/2);
		GODLY.MULTIPLIER/=gtMod;
		GODLY.MULTIPLIER*=averagePercent;
		GODLY.MULTIPLIER/=(avgFuzz*2);
		GODLY.MULTIPLIER=((GODLY.MULTIPLIER+134)/2);
		GODLY.MULTIPLIER*=(1+((((nTrue+player.currentStreakCount)/2)/3.5)/((player.currentStreakCount+4)/5)));
		GODLY.MULTIPLIER=((GODLY.MULTIPLIER+149)/2);
		GODLY.MULTIPLIER/=(avgFuzz*2);
		GODLY.MULTIPLIER*=averagePercent;
		GODLY.MULTIPLIER/=gtMod;
		GODLY.MULTIPLIER=((GODLY.MULTIPLIER+197)/2);
		GODLY.MULTIPLIER+=100;
		if (GODLY.BET != 0 && GODLY.BET < 100) {
			GODLY.BET = 100;
		}
	}
	*/
	return {
		'amount': (GODLY.BET),
		'multiplier': GODLY.MULTIPLIER
	};
}
