
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

window.learner.total.currentPercentTrue=0;
window.learner.average.currentPercentTrue=0;

/*	Version 3 Additions (work in progress)
Questions and Variables! 
are to help create more patterns, but should be programmed in such a way that a simple ai could create questions from variables and then patterns from questions */
// Questions should be any useful statement than evaluates to true or false, combining these into a binary string creates the basis for a new learner 
window.learner.questions={};
// Variables should be any usefule variable we can make into a comparison statement, using either a static number or another variable. The resulting statement can be used to create a question
window.learner.variables={};
// Anything based on game history medians
window.learner.questions.median=[];
window.learner.variables.median=[];
// Anything calculated with crashes.probsum() (a custom created probability sum of the game history, a different kind of median)
window.learner.questions.psum=[];
window.learner.variables.psum=[];
// Anything stored in the profile class, such as win loss streaks, bankrolls, balance histories, etc
window.learner.questions.player=[];
window.learner.variables.player=[];
// Anything related to players other than ourselves, likely will be confined to identities class (players.known['user_'+username].....)
window.learner.questions.players=[];
window.learner.variables.players=[];
// Anything related to the last games basic data and outcome, stored in the match class, such as players joined, players won, lost, amount bet, max bet, highest bet etc etc.
window.learner.questions.lastgame=[];
window.learner.variables.lastgame=[];


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
		
		let numOutcomes = window.learner[name].Outcomes[learnerID];
		let sum = window.learner[name].Sums[learnerID];
		
		let numPredictions = window.learner[name].Predictions[learnerID];
		let fuzzOP=(numOutcomes/numPredictions);
		window.learner[name].current.Sum = sum;

		if (window.learner[name].Predictions[learnerID] == null) {
			continue
		}
		
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
				window.learner[name].Fuzz[learnerID] = ((window.learner[name].Fuzz[learnerID]+0.999)/2);
				
				window.learner[name].fuzzy = ((window.learner[name].fuzzy+0.999)/2);
				
				window.learner[name].fuzzy = (((fuzzOP)+window.learner[name].Fuzz[learnerID] + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + window.learner[name].fuzzy + window.learner[name].fuzzy + 0.999 + (2 * (window.learner[name].fuzzy / 2))) / 10);
				window.learner[name].Fuzz[learnerID] = (((fuzzOP)+window.learner[name].fuzzy + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + window.learner[name].Fuzz[learnerID] + window.learner[name].Fuzz[learnerID] + 0.999 + (2 * (window.learner[name].Fuzz[learnerID] / 2))) / 10);
				window.learner[name].Sums[learnerID]++
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
				window.learner[name].Fuzz[learnerID] = ((window.learner[name].Fuzz[learnerID]+0.001)/2);
				window.learner[name].fuzzy = ((window.learner[name].fuzzy+0.001)/2);
				window.learner[name].fuzzy = (((fuzzOP)+(window.learner[name].Fuzz[learnerID]) + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + (window.learner[name].fuzzy) + (window.learner[name].fuzzy) + (0.001) + (0.334 * (window.learner[name].fuzzy / 2))) / 10);
				window.learner[name].Fuzz[learnerID] = (((fuzzOP)+window.learner[name].fuzzy + (((crashes.probSum(1) / 2) + 0.5)) + ((crashes.probSum(1,1) / 2) + 0.5) + ((crashes.probSum(1,2) / 2) + 0.5) + ((crashes.probSum(1,3) / 2) + 0.5) + window.learner[name].Fuzz[learnerID] + window.learner[name].Fuzz[learnerID] + 0.001 + (0.334 * (window.learner[name].Fuzz[learnerID] / 2))) / 10);
				window.learner[name].Sums[learnerID]--
			}
			if (window.isNaN(window.learner[name].fuzzy)==true) {
				window.learner[name].fuzzy = 0.5;
			}
			if (window.isNaN(window.learner[name].Fuzz[learnerID])==true) {
				window.learner[name].Fuzz[learnerID] = 0.5;
			}
			window.learner[name].Predictions[learnerID]++;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID])? window.learner[name].SelfCorrectFromMax[window.learner[name].ID] = window.learner[name].IncorrectMax[window.learner[name].ID]-window.learner[name].CorrectMax[window.learner[name].ID]: null;
			(window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? window.learner[name].SelfCorrectFromTotal[window.learner[name].ID] = window.learner[name].IncorrectTotal[window.learner[name].ID]-window.learner[name].CorrectTotal[window.learner[name].ID]: null;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID] && window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? window.learner[name].SelfCorrectFromBoth[window.learner[name].ID] = ((window.learner[name].IncorrectTotal[window.learner[name].ID]-window.learner[name].CorrectTotal[window.learner[name].ID])+(window.learner[name].IncorrectMax[window.learner[name].ID]-window.learner[name].CorrectMax[window.learner[name].ID])) : null;


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
		
		window.learner[name].current = {};
		// Update variables from current pattern
		window.learner[name].current.CorrectedSums = parseFloat(window.learner[name].CorrectedSums[learnerID]);
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

