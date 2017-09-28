
/*	Version 1 */
// window.learner: First Machine Learning Prototype to learn 2x patterns
// 2 learners included by default "patternRVG8" and "pattern3Quads5"
// New learners are added via learner.newLearner([LearnerName],[EvalStringAs'0b'+binaryString]);
// Learners keep track of the game outcome after the pattern of that learner
// Games over 2x add +1 to the sum of learner patterns that preceded it, under 2x subtracts 1 from sum

window.learner = {}
window.learner.loadAttempted=true;
window.learner.loaded=true;
window.learner.totalFuzzy=null;
window.learner.totalFuzz=null;
window.learner.averageFuzzy=null;
window.learner.averageFuzz=null;

/*	Version 2 Additions below:
Added variables for Totals, Averages, [name].current.[DATA], [name].previous.[DATA] 
This was previously all calculated in the strategy, and annoying to have to do every time
Added Actual Predictions - when a pattern is "red", (-sum, low %) it essentially predicts the next will be under 2x, otherwise it predicts over 2x
						 - the prediction is then read after the outcome of the game, and a correctCount and incorrectCount will be updated
						 - This can tell us when the learner needs to accelerate its "swing" to green from red or vice versa
						 - This can also more simply tell us whether to ignore that learner for a bit, or treat it with less weight
						 - We can make a merged sum, by calculating the correct/total sum (total-correct*2) and averaging it with the actualy sum
						 
Full list of additions to Version 2 (all arrays are indexed by the pattern ID):

window.learner.[learnername].ActualPredictions = [];
window.learner.[learnername].CorrectCount = [];
window.learner.[learnername].CorrectTotal = [];
window.learner.[learnername].CorrectMax = [];
window.learner.[learnername].IncorrectCount = [];
window.learner.[learnername].IncorrectTotal = [];
window.learner.[learnername].IncorrectMax = [];
window.learner.[learnername].SelfCorrecting=[];
window.learner.[learnername].SelfCorrectFromMax=[];
window.learner.[learnername].SelfCorrectFromTotal=[];
window.learner.[learnername].SelfCorrectFromBoth=[];
window.learner.[learnername].previous = {};
window.learner.[learnername].current = {};
*/

// Totals and averages should be kept track of for any integer variables that are not static
window.learner.total={};
window.learner.average={};
window.learner.total.Fuzzy=null;
window.learner.average.Fuzzy=null;
window.learner.total.Fuzz=null;
window.learner.average.Fuzz=null;
window.learner.total.FuzzyFuzz=null;
window.learner.average.FuzzyFuzz=null;
window.learner.total.Sums=null;
window.learner.average.Sums=null;
window.learner.total.Predictions=null;
window.learner.average.Predictions=null;
window.learner.total.Outcomes=null;
window.learner.average.Outcomes=null;
window.learner.total.CorrectCount=null;
window.learner.average.CorrectCount=null;
window.learner.total.CorrectTotal=null;
window.learner.average.CorrectTotal=null;
window.learner.total.CorrectMax=null;
window.learner.average.CorrectMax=null;
window.learner.total.CorrectedSums=null;
window.learner.average.CorrectedSums=null;

window.learner.total.PercentTrue=0;
window.learner.average.PercentTrue=0;

window.learner.total.Yups=0;
window.learner.total.Nopes=0;
window.learner.average.Yups=0;
window.learner.average.Nopes=0;
/*	Version 3 Additions (work in progress)
Questions and Variables! 
are to help create more patterns, but should be programmed in such a way that a simple ai could create questions from variables and then patterns from questions */
// Questions should be any useful statement than evaluates to true or false, combining these into a binary string creates the basis for a new learner 
window.learner.questions={};
// Variables should be any usefule variable we can make into a comparison statement, using either a static number or another variable. The resulting statement can be used to create a question
window.learner.variables={};
// Anything based on game history medians
window.learner.questions.medians={};
window.learner.variables.medians={};
// Anything calculated with crashes.probsum() (a custom created probability sum of the game history, a different kind of median)
window.learner.questions.psum={};
window.learner.variables.psum={};
// Anything stored in the profile class, such as win loss streaks, bankrolls, balance histories, etc
window.learner.questions.player={};
window.learner.variables.player={};
// Anything related to players other than ourselves, likely will be confined to identities class (players.known['user_'+username].....)
window.learner.questions.players={};
window.learner.variables.players={};
// Anything related to the last games basic data and outcome, stored in the match class, such as players joined, players won, lost, amount bet, max bet, highest bet etc etc.
window.learner.questions.game={};
window.learner.variables.game={};

window.learner.questions.strategy={};
window.learner.variables.strategy={};

window.learner.questions.crashes={};
window.learner.variables.crashes={};
// 
window.learner.questions.learner={};
window.learner.variables.learner={};
window.learner.maxWrong=1.02; // 1.02 = 2% more wrong predictions than right predictions are allowed for any single learner, any more wrong, and its data will not be used
window.learner.learners = ['patternRVG8', 'pattern3Quads5'];



window.learner.pattern3Quads5 = {};
window.learner.pattern3Quads5.ID = 0;
window.learner.pattern3Quads5.Outcomes = [];
window.learner.pattern3Quads5.Predictions = [];
window.learner.pattern3Quads5.Sums = [];
window.learner.pattern3Quads5.ActualPredictions = [];
window.learner.pattern3Quads5.CorrectCount = []; // How many times was the Actual Prediction was right, Resets to 0 when incorrect
window.learner.pattern3Quads5.CorrectTotal = []; // How many times was the Actual Prediction was right, Never resets
window.learner.pattern3Quads5.CorrectMax = []; // The highest amount of right predictions in a row
window.learner.pattern3Quads5.IncorrectCount = [];  // How many times was the Actual Prediction was wrong, Resets to 0 when correct
window.learner.pattern3Quads5.IncorrectTotal = []; // How many times was the Actual Prediction was wrong, Never resets
window.learner.pattern3Quads5.IncorrectMax = []; // The highest amount of wrong predictions in a row
window.learner.pattern3Quads5.CorrectedSums = []; // Sums amount that is modified by correctness
window.learner.pattern3Quads5.HistoryRequired = 16;
window.learner.pattern3Quads5.GamesPlayedRequired = 0;
window.learner.pattern3Quads5.currentSum = null;
window.learner.pattern3Quads5.previousFuzz = null;
window.learner.pattern3Quads5.currentFuzz = null;
window.learner.pattern3Quads5.currentFuzzyFuzz = null;
window.learner.pattern3Quads5.currentPattern = null;
window.learner.pattern3Quads5.currentOutcomes = null;
window.learner.pattern3Quads5.currentPredictions = null;
window.learner.pattern3Quads5.currentPercentTrue = null;
window.learner.pattern3Quads5.SelfCorrecting=[];  // true or false - is the current pattern needing a self correction
window.learner.pattern3Quads5.SelfCorrectFromMax=[];  // max incorrect - max correct
window.learner.pattern3Quads5.SelfCorrectFromTotal=[]; // total incorrect - total correct
window.learner.pattern3Quads5.SelfCorrectFromBoth=[]; // total+max incorrect - total+max correct
window.learner.pattern3Quads5.REQEVAL = "(1+1==2)";
window.learner.pattern3Quads5.IDEVAL = "('0b'+(((crashes.getRVGSum(5)>=3)+0)+''+((crashes.getRVGSum(5,5)>=3)+0)+''+((crashes.getRVGSum(5,10)>=3)+0)))";
window.learner.pattern3Quads5.previous = {}; // The previous patterns variable variables (non static)
window.learner.pattern3Quads5.current = {}; // The current patterns variable variables (non static)