window.learner.getAllTotals = function () {
	window.learner.setAllTotalsAndAverages();
	return window.learner.total
}

window.learner.getAllAverages = function () {
	window.learner.setAllTotalsAndAverages();
	return window.learner.average
}

window.learner.setAllTotalsAndAverages=function(minimumPredictions = 2, minimumSumPercentOfPred = 0.0001){

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
		
	let totalLearnersUsed=0;
	let totalPositiveSumLearners=0;
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let N=window.learner.learners[i];
		if ((eval(window.learner[N].REQEVAL)==false) || (window.learner[N].ID == null) || (crashes.history.length < window.learner[N].HistoryRequired) || (player.numGamesPlayed < window.learner[N].GamesPlayedRequired)) {
			continue
		}

		let numPredictions = window.learner[N].current.Predictions;
		let sum = window.learner[N].current.Sum;
		let sumReq = numPredictions / predictionDivider;
		if ((numPredictions >= minimumPredictions) && ((Math.abs(sum)) >= sumReq)) {
			totalLearnersUsed++
			window.learner[N].current.Sum>=0?totalPositiveSumLearners++:null;
			window.isNaN(parseInt(window.learner[N].current.CorrectCount))==false?window.learner.total.CorrectCount+=parseInt(window.learner[N].current.CorrectCount):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectedSums))==false?window.learner.total.CorrectedSums+=parseInt(window.learner[N].current.CorrectedSums):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectMax))==false?window.learner.total.CorrectMax+=parseInt(window.learner[N].current.CorrectMax):null;
			window.isNaN(parseInt(window.learner[N].current.CorrectTotal))==false?window.learner.total.CorrectTotal+=parseInt(window.learner[N].current.CorrectTotal):null;
			window.isNaN(parseFloat(window.learner[N].current.PercentTrue))==false?window.learner.total.PercentTrue+=parseFloat(window.learner[N].current.PercentTrue):null;
			window.isNaN(parseFloat(window.learner[N].current.Fuzz))==false?window.learner.total.Fuzz+=parseFloat(window.learner[N].current.Fuzz):null;
			window.isNaN(parseFloat(window.learner[N].current.Fuzzy))==false?window.learner.total.Fuzzy+=parseFloat(window.learner[N].current.Fuzzy):null;
			window.isNaN(parseFloat(window.learner[N].current.FuzzyFuzz))==false?window.learner.total.FuzzyFuzz+=parseFloat(window.learner[N].current.FuzzyFuzz):null;
			window.isNaN(parseInt(window.learner[N].current.Outcomes))==false?window.learner.total.Outcomes+=parseInt(window.learner[N].current.Outcomes):null;
			window.isNaN(parseInt(window.learner[N].current.Predictions))==false?window.learner.total.Predictions+=parseInt(window.learner[N].current.Predictions):null;
			window.isNaN(parseInt(window.learner[N].current.Sum))==false?window.learner.total.Sums+=parseInt(window.learner[N].current.Sum):null;
		}
	}
	window.learner.total.PositiveSumLearners=totalPositiveSumLearners;
	window.learner.total.learnersUsed=totalLearnersUsed;
	window.learner.total.NegativeSumLearners=(totalLearnersUsed-totalPositiveSumLearners);
	window.learner.total.learners=window.learner.learners.length;
	
	window.learner.average.CorrectCount=(window.learner.total.CorrectCount/totalLearnersUsed);
	window.learner.average.CorrectedSums=(window.learner.total.CorrectedSums/totalLearnersUsed);
	window.learner.average.CorrectMax=(window.learner.total.CorrectMax/totalLearnersUsed);
	window.learner.average.CorrectTotal=(window.learner.total.CorrectTotal/totalLearnersUsed);
	window.learner.average.PercentTrue=(window.learner.total.PercentTrue/totalLearnersUsed);
	window.learner.average.Fuzz=(window.learner.total.Fuzz/totalLearnersUsed);
	window.learner.average.Fuzzy=(window.learner.total.Fuzzy/totalLearnersUsed);
	window.learner.average.FuzzyFuzz=(window.learner.total.FuzzyFuzz/totalLearnersUsed);
	window.learner.average.Outcomes=(window.learner.total.Outcomes/totalLearnersUsed);
	window.learner.average.Predictions=(window.learner.total.Predictions/totalLearnersUsed);
	window.learner.average.Sums=(window.learner.total.Sums/totalLearnersUsed);
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