window.learner.patternRVG8 = {};
window.learner.patternRVG8.ID = 0;
window.learner.patternRVG8.Outcomes = [];
window.learner.patternRVG8.Predictions = [];
window.learner.patternRVG8.Sums = [];
window.learner.patternRVG8.HistoryRequired = 9;
window.learner.patternRVG8.GamesPlayedRequired = 0;
window.learner.patternRVG8.currentSum = null;
window.learner.patternRVG8.previousFuzz = null;
window.learner.patternRVG8.currentFuzz = null;
window.learner.patternRVG8.currentFuzzyFuzz = null;
window.learner.patternRVG8.currentPattern = null;
window.learner.patternRVG8.currentOutcomes = null;
window.learner.patternRVG8.currentPredictions = null;
window.learner.patternRVG8.currentPercentTrue = null;
window.learner.patternRVG8.ActualPredictions = [];
window.learner.patternRVG8.CorrectCount = [];
window.learner.patternRVG8.CorrectTotal = [];
window.learner.patternRVG8.CorrectMax = [];
window.learner.patternRVG8.IncorrectCount = [];
window.learner.patternRVG8.IncorrectTotal = [];
window.learner.patternRVG8.IncorrectMax = [];
window.learner.patternRVG8.SelfCorrecting=[];
window.learner.patternRVG8.SelfCorrectFromMax=[];
window.learner.patternRVG8.SelfCorrectFromTotal=[];
window.learner.patternRVG8.SelfCorrectFromBoth=[];
window.learner.patternRVG8.previous = {};
window.learner.patternRVG8.current = {};
window.learner.patternRVG8.REQEVAL = "(1+1==2)";
window.learner.patternRVG8.IDEVAL = "('0b'+crashes.getRVGBinaryString(8))";


// we should consider negative sum patterns to be predictions of <2.00x and positive sum patterns to be >=2.00x
// A prediction of "true" or "false" should be marked when getting pattern/id, place that in the [name].ActualPredictions[ID] variable
//	during get outcomes, if the prediction was true, increase a "correctCount" variable by 1, reset incorrectCount, 
//											   true, set a highestIncorrectCount variable if it is higher
//											   false, increase a "incorrectCount" variable by 1, reset correctCount to 0
//											   false,  set a highestIncorrectCount variable if it is higher
// If a pattern prediction is incorrect more often than it is correct, the randomness patterns are changing, and our sums should change faster to self correct themselves
//	Otherwise we have to wait a very very long time for a sum correction to occur, by which time the randomness patterns may be changing again, resulting in the predictions being wrong more often than right
// The default Sums should stay as is, being a constant +- track of outcomes, a new variable, CorrectedSums will be a Sum that is corrected by the patterns predictions when incorrect


// Example, eval should be a string: IDEVAL="('0b'+crashes.getRVGBinaryString(8))"
// function then does eval(eval("('0b'+crashes.getRVGBinaryString(8))")) to get an integer ID for the pattern
// FULL EXAMPLE: learner.newLearner("patternRVG4","('0b'+crashes.getRVGBinaryString(4))",5,0);
// REQUIRED_EVAL will require its contents to evaluate true before the learner does much of anything (getting pattern, id, etc) -
// if REQEVAL is false, outcomes are still calculated as long as .ID is available

window.learner.newLearner = function (name = null, IDEVAL = null, REQUIRES_EVAL="(1+1==2)", RequiresHistory = 128, RequiresGamesPlayed = 0) {
	if (!name) {
		return false
	}
	window.learner.learners.push(name);
	window.learner[name] = {};
	window.learner[name].ID = null;
	window.learner[name].CreationDate = Date.now();
	window.learner[name].Name = name;
	window.learner[name].Outcomes = [];
	window.learner[name].Predictions = [];
	window.learner[name].Sums = [];
	window.learner[name].CorrectedSums = [];
	window.learner[name].ActualPredictions = [];
	window.learner[name].CorrectCount = [];
	window.learner[name].CorrectTotal = [];
	window.learner[name].CorrectMax = [];
	window.learner[name].IncorrectCount = [];
	window.learner[name].IncorrectTotal = [];
	window.learner[name].IncorrectMax = [];
	window.learner[name].HistoryRequired = RequiresHistory;
	window.learner[name].GamesPlayedRequired = RequiresGamesPlayed;
	window.learner[name].SelfCorrecting=[];
	window.learner[name].SelfCorrectFromMax=[];
	window.learner[name].SelfCorrectFromTotal=[];
	window.learner[name].SelfCorrectFromBoth=[];
	window.learner[name].REQEVAL = REQUIRES_EVAL;
	window.learner[name].IDEVAL = IDEVAL;
	window.learner[name].current = {};
	window.learner[name].previous = {};

}

window.learner.get_ID = function (thename = null) {
	if (thename == null) {
		console.log(`get_ID requires the name of the learner`);
		return null
	}
	
	let name=thename;
	if (crashes.history.length < window.learner[thename].HistoryRequired) {
		//console.log(`Cannot yet get an ID for learner ${name}: ${window.learner[name].HistoryRequired} games required in history.`);
		return null
	}
	if (player.numGamesPlayed < window.learner[thename].GamesPlayedRequired) {
		//console.log(`Cannot yet get an ID for learner ${name}: Must play at least ${window.learner[name].GamesPlayedRequired} games.`);
		return null
	}

	if (window.learner[thename].IDEVAL != null) {
		let PID=(eval(eval(window.learner[thename].IDEVAL)))
		window.learner[thename].Sums[PID]<0?window.learner[thename].ActualPredictions[PID]=false:window.learner[thename].ActualPredictions[PID]=true;
		return PID
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return null
	}
}

window.learner.set_ID = function (thename = null) {
	if (thename == null) {
		console.log(`get_ID requires the name of the learner`);
		return null
	}
	
	let name=thename;
	window.learner[thename].ID = window.learner[thename].get_ID(thename);
}

window.learner.get_Pattern = function (thename = null) {
	if (thename == null) {
		console.log(`get_Pattern requires the name of the learner`);
		return null
	}
	let name=thename;
	typeof window.learner[name].REQEVAL=="undefined"?window.learner[name].REQEVAL="(1+1==2)":null;
		
	if ((crashes.history.length < window.learner[thename].HistoryRequired) || (player.numGamesPlayed < window.learner[thename].GamesPlayedRequired)) {
		console.log(`learner ${thename} requires more history or games played to build a pattern`);
		return null
	}
	if (window.learner[thename].IDEVAL != null && window.learner[thename].ID != null) {
		return ((eval(window.learner[thename].IDEVAL)).replace('0b', ''))
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return null
	}
	return null
}

window.learner.get_numPossibilities = function (thename = null) {
	if (thename == null) {
		console.log(`get_numPossibilities requires the name of the learner`);
		return null
	}
	
	let name=thename;
	if ((window.learner[thename].ID==null) || (crashes.history.length < window.learner[thename].HistoryRequired) || (player.numGamesPlayed < window.learner[thename].GamesPlayedRequired)) {
		console.log(`learner ${thename} requires more history or games played to build a pattern`);
		return null
	}
	if (window.learner[thename].IDEVAL != null) {
		window.learner[thename].possibilities = (2 ** (((eval(window.learner[thename].IDEVAL)).replace('0b', '')).length));
		return window.learner[thename].possibilities
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return null
	}
	return null
}

window.learner.getAll_numPossiblePatterns = function () {
	let possi = 0;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		possi += window.learner.get_numPossibilities(name);
	}
	window.learner.numPossiblePatterns = possi;
	return (possi)
}

window.learner.getAllOutcomes = function (multiplier = 200, startAt = 0) {
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		typeof window.learner[name].Name == "undefined" ? window.learner[name].Name = name : null;
		typeof window.learner[name].REQEVAL=="undefined"?window.learner[name].REQEVAL="(1+1==2)":null;
		
		if ((window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
			continue
		}
		let learnerID = window.learner[name].ID;
		typeof window.learner[name].current == "undefined" ? window.learner[name].current = {} : null;
		typeof window.learner[name].previous == "undefined" ? window.learner[name].previous = {} : null;
		
		
		typeof window.learner[name].ActualPredictions == "undefined" ? window.learner[name].ActualPredictions = []:null;
		typeof window.learner[name].CorrectCount == "undefined" ? window.learner[name].CorrectCount = []:null;
		typeof window.learner[name].CorrectTotal == "undefined" ? window.learner[name].CorrectTotal = []:null;
		typeof window.learner[name].CorrectMax == "undefined" ? window.learner[name].CorrectMax = []:null;
		typeof window.learner[name].IncorrectCount == "undefined" ? window.learner[name].IncorrectCount = []:null;
		typeof window.learner[name].IncorrectTotal == "undefined" ? window.learner[name].IncorrectTotal = []:null;
		typeof window.learner[name].IncorrectMax == "undefined" ? window.learner[name].IncorrectMax = []:null;
		typeof window.learner[name].CorrectedSums== "undefined" ?window.learner[name].CorrectedSums = []:null;
		typeof window.learner[name].CorrectedSums[learnerID]== "undefined" ?window.learner[name].CorrectedSums[learnerID] = window.learner[name].Sums[learnerID]:null;
		typeof window.learner[name].ActualPredictions[learnerID] == "undefined" ? window.learner[name].ActualPredictions[learnerID] = null:null;
		typeof window.learner[name].CorrectCount[learnerID] == "undefined" ? window.learner[name].CorrectCount[learnerID] = 0:null;
		typeof window.learner[name].CorrectTotal[learnerID] == "undefined" ? window.learner[name].CorrectTotal[learnerID] = 0:null;
		typeof window.learner[name].CorrectMax[learnerID] == "undefined" ? window.learner[name].CorrectMax[learnerID] = 0:null;
		typeof window.learner[name].IncorrectCount[learnerID] == "undefined" ? window.learner[name].IncorrectCount[learnerID] =0:null;
		typeof window.learner[name].IncorrectTotal[learnerID] == "undefined" ? window.learner[name].IncorrectTotal[learnerID] =0:null;
		typeof window.learner[name].IncorrectMax[learnerID] == "undefined" ? window.learner[name].IncorrectMax[learnerID] =0:null;
		
		typeof window.learner[name].SelfCorrecting=="undefined"?window.learner[name].SelfCorrecting=[]: null;
		typeof window.learner[name].SelfCorrectFromMax=="undefined"?window.learner[name].SelfCorrectFromMax=[]: null;
		typeof window.learner[name].SelfCorrectFromTotal=="undefined"?window.learner[name].SelfCorrectFromTotal=[]: null;
		typeof window.learner[name].SelfCorrectFromBoth=="undefined"?window.learner[name].SelfCorrectFromBoth=[]: null;
		typeof window.learner[name].SelfCorrecting[learnerID]=="undefined"?window.learner[name].SelfCorrecting[learnerID]=false: null;
		typeof window.learner[name].SelfCorrectFromMax[learnerID]=="undefined"?window.learner[name].SelfCorrectFromMax[learnerID]=0: null;
		typeof window.learner[name].SelfCorrectFromTotal[learnerID]=="undefined"?window.learner[name].SelfCorrectFromTotal[learnerID]=0: null;
		typeof window.learner[name].SelfCorrectFromBoth[learnerID]=="undefined"?window.learner[name].SelfCorrectFromBoth[learnerID]=0: null;
		
		typeof window.learner[name].Outcomes[learnerID] == "undefined" ? window.learner[name].Outcomes[learnerID] = 0 : null;
		window.learner[name].Outcomes[learnerID] == null ? window.learner[name].Outcomes[learnerID] = 0 : null;
		window.learner[name].Sums[learnerID] == null ? window.learner[name].Sums[learnerID] = 0 : null;
		typeof window.learner[name].Predictions[learnerID] == "undefined" ? window.learner[name].Predictions[learnerID] = 0 : null;
		typeof window.learner[name].Sums[learnerID] == "undefined" ? window.learner[name].Sums[learnerID] = 0 : null;
		typeof window.learner[name].HistoryRequired == "undefined" ? window.learner[name].HistoryRequired = 128 : null;
		typeof window.learner[name].GamesPlayedRequired == "undefined" ? window.learner[name].GamesPlayedRequired = 0 : null;
		typeof window.learner[name].gameIDAtCreation == "undefined" ? window.learner[name].gameIDAtCreation = game.gameID : null;
		typeof window.learner[name].timestameAtCreation == "undefined" ? window.learner[name].timestameAtCreation = Date.now() : null;
		typeof window.learner[name].fuzzy == "undefined" ? window.learner[name].fuzzy = 0.5 : null;
		typeof window.learner[name].Fuzz == "undefined" ? window.learner[name].Fuzz = [] : null;
		typeof window.learner[name].Fuzz[learnerID] == "undefined" ? window.learner[name].Fuzz[learnerID] = 0.5 : null;
		typeof window.learner[name].TotalSums == "undefined"?window.learner[name].TotalSums =[]:null;
		typeof window.learner[name].TotalSums[learnerID] == "undefined"?window.learner[name].TotalSums[learnerID] =((window.learner[name].Outcomes[learnerID]*2)-window.learner[name].Predictions[learnerID]):window.learner[name].TotalSums[learnerID] =((window.learner[name].Outcomes[learnerID]*2)-window.learner[name].Predictions[learnerID]);
		
		let numOutcomes = window.learner[name].Outcomes[learnerID];
		let sum = window.learner[name].Sums[learnerID];
		
		let numPredictions = window.learner[name].Predictions[learnerID];
		let fuzzOP=(numOutcomes/numPredictions);
		window.learner[name].current.Sum = sum;

		if (window.learner[name].Predictions[learnerID] == null) {
			continue
		}
		// Version 3 we can obtain the total sum of outcomes -+ without doing sum++ sum-- sum variable, using (Outcomes*2)-Predictions
		// added window.learner[name].TotalSums which is the result of the above, Sums will now be a modified sum based on total and correctedsum
		// 		Mind Blown? 0.69+(crashes.probSum(1,0)*3.14) - we can use the damn probSum for our Sum variable without even testing the last crash!
		if ((crashes.history.length >= window.learner[name].HistoryRequired) && (player.numGamesPlayed >= window.learner[name].GamesPlayedRequired)) {
			if (crashes.history[startAt] >= multiplier) {
				if (window.learner[name].ActualPredictions[learnerID]!=null){
					if (window.learner[name].ActualPredictions[learnerID]==false){
						// outcome was true, prediction was false, incorrect prediction
						window.learner[name].IncorrectCount[learnerID]+=1;
						if (window.learner[name].CorrectCount[learnerID]>window.learner[name].CorrectMax[learnerID]){
							window.learner[name].CorrectMax[learnerID]=window.learner[name].CorrectCount[learnerID];
						}
						window.learner[name].CorrectCount[learnerID]=0;
						window.learner[name].IncorrectTotal[learnerID]+=1;
					} else {
						// outcome was true, prediction was true, correct prediction
						window.learner[name].CorrectCount[learnerID]+=1;
						if (window.learner[name].IncorrectCount[learnerID]>window.learner[name].IncorrectMax[learnerID]){
							window.learner[name].IncorrectMax[learnerID]=window.learner[name].IncorrectCount[learnerID];
						}
						window.learner[name].IncorrectCount[learnerID]=0;
						window.learner[name].CorrectTotal[learnerID]+=1;
					}
				}
				window.learner[name].Fuzz[learnerID] = parseFloat(window.learner[name].Fuzz[learnerID]);
				window.learner[name].fuzzy = parseFloat(window.learner[name].fuzzy);
				window.learner[name].Fuzz[learnerID] = (((window.learner[name].previous.Fuzz)+(window.learner[name].Fuzz[learnerID])+(0.99))/3);
				window.learner[name].fuzzy = (((window.learner[name].previous.Fuzzy)+window.learner[name].fuzzy+0.99)/2);
				
				window.learner[name].fuzzy = (((fuzzOP)+(window.learner[name].Fuzz[learnerID]) + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + (window.learner[name].fuzzy) + (window.learner[name].fuzzy) + (0.999) + (0.334 * (window.learner[name].fuzzy / 2))) / 10);
				window.learner[name].Fuzz[learnerID] = (((fuzzOP)+(window.learner[name].previous.Fuzz)+(window.learner[name].previous.Fuzzy) + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + window.learner[name].Fuzz[learnerID] + window.learner[name].Fuzz[learnerID] + 0.999 + (0.334 * (window.learner[name].Fuzz[learnerID] / 2))) / 11);
				
				
					window.learner[name].Outcomes[learnerID]++
			} else {
				
				if (window.learner[name].ActualPredictions[learnerID]!=null){
					
					if (window.learner[name].ActualPredictions[learnerID]==true){
						// outcome was false, prediction was true, incorrect prediction
						window.learner[name].IncorrectCount[learnerID]+=1;
						if (window.learner[name].CorrectCount[learnerID]>window.learner[name].CorrectMax[learnerID]){
							window.learner[name].CorrectMax[learnerID]=window.learner[name].CorrectCount[learnerID];
						}
						window.learner[name].CorrectCount[learnerID]=0;
						window.learner[name].IncorrectTotal[learnerID]+=1;
					} else {
						// outcome was false, prediction was false, correct prediction
						window.learner[name].CorrectCount[learnerID]+=1;
						if (window.learner[name].IncorrectCount[learnerID]>window.learner[name].IncorrectMax[learnerID]){
							window.learner[name].IncorrectMax[learnerID]=window.learner[name].IncorrectCount[learnerID];
						}
						window.learner[name].IncorrectCount[learnerID]=0;
						window.learner[name].CorrectTotal[learnerID]+=1;
					}
				}
				window.learner[name].Fuzz[learnerID] = parseFloat(window.learner[name].Fuzz[learnerID]);
				window.learner[name].fuzzy = parseFloat(window.learner[name].fuzzy);
				window.learner[name].Fuzz[learnerID] = (((window.learner[name].previous.Fuzz)+(window.learner[name].Fuzz[learnerID])+(0.001))/3);
				window.learner[name].fuzzy = (((window.learner[name].previous.Fuzzy)+window.learner[name].fuzzy+0.001)/2);
				window.learner[name].fuzzy = (((fuzzOP)+(window.learner[name].Fuzz[learnerID]) + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + (window.learner[name].fuzzy) + (window.learner[name].fuzzy) + (0.001) + (0.334 * (window.learner[name].fuzzy / 2))) / 10);
				window.learner[name].Fuzz[learnerID] = (((fuzzOP)+(window.learner[name].previous.Fuzz)+(window.learner[name].previous.Fuzzy) + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + window.learner[name].Fuzz[learnerID] + window.learner[name].Fuzz[learnerID] + 0.001 + (0.334 * (window.learner[name].Fuzz[learnerID] / 2))) / 11);
				
			}
			window.learner[name].Fuzz[learnerID]=(((window.learner[name].Fuzz[learnerID])+((1+(crashes.probSum(1,6)))/2))/2);
			window.learner[name].fuzzy =(((window.learner[name].fuzzy)+(0.5)+((1+(crashes.probSum(1,0)))-0.5))/3);
			
			if (window.isNaN(window.learner[name].fuzzy)==true) {
				window.learner[name].fuzzy = 0.42;
			}
			if (window.isNaN(window.learner[name].Fuzz[learnerID])==true) {
				window.learner[name].Fuzz[learnerID] = 0.42;
			}
			if (window.learner[name].Fuzz[learnerID]<=0) {
				window.learner[name].Fuzz[learnerID] = 0.002;
			}
			if (window.learner[name].Fuzz[learnerID]>=1) {
				window.learner[name].Fuzz[learnerID] = 0.998;
			}
			window.learner[name].Predictions[learnerID]++;
			window.learner[name].TotalSums[learnerID]=((window.learner[name].Outcomes[learnerID]*2)-window.learner[name].Predictions[learnerID]);
			(window.learner[name].IncorrectMax[learnerID] >window.learner[name].CorrectMax[learnerID])? window.learner[name].SelfCorrectFromMax[learnerID] = window.learner[name].IncorrectMax[learnerID]-window.learner[name].CorrectMax[learnerID]: null;
			(window.learner[name].IncorrectTotal[learnerID] >window.learner[name].CorrectTotal[learnerID])? window.learner[name].SelfCorrectFromTotal[learnerID] = window.learner[name].IncorrectTotal[learnerID]-window.learner[name].CorrectTotal[learnerID]: null;
			(window.learner[name].IncorrectMax[learnerID] >window.learner[name].CorrectMax[learnerID] && window.learner[name].IncorrectTotal[learnerID] >window.learner[name].CorrectTotal[learnerID])? window.learner[name].SelfCorrectFromBoth[learnerID] = ((window.learner[name].IncorrectTotal[learnerID]-window.learner[name].CorrectTotal[learnerID])+(window.learner[name].IncorrectMax[learnerID]-window.learner[name].CorrectMax[learnerID])) : null;
			
			
			// Yups are correct predictions, current, total, max should be evaluated
			// cur is the current streak of correct and incorrect predictions
			let curYups=window.learner[name].CorrectCount[learnerID];
			let curNopes=window.learner[name].IncorrectCount[learnerID];
			window.learner[name].current.curYups=window.learner[name].CorrectCount[learnerID];
			window.learner[name].current.curNopes=window.learner[name].IncorrectCount[learnerID];
			// tot is the total number of correct and incorrect predictions
			let totYups=window.learner[name].CorrectTotal[learnerID];
			let totNopes=window.learner[name].IncorrectTotal[learnerID];
			window.learner[name].current.totYups=window.learner[name].CorrectTotal[learnerID];
			window.learner[name].current.totNopes=window.learner[name].IncorrectTotal[learnerID];
			// max is the highest streak of correct and incorrect predictions
			let maxYups=window.learner[name].CorrectMax[learnerID];
			let maxNopes=window.learner[name].IncorrectMax[learnerID];
			window.learner[name].current.maxYups=window.learner[name].CorrectMax[learnerID];
			window.learner[name].current.maxNopes=window.learner[name].IncorrectMax[learnerID];
			window.learner[name].CorrectedSums[learnerID]=0;
			
			if (curNopes>(maxNopes/2)){
				
				
				if (window.learner[name].ActualPredictions[learnerID]==true){
					// if actual predict is true, then sum was positivea nd we should move it towards negative, else sum was negative and we should move it towards positive
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(((curNopes)/3)+crashes.probSum(1,0));
				} else {
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(Math.abs(((curNopes)/3)+crashes.probSum(1,0)));
				}
			}
			if (maxNopes>maxYups && curNopes>=1 && curYups==0){
				
				
				if (window.learner[name].ActualPredictions[learnerID]==true){
					// if actual predict is true, then sum was positivea nd we should move it towards negative, else sum was negative and we should move it towards positive
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(((maxYups-maxNopes)/1.334)+crashes.probSum(1,0));
				} else {
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(Math.abs(((maxYups-maxNopes)/1.334)+crashes.probSum(1,0)));
				}
			}
			if (totNopes>totYups && curNopes>=1 && curYups==0){
				
				
				if (window.learner[name].ActualPredictions[learnerID]==true){
					// if actual predict is true, then sum was positivea nd we should move it towards negative, else sum was negative and we should move it towards positive
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(((totYups-totNopes)/1.667)+crashes.probSum(1,0));
				} else {
					window.learner[name].CorrectedSums[learnerID]+=Math.ceil(Math.abs(((totYups-totNopes)/1.667)+crashes.probSum(1,0)));
				}
				
				
			}
			
			if (totNopes<=totYups && maxNopes<=maxYups){
				window.learner[name].Sums[learnerID]=Math.round((window.learner[name].CorrectedSums[learnerID]+window.learner[name].Sums[learnerID]+window.learner[name].TotalSums[learnerID])/3);
			} else {
				window.learner[name].Sums[learnerID]=Math.round((window.learner[name].CorrectedSums[learnerID]+window.learner[name].Sums[learnerID])/2);
			}
			window.learner[name].Sums[learnerID]+=window.learner[name].CorrectedSums[learnerID];
			// now we self correct the sum 
			if (curNopes>0 && window.learner[name].ActualPredictions[learnerID]==true){
				// prediction was WRONG  if actual predict is true, then sum was positive and we should move it towards negative, else sum was negative and we should move it towards positive
				window.learner[name].Sums[learnerID]-=(0.69+(crashes.probSum(1,0)*3.14));
			} else if (curYups>0 && window.learner[name].ActualPredictions[learnerID]==true){
				// prediction was RIGHT and sum when predicted was positive (predicted true, got true, + to sum)
				window.learner[name].Sums[learnerID]+=(0.69+(crashes.probSum(1,0)*3.14));
			} else if (curNopes>0 && window.learner[name].ActualPredictions[learnerID]==false){
				// prediction was WRONG and sum when predicted was positive (predicted true, got true, + to sum)
				window.learner[name].Sums[learnerID]-=(0.69+(crashes.probSum(1,0)*3.14));
			}  else if (curYups>0 && window.learner[name].ActualPredictions[learnerID]==false){
				// prediction was RIGHT and sum when predicted was positive (predicted true, got true, + to sum)
				window.learner[name].Sums[learnerID]+=(0.69+(crashes.probSum(1,0)*3.14));
			} 
			
			
		}
		
		
			
		typeof window.learner[name].current == "undefined" ? window.learner[name].current = {} : null;
		typeof window.learner[name].previous == "undefined" ? window.learner[name].previous = {} : null;
		
		
		// Update variables from previous pattern as long as current is defined
		typeof window.learner[name].current.CorrectedSums!= "undefined" ? window.learner[name].previous.CorrectedSums=window.learner[name].current.CorrectedSums: null;
		typeof window.learner[name].current.SelfCorrecting!= "undefined" ? window.learner[name].previous.SelfCorrecting=window.learner[name].current.SelfCorrecting: null;
		typeof window.learner[name].current.SelfCorrectFromBoth!= "undefined" ? window.learner[name].previous.SelfCorrectFromBoth=window.learner[name].current.SelfCorrectFromBoth: null;
		typeof window.learner[name].current.SelfCorrectFromTotal!= "undefined" ? window.learner[name].previous.SelfCorrectFromTotal=window.learner[name].current.SelfCorrectFromTotal: null;
		typeof window.learner[name].current.SelfCorrectFromMax!= "undefined" ? window.learner[name].previous.SelfCorrectFromMax=window.learner[name].current.SelfCorrectFromMax: null;
		typeof window.learner[name].current.Sum!= "undefined" ? window.learner[name].previous.Sum=window.learner[name].current.Sum: null;
		typeof window.learner[name].current.Fuzz!= "undefined" ? window.learner[name].previous.Fuzz=window.learner[name].current.Fuzz: null;
		typeof window.learner[name].current.Fuzzy!= "undefined" ? window.learner[name].previous.Fuzzy=window.learner[name].current.Fuzzy: null;
		typeof window.learner[name].current.FuzzyFuzz!= "undefined" ? window.learner[name].previous.FuzzyFuzz=window.learner[name].current.FuzzyFuzz: null;
		typeof window.learner[name].current.Pattern!= "undefined" ? window.learner[name].previous.Pattern=window.learner[name].current.Pattern: null;
		typeof window.learner[name].current.Outcomes!= "undefined" ? window.learner[name].previous.Outcomes=window.learner[name].current.Outcomes: null;
		typeof window.learner[name].current.Predictions!= "undefined" ? window.learner[name].previous.Predictions=window.learner[name].current.Predictions: null;
		typeof window.learner[name].current.PercentTrue!= "undefined" ? window.learner[name].previous.PercentTrue=window.learner[name].current.PercentTrue: null;
		typeof window.learner[name].current.curYups!= "undefined" ? window.learner[name].previous.curYups=window.learner[name].current.curYups: window.learner[name].current.curYups=0;
		typeof window.learner[name].current.curNopes!= "undefined" ? window.learner[name].previous.curNopes=window.learner[name].current.curNopes: window.learner[name].current.curNopes=0;
		typeof window.learner[name].current.maxYups!= "undefined" ? window.learner[name].previous.maxYups=window.learner[name].current.maxYups: window.learner[name].current.maxYups=0;
		typeof window.learner[name].current.maxNopes!= "undefined" ? window.learner[name].previous.maxNopes=window.learner[name].current.maxNopes: window.learner[name].current.maxNopes=0;
		typeof window.learner[name].current.totYups!= "undefined" ? window.learner[name].previous.totYups=window.learner[name].current.totYups: window.learner[name].current.totYups=0;
		typeof window.learner[name].current.totNopes!= "undefined" ? window.learner[name].previous.totNopes=window.learner[name].current.totNopes: window.learner[name].current.totNopes=0;
		window.learner[name].current = {};
		
		window.learner[name].current.curYups=window.learner[name].CorrectCount[learnerID];
		window.learner[name].current.curNopes=window.learner[name].IncorrectCount[learnerID];

		window.learner[name].current.totYups=window.learner[name].CorrectTotal[learnerID];
		window.learner[name].current.totNopes=window.learner[name].IncorrectTotal[learnerID];

		window.learner[name].current.maxYups=window.learner[name].CorrectMax[learnerID];
		window.learner[name].current.maxNopes=window.learner[name].IncorrectMax[learnerID];

		window.learner[name].current.CorrectedSums = parseFloat(window.learner[name].CorrectedSums[learnerID]);
		window.learner[name].current.TotalSums = parseFloat(window.learner[name].TotalSums[learnerID]);
		window.learner[name].current.SelfCorrectFromBoth = parseInt(window.learner[name].SelfCorrectFromBoth[learnerID]);
		window.learner[name].current.SelfCorrectFromTotal = parseInt(window.learner[name].SelfCorrectFromTotal[learnerID]);
		window.learner[name].current.SelfCorrectFromMax = parseInt(window.learner[name].SelfCorrectFromMax[learnerID]);
		window.learner[name].current.Sum = parseInt(window.learner[name].Sums[learnerID]);
		window.learner[name].current.Fuzz = parseFloat(window.learner[name].Fuzz[learnerID]);
		window.learner[name].current.Fuzzy = parseFloat(window.learner[name].fuzzy);
		window.learner[name].current.FuzzyFuzz = ((parseFloat(window.learner[name].Fuzz[learnerID]) + parseFloat(window.learner[name].fuzzy)) / 2);
		window.learner[name].current.Outcomes = parseInt(window.learner[name].Outcomes[learnerID]);
		window.learner[name].current.Predictions = parseInt(window.learner[name].Predictions[learnerID]);
		window.learner[name].current.PercentTrue = (parseInt(window.learner[name].Outcomes[learnerID]) / parseInt(window.learner[name].Predictions[learnerID]));
		
		window.learner[name].current.Pattern = window.learner.get_Pattern(name);
		window.learner[name].current.SelfCorrecting = window.learner[name].SelfCorrecting[learnerID];
		window.learner[name].current.ID = eval(('0b'+window.learner[name].current.Pattern));
		
		
		// DEPRECATED
		/*
		window.learner[name].currentSelfCorrecting = window.learner[name].SelfCorrecting[learnerID];
		window.learner[name].currentSelfCorrectFromBoth = window.learner[name].SelfCorrectFromBoth[learnerID];
		window.learner[name].currentSelfCorrectFromTotal = window.learner[name].SelfCorrectFromTotal[learnerID];
		window.learner[name].currentSelfCorrectFromMax = window.learner[name].SelfCorrectFromMax[learnerID];
		window.learner[name].currentSum = window.learner[name].Sums[learnerID];
		window.learner[name].previousFuzz = window.learner[name].currentFuzz;
		window.learner[name].currentFuzz = window.learner[name].Fuzz[learnerID];
		window.learner[name].currentFuzzyFuzz = ((window.learner[name].Fuzz[learnerID] + window.learner[name].fuzzy) / 2);
		window.learner[name].currentPattern = window.learner.get_Pattern(name);
		window.learner[name].currentOutcomes = window.learner[name].Outcomes[learnerID];
		window.learner[name].currentPredictions = window.learner[name].Predictions[learnerID];
		window.learner[name].currentPercentTrue = (window.learner[name].Outcomes[learnerID] / window.learner[name].Predictions[learnerID]);
		*/
	}
}