//return number of learners with the minimum predictions/sum
window.learner.getNLearners = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001) {
	let SumSum = 0;
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		
		if ((eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
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
window.learner.getLearnerNames = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001) {
	let LNames = [];
	let predictionDivider = 1 / minimumSumPercentOfPred;
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		
		if ((eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
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


// Logs the stats for current learner patterns to the console, if they have at least [minimumPredictions] and the sum must be 1% or more of the predictions, else it is likely to not be a good predictor
window.learner.displayCurrentIDStats = function (minimumPredictions = 2, minimumSumPercentOfPred = 0.0001) {
	let predictionDivider = 1 / minimumSumPercentOfPred;
	console.group(window.learner.learners.length + ' 2x Learners');
	for (var i = 0; i < window.learner.learners.length; i++) {
		let name = window.learner.learners[i];
		if (window.learner[name].ID == null) {
			continue
		}
		typeof window.learner[name].REQEVAL=="undefined"?window.learner[name].REQEVAL="(1+1==2)":null;
		if ((eval(window.learner[name].REQEVAL)==false) || (window.learner[name].ID == null) || (crashes.history.length < window.learner[name].HistoryRequired) || (player.numGamesPlayed < window.learner[name].GamesPlayedRequired)) {
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
			window.learner[name].Sums[window.learner[name].ID] >= 1 ? godlycolor = "Yellow;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 2 ? godlycolor = "GreenYellow;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 4 ? godlycolor = "YellowGreen;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] >= 8 ? godlycolor = "Lime;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -1 ? godlycolor = "Yellow;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -2 ? godlycolor = "Orange;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -4 ? godlycolor = "OrangeRed;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			window.learner[name].Sums[window.learner[name].ID] <= -8 ? godlycolor = "Crimson;font-weight:Normal;font-style: normal;Background-Color:DarkBlue" : null;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID])? godlycolor += ";Background-Color:Maroon;font-style: italic;font-weight:Normal" : null;
			(window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? godlycolor += ";Background-Color:Maroon;font-style: italic;font-weight:Normal" : null;
			(window.learner[name].IncorrectMax[window.learner[name].ID] >window.learner[name].CorrectMax[window.learner[name].ID] && window.learner[name].IncorrectTotal[window.learner[name].ID] >window.learner[name].CorrectTotal[window.learner[name].ID])? godlycolor += ";Background-Color:Maroon;font-style: italic;font-weight:Bold" : null;
			
			let displayNameA=(name.replace('Gen','G').replace(/_/g,'').replace('medians','Mds').replace('Medians','Mds').replace('Median','Md').replace('median','Md').replace('PSum','Ps').replace('Psum','Ps').replace('psum','Ps').replace('quad','Q').replace('gt','>').replace('lt','<').replace('Wins','Ws').replace('Losses','Ls').replace('Winning','W').replace('Losing','L').replace('Won','W').replace('Lost','L').replace('Lose','L').replace('Increasing','^').replace('Rising','^').replace('Accel','Acl').replace('Win','W').replace('Loss','L').replace('Streak','Sk').replace('Curr','Cur').replace('Count','#').replace('eq','=').replace('med','Md').replace('meds','Md').replace('Med','Md').replace('Meds','Md'));
			let slicedN=name.split('_');
			let displayNameB=displayNameA.slice(0,2);
			for (var s=1;s<slicedN.length;s++){
			   displayNameB+=slicedN[s].slice(0,4);
			}
			let displayNameC=(displayNameA.slice(0,2))+'_'+(name.slice(Math.floor(name.length/3),Math.floor(name.length/3)+6))+'_'+(displayNameA.slice(-4));
			let useDname=name;
			
			if (name.length==14){
				useDname=name;
			} else if (displayNameA.length<=14){
				useDname=displayNameA;
			} else if (displayNameB.length<=14){
				useDname=displayNameB;
			} else {
				useDname=displayNameC;
			}
			let spacing1=((' ').repeat((1+(14-useDname.length))));
			console.log(`%c${useDname}${spacing1}#${window.learner[name].ID} PRECEDED 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} (SUM: ${window.learner[name].Sums[window.learner[name].ID]}) ~ (FY/FZ: ${(window.learner[name].fuzzy).toFixed(2)}/${(window.learner[name].Fuzz[window.learner[name].ID]).toFixed(2)}) ~ (C(T:M)/I(T:M): ${window.learner[name].CorrectCount[window.learner[name].ID]} (${window.learner[name].CorrectTotal[window.learner[name].ID]} : ${window.learner[name].CorrectMax[window.learner[name].ID]}) / ${window.learner[name].IncorrectCount[window.learner[name].ID]} (${window.learner[name].IncorrectTotal[window.learner[name].ID]} : ${window.learner[name].IncorrectMax[window.learner[name].ID]}))`, 'color:' + godlycolor);
		}

	}
	console.groupEnd(window.learner.learners.length + ' 2x Learners');
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
		continue
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
window.learner.on_game_starting = function(){
	// Load full learner data from local storage if available
	if (window.learner.loadAttempted==false && window.learner.loaded!=true) {
		window.learner.loadAttempted=true;
		window.learner.loaded = window.learner.loadLearnersFromLocalStorage();
		if (!window.learner.loaded) {
			console.log('Couldnt load learners from local storage');
		}
	}
	// getAllOutcomes: 
	//		- Updates learner data based on where the game just crashed, fuzzes, sums, totals, etc.
	// 		- Sets window.learner[learnerName].current and .previous variables for all active learners - the result comes from that learners current pattern
	window.learner.getAllOutcomes();
	// setAllTotalsAndAverages:
	//		- This will set window.learner.total and window.learner.average amounts, done after getting outcomes and before setting the new ID/Pattern
	window.learner.setAllTotalsAndAverages();
	// Save full learner object to local storage stringified
	window.learner.saveLearnersToLocalStorage();
	// Set the binary ID's the learners will use for the upcoming game, GET OUTCOMES FIRST!
	window.learner.setAllID();
	
}
window.learner.on_game_started = function(){
	
}
window.learner.on_game_crash = function(){
	
}
window.learner.on_cashed_out = function(){
	
}
window.learner.on_player_bet = function(){
	
}

// Strategies built around the 2x pattern learner
window.learner.strategy=[];

window.learner.strategy[0]=function(){
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
	window.learner.displayCurrentIDStats();
	let SumSum = window.learner.total.Sums;
	let nPositive = window.learner.total.PositiveSumLearners;
	let nTotal = window.learner.total.learnersUsed;
	let learnerNames = window.learner.getLearnerNames();
	
	
	// Total modifier float
	
	// This is the outcome/prediction percentage * 2, added for all learners to a total 
	let totalPercent = window.learner.total.PercentTrue;
	let totalFuzz = window.learner.total.Fuzz;
	let totalFuzzy = window.learner.total.Fuzzy;
	let avgFuzz = window.learner.average.Fuzz;
	let avgFuzzy = window.learner.average.Fuzzy;
	// Average modifier float, 0-2 - This is the outcome/prediction percentage * 2
	let averagePercent = window.learner.average.PercentTrue;
	averagePercent*=2;totalPercent*=2;
	let totalPatterns = window.learner.getAll_numPossiblePatterns();
	// learners with a positive sum, as a percentage
	let percentPositive = (nPositive/nTotal);
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
	
	return {
		'amount': (GODLY.BET),
		'multiplier': GODLY.MULTIPLIER
	};
	
}