// Logs the stats for current learner patterns to the console, if they have at least [minimumPredictions] and the sum must be 1% or more of the predictions, else it is likely to not be a good predictor
window.learner.displayCurrentIDStats = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001,collapsedGroup=true, dontCountNPercWrong=1.09) {
	let predictionDivider = 1 / minimumSumPercentOfPred;
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	collapsedGroup==false?console.group(window.learner.learners.length + ' 2x Learners'):console.groupCollapsed(window.learner.learners.length + ' 2x Learners');
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		let N=name;
		if (window.learner[name].ID == null) {
			continue
		}
		typeof window.learner[name].REQEVAL=="undefined"?window.learner[name].REQEVAL="(1+1==2)":null;
		if ((dontCountNPercWrong>0 && ((window.learner[name].current.totNopes/window.learner[name].current.totYups)>=dontCountNPercWrong)) || (eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
			continue
		}
		let learnerID=window.learner[name].ID;
		let PID=window.learner[name].ID;
		
		typeof window.learner[name].ActualPredictions == "undefined" ? window.learner[name].ActualPredictions = []:null;
		typeof window.learner[name].CorrectCount == "undefined" ? window.learner[name].CorrectCount = []:null;
		typeof window.learner[name].CorrectTotal == "undefined" ? window.learner[name].CorrectTotal = []:null;
		typeof window.learner[name].CorrectMax == "undefined" ? window.learner[name].CorrectMax = []:null;
		typeof window.learner[name].IncorrectCount == "undefined" ? window.learner[name].IncorrectCount = []:null;
		typeof window.learner[name].IncorrectTotal == "undefined" ? window.learner[name].IncorrectTotal = []:null;
		typeof window.learner[name].IncorrectMax == "undefined" ? window.learner[name].IncorrectMax = []:null;
		
		typeof window.learner[name].ActualPredictions[learnerID] == "undefined" ? window.learner[name].ActualPredictions[learnerID] = null:null;
		typeof window.learner[name].CorrectCount[learnerID] == "undefined" ? window.learner[name].CorrectCount[learnerID] = 0:null;
		typeof window.learner[name].CorrectTotal[learnerID] == "undefined" ? window.learner[name].CorrectTotal[learnerID] = 0:null;
		typeof window.learner[name].CorrectMax[learnerID] == "undefined" ? window.learner[name].CorrectMax[learnerID] = 0:null;
		typeof window.learner[name].IncorrectCount[learnerID] == "undefined" ? window.learner[name].IncorrectCount[learnerID] =0:null;
		typeof window.learner[name].IncorrectTotal[learnerID] == "undefined" ? window.learner[name].IncorrectTotal[learnerID] =0:null;
		typeof window.learner[name].IncorrectMax[learnerID] == "undefined" ? window.learner[name].IncorrectMax[learnerID] =0:null;
		
		typeof window.learner[name].TotalSums == "undefined"?window.learner[name].TotalSums =[]:null;
		typeof window.learner[name].TotalSums[learnerID] == "undefined"?window.learner[name].TotalSums[learnerID] =((window.learner[name].Outcomes[learnerID]*2)-window.learner[name].Predictions[learnerID]):null;
		
		typeof window.learner[name].CorrectedSums== "undefined" ?window.learner[name].CorrectedSums = []:null;
		typeof window.learner[name].CorrectedSums[learnerID]== "undefined" ?window.learner[name].CorrectedSums[learnerID] = 0:null;
		typeof window.learner[name].Outcomes[window.learner[name].ID] == "undefined" ? window.learner[name].Outcomes[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Predictions[window.learner[name].ID] == "undefined" ? window.learner[name].Predictions[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Sums[window.learner[name].ID] == "undefined" ? window.learner[name].Sums[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].fuzzy == "undefined" ? window.learner[name].fuzzy = 0.5 : null;
		typeof window.learner[name].Fuzz == "undefined" ? window.learner[name].Fuzz = [] : null;
		typeof window.learner[name].Fuzz[window.learner[name].ID] == "undefined" ? window.learner[name].Fuzz[window.learner[name].ID] = 0.5 : null;
		if (window.isNaN(window.learner[name].fuzzy)==true) {
			window.learner[name].fuzzy = 0.5;
		}
		if (window.isNaN(window.learner[name].Fuzz[learnerID])==true) {
			window.learner[name].Fuzz[learnerID] = 0.5;
		}
		let numPredictions = window.learner[name].Predictions[window.learner[name].ID];
		let sum = window.learner[name].Sums[window.learner[name].ID];
		let sumReq = numPredictions / predictionDivider;
		if ((numPredictions >= minimumPredictions) && ((Math.abs(sum)) >= sumReq)) {
			let godlycolor = "white";
			window.learner[name].Sums[window.learner[name].ID] >= 1 ? godlycolor = "Yellow;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 2 ? godlycolor = "GreenYellow;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 4 ? godlycolor = "YellowGreen;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 8 ? godlycolor = "Lime;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -1 ? godlycolor = "Yellow;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -2 ? godlycolor = "Orange;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -4 ? godlycolor = "OrangeRed;font-weight:Normal;font-style: normal" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -8 ? godlycolor = "Crimson;font-weight:Normal;font-style: normal" : null;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID])? godlycolor += ";font-style: italic;font-weight:Normal" : null;
			(window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? godlycolor += ";font-style: italic;font-weight:Normal" : null;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID] && window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? godlycolor += ";font-style: italic;font-weight:Bold" : null;
			
			let displayNameA=(name.replace('Gen','G').replace(/_/g,'').replace('medians','Mds').replace('Medians','Mds').replace('Median','Md').replace('median','Md').replace('PSum','Ps').replace('Psum','Ps').replace('psum','Ps').replace('quad','Q').replace('gt','>').replace('lt','<').replace('Wins','Ws').replace('Losses','Ls').replace('Winning','W').replace('Losing','L').replace('Won','W').replace('Lost','L').replace('Lose','L').replace('Increasing','^').replace('Rising','^').replace('Accel','Acl').replace('Win','W').replace('Loss','L').replace('Streak','Sk').replace('Curr','Cur').replace('Count','#').replace('eq','=').replace('med','Md').replace('meds','Md').replace('Med','Md').replace('Meds','Md'));
			let slicedN=name.split('_');
			let displayNameB=displayNameA.slice(0,2);
			for (var s=1;s<slicedN.length;s++){
			   displayNameB+=slicedN[s].slice(0,4);
			}
			let displayNameC=(displayNameA.slice(0,2))+'_'+(name.slice(Math.floor(name.length/3),Math.floor(name.length/3)+6))+'_'+(displayNameA.slice(-4));
			let useDname=name;
			
			if (name.length<=14){
				useDname=name;
			} else if (displayNameA.length<=14){
				useDname=displayNameA;
			} else if (displayNameB.length<=14){
				useDname=displayNameB;
			} else {
				useDname=displayNameC;
			}
			useDname=name;
			let spacing1=((' ').repeat(1));
			console.log(`%c${useDname}${spacing1}#${window.learner[name].ID} ≼ 2x ${(((window.learner[name].Outcomes[window.learner[name].ID])/(window.learner[name].Predictions[window.learner[name].ID]))*100).toFixed(1)}% ~ (FY/FZ: ${(window.learner[name].fuzzy).toFixed(2)}/${(window.learner[name].Fuzz[window.learner[name].ID]).toFixed(2)}) ~ (Yup/Nope(Tot:Max): ${window.learner[name].CorrectCount[window.learner[name].ID]} (${window.learner[name].CorrectTotal[window.learner[name].ID]}:${window.learner[name].CorrectMax[window.learner[name].ID]}) / ${window.learner[name].IncorrectCount[window.learner[name].ID]} (${window.learner[name].IncorrectTotal[window.learner[name].ID]}:${window.learner[name].IncorrectMax[window.learner[name].ID]})) (SUM: ${window.learner[name].Sums[window.learner[name].ID]}) (CSUM: ${window.learner[name].CorrectedSums[window.learner[name].ID]}) (TSUM: ${window.learner[name].TotalSums[window.learner[name].ID]}) `, 'color:' + godlycolor);
		}

	}
	console.groupEnd(window.learner.learners.length + ' 2x Learners');
}

window.learner.getAllTotals = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001, dontCountNPercWrong=1.09) {
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	window.learner.setAllTotalsAndAverages(minimumPredictions,minimumSumPercentOfPred,dontCountNPercWrong);
	return window.learner.total
}

window.learner.getAllAverages = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001, dontCountNPercWrong=1.09) {
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	window.learner.setAllTotalsAndAverages(minimumPredictions,minimumSumPercentOfPred,dontCountNPercWrong);;
	return window.learner.average
}

window.learner.setAllTotalsAndAverages=function(minimumPredictions = 2, minimumSumPercentOfPred = 0.0001, dontCountNPercWrong=1.09){
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	window.learner.average.CorrectCount=0;
	window.learner.average.CorrectedSums=0;
	window.learner.average.CorrectMax=0;
	window.learner.average.CorrectTotal=0;
	window.learner.average.PercentTrue=0;
	window.learner.average.Fuzz=0;
	window.learner.average.Fuzzy=0;
	window.learner.average.FuzzyFuzz=0;
	window.learner.average.Outcomes=0;
	window.learner.average.Predictions=0;
	window.learner.average.Sums=0;
	
	window.learner.average.TotalSums=0;
	
	window.learner.total.TotalSums=0;
	window.learner.total.CorrectCount=0;
	window.learner.total.CorrectedSums=0;
	window.learner.total.CorrectMax=0;
	window.learner.total.CorrectTotal=0;
	window.learner.total.PercentTrue=0;
	window.learner.total.Fuzz=0;
	window.learner.total.Fuzzy=0;
	window.learner.total.FuzzyFuzz=0;
	window.learner.total.Outcomes=0;
	window.learner.total.Predictions=0;
	window.learner.total.Sums=0;

	window.learner.total.PercentTrue=0;
	window.learner.average.PercentTrue=0;
	window.learner.total.curYups=0;
	window.learner.total.curNopes=0;
	window.learner.average.curYups=0;
	window.learner.average.curNopes=0;
	
	window.learner.total.maxYups=0;
	window.learner.total.maxNopes=0;
	window.learner.average.maxYups=0;
	window.learner.average.maxNopes=0;
	
	window.learner.total.totYups=0;
	window.learner.total.totNopes=0;
	window.learner.average.totYups=0;
	window.learner.average.totNopes=0;
	let totalLearnersUsed=0;
	let totalPositiveSumLearners=0;
	let totalPositiveTSumLearners=0;
	let totalPositiveCSumLearners=0;
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let N=window.learner.learners[i];
		let name=window.learner.learners[i];
		
		if ((dontCountNPercWrong>0 && ((window.learner[name].current.totNopes/window.learner[name].current.totYups)>=dontCountNPercWrong)) || (eval(window.learner[N].REQEVAL)==false) || (window.learner[N].ID == null) || (crashes.history.length < window.learner[N].HistoryRequired) || (player.numGamesPlayed < window.learner[N].GamesPlayedRequired)) {
			continue
		}

		let numPredictions = window.learner[N].current.Predictions;
		let sum = window.learner[N].current.Sum;
		let sumReq = numPredictions / predictionDivider;
		if ((numPredictions >= minimumPredictions) && ((Math.abs(sum)) >= sumReq)) {
			totalLearnersUsed++
			window.learner[N].current.Sum>=1?totalPositiveSumLearners++:null;
			window.learner[N].current.CorrectedSums>=1?totalPositiveCSumLearners++:null;
			window.learner[N].current.TotalSums>=1?totalPositiveTSumLearners++:null;
			
			window.isNaN(parseInt(window.learner[N].current.CorrectCount))==false?window.learner.total.CorrectCount+=parseInt(window.learner[N].current.CorrectCount):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectedSums))==false?window.learner.total.CorrectedSums+=parseInt(window.learner[N].current.CorrectedSums):null;
			window.isNaN(parseFloat(window.learner[N].current.TotalSums))==false?window.learner.total.TotalSums+=parseFloat(window.learner[N].current.TotalSums):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectMax))==false?window.learner.total.CorrectMax+=parseInt(window.learner[N].current.CorrectMax):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectTotal))==false?window.learner.total.CorrectTotal+=parseInt(window.learner[N].current.CorrectTotal):null;
			window.isNaN(parseFloat(window.learner[N].current.PercentTrue))==false?window.learner.total.PercentTrue+=parseFloat(window.learner[N].current.PercentTrue):null;
			window.isNaN(parseFloat(window.learner[N].current.Fuzz))==false?window.learner.total.Fuzz+=parseFloat(window.learner[N].current.Fuzz):null;
			window.isNaN(parseFloat(window.learner[N].current.Fuzzy))==false?window.learner.total.Fuzzy+=parseFloat(window.learner[N].current.Fuzzy):null;
			window.isNaN(parseFloat(window.learner[N].current.FuzzyFuzz))==false?window.learner.total.FuzzyFuzz+=parseFloat(window.learner[N].current.FuzzyFuzz):null;
			window.isNaN(parseInt(window.learner[N].current.Outcomes))==false?window.learner.total.Outcomes+=parseInt(window.learner[N].current.Outcomes):null;
			window.isNaN(parseInt(window.learner[N].current.Predictions))==false?window.learner.total.Predictions+=parseInt(window.learner[N].current.Predictions):null;
			window.isNaN(parseInt(window.learner[N].current.Sum))==false?window.learner.total.Sums+=parseInt(window.learner[N].current.Sum):null;
			window.isNaN(parseInt(window.learner[N].current.curYups))==false?window.learner.total.curYups+=parseInt(window.learner[N].current.curYups):null;
			window.isNaN(parseInt(window.learner[N].current.curNopes))==false?window.learner.total.curNopes+=parseInt(window.learner[N].current.curNopes):null;
			window.isNaN(parseInt(window.learner[N].current.totYups))==false?window.learner.total.totYups+=parseInt(window.learner[N].current.totYups):null;
			window.isNaN(parseInt(window.learner[N].current.totNopes))==false?window.learner.total.totNopes+=parseInt(window.learner[N].current.totNopes):null;
			window.isNaN(parseInt(window.learner[N].current.maxYups))==false?window.learner.total.maxYups+=parseInt(window.learner[N].current.maxYups):null;
			window.isNaN(parseInt(window.learner[N].current.maxNopes))==false?window.learner.total.maxNopes+=parseInt(window.learner[N].current.maxNopes):null;
			
		}
	}
	window.learner.total.PositiveSumLearners=totalPositiveSumLearners;
	window.learner.total.PositiveCSumLearners=totalPositiveCSumLearners;
	window.learner.total.PositiveTSumLearners=totalPositiveTSumLearners;
	window.learner.total.learnersUsed=totalLearnersUsed;
	window.learner.total.NegativeSumLearners=(totalLearnersUsed-totalPositiveSumLearners);
	window.learner.total.NegativeCSumLearners=(totalLearnersUsed-totalPositiveCSumLearners);;
	window.learner.total.NegativeTSumLearners=(totalLearnersUsed-totalPositiveTSumLearners);;
	window.learner.total.learners=window.learner.learners.length;
	
	window.learner.average.CorrectCount=(window.learner.total.CorrectCount/totalLearnersUsed);
	window.learner.average.CorrectedSums=(window.learner.total.CorrectedSums/totalLearnersUsed);
	window.learner.average.TotalSums=(window.learner.total.TotalSums/totalLearnersUsed);
	window.learner.average.CorrectMax=(window.learner.total.CorrectMax/totalLearnersUsed);
	window.learner.average.CorrectTotal=(window.learner.total.CorrectTotal/totalLearnersUsed);
	window.learner.average.PercentTrue=(window.learner.total.PercentTrue/totalLearnersUsed);
	window.learner.average.Fuzz=(window.learner.total.Fuzz/totalLearnersUsed);
	window.learner.average.Fuzzy=(window.learner.total.Fuzzy/totalLearnersUsed);
	window.learner.average.FuzzyFuzz=(window.learner.total.FuzzyFuzz/totalLearnersUsed);
	window.learner.average.Outcomes=(window.learner.total.Outcomes/totalLearnersUsed);
	window.learner.average.Predictions=(window.learner.total.Predictions/totalLearnersUsed);
	window.learner.average.Sums=(window.learner.total.Sums/totalLearnersUsed);
	window.learner.average.PercentTrue=(window.learner.total.PercentTrue/totalLearnersUsed);
	
	window.learner.average.curYups=(window.learner.total.curYups/totalLearnersUsed);
	window.learner.average.curNopes=(window.learner.total.curNopes/totalLearnersUsed);
	window.learner.average.totYups=(window.learner.total.totYups/totalLearnersUsed);
	window.learner.average.totNopes=(window.learner.total.totNopes/totalLearnersUsed);
	window.learner.average.maxYups=(window.learner.total.maxYups/totalLearnersUsed);
	window.learner.average.maxNopes=(window.learner.total.maxNopes/totalLearnersUsed);
	
			
}

//return number of learners with the minimum predictions/sum
window.learner.getNLearners = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001, dontCountNPercWrong=1.09) {
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	let SumSum = 0;
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		let N=name;
		if ((dontCountNPercWrong>0 && ((window.learner[name].current.totNopes/window.learner[name].current.totYups)>=dontCountNPercWrong)) || (eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID] == "undefined" ? window.learner[name].Outcomes[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Predictions[window.learner[name].ID] == "undefined" ? window.learner[name].Predictions[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Sums[window.learner[name].ID] == "undefined" ? window.learner[name].Sums[window.learner[name].ID] = 0 : null;
		let numPredictions = window.learner[name].Predictions[window.learner[name].ID];
		let sum = window.learner[name].Sums[window.learner[name].ID];
		let sumReq = numPredictions / predictionDivider;
		if ((numPredictions >= minimumPredictions) && ((Math.abs(sum)) >= sumReq)) {
			SumSum++
		}
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return SumSum
}

//returns an array of learner names with the minimum predictions/sum
window.learner.getLearnerNames = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001, dontCountNPercWrong=1.09) {
	if (window.learner.maxWrong>0){
		dontCountNPercWrong=window.learner.maxWrong;
	}
	let LNames = [];
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		let N=name;
		if ((dontCountNPercWrong>0 && ((window.learner[name].current.totNopes/window.learner[name].current.totYups)>=dontCountNPercWrong)) || (eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID] == "undefined" ? window.learner[name].Outcomes[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Predictions[window.learner[name].ID] == "undefined" ? window.learner[name].Predictions[window.learner[name].ID] = 0 : null;
		typeof window.learner[name].Sums[window.learner[name].ID] == "undefined" ? window.learner[name].Sums[window.learner[name].ID] = 0 : null;
		let numPredictions = window.learner[name].Predictions[window.learner[name].ID];
		let sum = window.learner[name].Sums[window.learner[name].ID];
		let sumReq = numPredictions / predictionDivider;
		if ((numPredictions >= minimumPredictions) && ((Math.abs(sum)) >= sumReq)) {
			LNames.push(name);
		}
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return LNames
}


window.learner.setAllID = function () {
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		window.learner[name].ID = window.learner.get_ID(name);
	}
	window.learner.setActualPredictions();
}
// setActualPredictions is ran automatically after setAllID (as that is what is needed for a prediction)
window.learner.setActualPredictions = function () {
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		let PID=window.learner[name].ID;
		let sum=window.learner[name].Sums[PID];
		if (sum<0){
			window.learner[name].ActualPredictions[PID]=false;
		} else {
			window.learner[name].ActualPredictions[PID]=true;
		}
	}
}

// resets all Fuzz for all learners and all their patterns (Fuzz and fuzzy)
window.learner.resetAllFuzz = function () {
	var tempnames = window.learner.getLearnerNames();
	var temptotal = 0;

	for (var i = 0; i < tempnames.length; i++) {
		let name = tempnames[i];
		window.learner[name].current.Fuzz = 0.5;
		window.learner[name].current.Fuzzy = 0.5;
		window.learner[name].current.FuzzyFuzz = 0.5;
		window.learner[name].fuzzy = 0.5;
		for (var ii = 0; ii < window.learner[name].Fuzz.length; ii++) {
			window.learner[name].Fuzz[ii] = 0.5;
		}
	}
}


window.learner.displayCurrentData = function(){
	let learnerNames = learner.getLearnerNames();
	for (var ln in learnerNames){
		console.log(`Current Data For ${learnerNames[ln]}:
					${JSON.stringify(window.learner[learnerNames[ln]].current)}`)
	}
}
window.learner.displayPreviousData = function(){
	let learnerNames = learner.getLearnerNames();
	for (var ln in learnerNames){
		console.log(`Current Data For ${learnerNames[ln]}:
					${JSON.stringify(window.learner[learnerNames[ln]].previous)}`)
	}
}


// Finds all learner combinations whos binary pattern will be 8 or less bits when combined, these are all combination possibilities for "2nd evolution" learners
window.learner.findAll_suitableSisters = function (maxLength = 8, outputToConsole = true) {
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		if ((eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
			continue
		}
		let patternLength = window.learner.get_Pattern(name).replace('0b', '').length;
		window.learner[name].patternLength = patternLength;
		if (patternLength <= (maxLength - 2)) {
			window.learner[name].suitableSisterLength = (maxLength - patternLength);
		} else {
			window.learner[name].suitableSisterLength = 0;
		}
		outputToConsole == true ? console.log(name + ' suitable sis length: ' + window.learner[name].suitableSisterLength) : null;
		for (var ii = 0; ii < window.learner.learners.length; ii++) {
			let name2 = window.learner.learners[ii];
			if ((eval(window.learner[name2].REQEVAL)==false) || (window.learner[name2].ID == null) || (crashes.history.length < window.learner[name2].HistoryRequired) || (player.numGamesPlayed < window.learner[name2].GamesPlayedRequired)) {
				continue
			}
			if ((name2 != name) && (!name2.includes(name.slice(0, 5))) && (name2.slice(0, 5) != name.slice(0, 5)) && window.learner[name2].patternLength <= window.learner[name].suitableSisterLength) {
				outputToConsole == true ? console.log(' ~~~ ' + name2 + ' is a suitable sister for ' + name) : null;
			}

		}
	}
}
// Finds learner combinations for specific learner
// finds sisters whos binary pattern will be 8 or less bits when combined, these are all combination possibilities for "2nd evolution" learners
window.learner.find_suitableSisters = function (learnerName = null, maxLength = 8, outputToConsole = false) {
	if (learnerName == null) {
		console.log('find_suitableSisters needs a learner name')
		return false
	}
	let name = learnerName;
	if ((eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
		return false;
	}
	let patternLength = window.learner.get_Pattern(name).replace('0b', '').length;
	window.learner[name].patternLength = patternLength;
	if (patternLength <= (maxLength - 2)) {
		window.learner[name].suitableSisterLength = (maxLength - patternLength);
	} else {
		window.learner[name].suitableSisterLength = 0;
	}
	let suitableNames = [];
	outputToConsole == true ? console.log(name + ' suitable sis length: ' + window.learner[name].suitableSisterLength) : null;
	for (var ii = 0; ii < window.learner.learners.length; ii++) {
		let name2 = window.learner.learners[ii];
		if ((eval(window.learner[name2].REQEVAL)==false) || (window.learner[name2].ID == null) || (crashes.history.length < window.learner[name2].HistoryRequired) || (player.numGamesPlayed < window.learner[name2].GamesPlayedRequired)) {
			continue
		}
		if ((name2 != name) && (!name2.includes(name.slice(0, 5))) && (name2.slice(0, 5) != name.slice(0, 5)) && window.learner[name2].patternLength <= window.learner[name].suitableSisterLength) {

			outputToConsole == true ? console.log(' ~~~ ' + name2 + ' is a suitable sister for ' + name) : null;
			suitableNames.push(name2)
		}

	}
	return suitableNames
}

// Prints a javascript representation of the learners, to copy and paste into a hard copy of the script
// Also good for sharing learners between browser profiles/bot accounts
window.learner.exportLearnersAsJavascript = function () {
	let consoleString = '';
	console.log(`PASTE THE FOLLOWING CODE INTO YOUR SCRIPT FOR A HARD COPY OF THE DATA:`);
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		window.learner[name].ID = window.learner.get_ID(name);
		consoleString = consoleString + (`\n\nlearner["${name}"]=${(JSON.stringify(learner[name]))};\nlearner.learners.push("${name}");`);
	}
	console.log(`${consoleString}`);

}

window.learner.saveLearnersToLocalStorage = function () {
	if (localStorage) {
		localStorage.learner = JSON.stringify(window.learner);

		return true
	}
	return false
}

window.learner.loadLearnersFromLocalStorage = function () {
	if (localStorage) {
		if (localStorage.learner) {
			if (localStorage.learner.length > 128) {
				window.learner = JSON.parse(localStorage.learner);
				return true
			}
		}
	}
	return false
}

// ENGINE.ON TRIGGER HANDLERS FOR LEARNER

window.learner.on_game_starting = function(data=null){
	
	// Load full learner data from local storage if available
	if (window.learner.loadAttempted==false && window.learner.loaded!=true) {
		window.learner.loadAttempted=true;
		window.learner.loaded = window.learner.loadLearnersFromLocalStorage();
		if (!window.learner.loaded) {
			console.log('Couldnt load learners from local storage');
		}
	}if (crashes.history.length >= 70) {
		tools.medianCrunch();
	}

	
	/**/
}

//  A often used function for the learner strats
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

// Strategies built around the 2x pattern learner
window.learner.strategy=[];

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




