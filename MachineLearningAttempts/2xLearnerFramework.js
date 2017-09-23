// NOTICE: This file will not work without the full gambletron script (private until release)
//         However, you are free to muscle it into whatever script you currently use 
//         No support will be given, you are on your own if you want to mess with this


// window.learner: First Machine Learning Prototype to learn 2x patterns
// 2 learners included by default "patternRVG8" and "pattern3Quads5"
// New learners are added via learner.newLearner([LearnerName],[EvalStringAs'0b'+binaryString],[numHistoryRequired],[numGamesPlayedRequired]);
// Learners keep track of the game outcome after the pattern of that learner
// Games over 2x add +1 to the sum of learner patterns that preceded it, under 2x subtracts 1 from sum
// 

window.learner={}
window.learner.learners=['patternRVG8','pattern3Quads5'];
window.learner.patternRVG8={};
window.learner.patternRVG8.ID=0;
window.learner.patternRVG8.Outcomes=[];
window.learner.patternRVG8.Predictions=[];
window.learner.patternRVG8.Sums=[];
window.learner.patternRVG8.IDEVAL="('0b'+crashes.getRVGBinaryString(8))";
window.learner.patternRVG8.HistoryRequired=9;
window.learner.patternRVG8.GamesPlayedRequired=0;

window.learner.pattern3Quads5={};
window.learner.pattern3Quads5.ID=0;
window.learner.pattern3Quads5.Outcomes=[];
window.learner.pattern3Quads5.Predictions=[];
window.learner.pattern3Quads5.Sums=[];
window.learner.pattern3Quads5.IDEVAL="('0b'+(((crashes.getRVGSum(5)>=3)+0)+''+((crashes.getRVGSum(5,5)>=3)+0)+''+((crashes.getRVGSum(5,10)>=3)+0)))";
window.learner.pattern3Quads5.HistoryRequired=16;
window.learner.pattern3Quads5.GamesPlayedRequired=0;


// Example, eval should be a string: IDEVAL="('0b'+crashes.getRVGBinaryString(8))"
// function then does eval(eval("('0b'+crashes.getRVGBinaryString(8))")) to get an integer ID for the pattern
// FULL EXAMPLE: learner.newLearner("patternRVG4","('0b'+crashes.getRVGBinaryString(4))",5,0);
window.learner.newLearner=function(name=null,IDEVAL=null,RequiresHistory=128,RequiresGamesPlayed=0){
	if (!name){
		return false
	}
	window.learner.learners.push(name);
	window.learner[name]={};
	window.learner[name].ID=null;
	window.learner[name].gameIDAtCreation=game.gameID;
	window.learner[name].timestameAtCreation=Date.now();
	window.learner[name].Name=name;
	window.learner[name].Outcomes=[];
	window.learner[name].Predictions=[];
	window.learner[name].Sums=[];
	window.learner[name].currentSum=null;
	window.learner[name].currentPattern=null;
	window.learner[name].currentOutcomes=null;
	window.learner[name].currentPredictions=null;
	window.learner[name].IDEVAL=IDEVAL;
	window.learner[name].HistoryRequired=RequiresHistory;
	window.learner[name].GamesPlayedRequired=RequiresGamesPlayed;
	
}

window.learner.get_ID=function(thename=null){
	if (thename==null){
		console.log(`get_ID requires the name of the learner`);
		return null
	}
	if (crashes.history.length<window.learner[thename].HistoryRequired){
		//console.log(`Cannot yet get an ID for learner ${name}: ${window.learner[name].HistoryRequired} games required in history.`);
		return null
	}
	if (player.numGamesPlayed<window.learner[thename].GamesPlayedRequired){
		//console.log(`Cannot yet get an ID for learner ${name}: Must play at least ${window.learner[name].GamesPlayedRequired} games.`);
		return null
	}
	if (window.learner[thename].IDEVAL!=null){
		return (eval(eval(window.learner[thename].IDEVAL)))
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return 0
	}
}
	
window.learner.set_ID=function(thename=null){
	if (thename==null){
		console.log(`get_ID requires the name of the learner`);
		return null
	}
	window.learner[thename].ID=window.learner[thename].get_ID(thename);
}
	
window.learner.get_Pattern=function(thename=null){
	if (thename==null){
		console.log(`get_Pattern requires the name of the learner`);
		return null
	}
	if ((crashes.history.length<window.learner[thename].HistoryRequired) || (player.numGamesPlayed<window.learner[thename].GamesPlayedRequired)){
		console.log(`learner ${thename} requires more history or games played to build a pattern`);
		return null
	}
	if (window.learner[thename].IDEVAL!=null){
		return ((eval(window.learner[thename].IDEVAL)).replace('0b',''))
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return null
	}
	return null
}	

window.learner.get_numPossibilities=function(thename=null){
	if (thename==null){
		console.log(`get_numPossibilities requires the name of the learner`);
		return null
	}
	if ((crashes.history.length<window.learner[thename].HistoryRequired) || (player.numGamesPlayed<window.learner[thename].GamesPlayedRequired)){
		console.log(`learner ${thename} requires more history or games played to build a pattern`);
		return null
	}
	if (window.learner[thename].IDEVAL!=null){
		window.learner[thename].possibilities=(2**(((eval(window.learner[thename].IDEVAL)).replace('0b','')).length));
		return window.learner[thename].possibilities
	} else {
		// A custom eval to get the binary id is needed
		console.log(`window.learner[${thename}].IDEVAL needs an evaluation string that evaluates to a binary string that evaluates to an integer ID. Setting ID to 0`);
		return null
	}
	return null
}	

window.learner.getAll_numPossiblePatterns=function(){
	let possi=0; 
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		possi+=window.learner.get_numPossibilities(name);
	}
	window.learner.numPossiblePatterns=possi;
	return (possi)
}

window.learner.getOutcomeFor=function(name=null,multiplier=200,startAt=0){
	if (!name){
		console.log(`getOutcomeFor requires the name of the learner`);
		return null
	}
	if ((crashes.history.length<window.learner[thename].HistoryRequired) || (player.numGamesPlayed<window.learner[thename].GamesPlayedRequired)){
		console.log(`learner ${thename} requires more history or games played to build a pattern/id`);
		return null
	}
	if (window.learner[name].ID==null){
		return null
	}
	
	typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
	typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
	typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
	typeof window.learner[name].HistoryRequired=="undefined"?window.learner[name].HistoryRequired=128:null;
	typeof window.learner[name].GamesPlayedRequired=="undefined"?window.learner[name].GamesPlayedRequired=0:null;

	if ((crashes.history.length>=window.learner[name].HistoryRequired) && (player.numGamesPlayed>=window.learner[name].GamesPlayedRequired)){
		if (crashes.history[startAt]>=multiplier){
			window.learner[name].Sums[window.learner[name].ID]++
			window.learner[name].Outcomes[window.learner[name].ID]++
		} 
		else {
			window.learner[name].Sums[window.learner[name].ID]--
		}
		window.learner[name].Predictions[window.learner[name].ID]++;
	}
	return true
}

window.learner.getAllOutcomes=function(multiplier=200,startAt=0){
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		typeof window.learner[name].Name=="undefined"?window.learner[name].Name=name:null;
		if (window.learner[name].ID==null || (crashes.history.length<window.learner[name].HistoryRequired) || (player.numGamesPlayed<window.learner[name].GamesPlayedRequired)){
			continue
		}
		let learnerID=window.learner[name].ID;
		typeof window.learner[name].Outcomes[learnerID]=="undefined"?window.learner[name].Outcomes[learnerID]=0:null;
		window.learner[name].Outcomes[learnerID]==null?window.learner[name].Outcomes[learnerID]=0:null;
		window.learner[name].Sums[learnerID]==null?window.learner[name].Sums[learnerID]=0:null;
		
		typeof window.learner[name].Predictions[learnerID]=="undefined"?window.learner[name].Predictions[learnerID]=0:null;
		typeof window.learner[name].Sums[learnerID]=="undefined"?window.learner[name].Sums[learnerID]=0:null;
		typeof window.learner[name].HistoryRequired=="undefined"?window.learner[name].HistoryRequired=128:null;
		typeof window.learner[name].GamesPlayedRequired=="undefined"?window.learner[name].GamesPlayedRequired=0:null;
		typeof window.learner[name].gameIDAtCreation=="undefined"?window.learner[name].gameIDAtCreation=game.gameID:null;
		typeof window.learner[name].timestameAtCreation=="undefined"?window.learner[name].timestameAtCreation=Date.now():null;
		
		let numOutcomes=window.learner[name].Outcomes[learnerID];
		let sum=window.learner[name].Sums[learnerID];
		let numPredictions=window.learner[name].Predictions[learnerID];
		window.learner[name].currentSum=sum;
		
		if (window.learner[name].Predictions[learnerID]==null){
			continue
		}
		
		if ((crashes.history.length>=window.learner[name].HistoryRequired) && (player.numGamesPlayed>=window.learner[name].GamesPlayedRequired)){
			if (crashes.history[startAt]>=multiplier){
				window.learner[name].Sums[learnerID]++
				window.learner[name].Outcomes[learnerID]++
			} else {
				window.learner[name].Sums[learnerID]--
			}
			window.learner[name].Predictions[learnerID]++;
			
		}
		window.learner[name].currentSum=window.learner[name].Sums[learnerID];
		window.learner[name].currentPattern=window.learner.get_Pattern(name);
		window.learner[name].currentOutcomes=window.learner[name].Outcomes[learnerID];
		window.learner[name].currentPredictions=window.learner[name].Predictions[learnerID];
		window.learner[name].currentPercentTrue=(window.learner[name].Outcomes[learnerID]/window.learner[name].Predictions[learnerID]);
	}
}

window.learner.displayPercents = function () {
	var tempnames = window.learner.getLearnerNames();
	var temptotal = 0;
	for (var i = 0; i < tempnames.length; i++) {
		let name = tempnames[i];
		if (typeof window.learner[name].currentPercentTrue=="undefined" || window.learner[name].currentPercentTrue==0 || window.learner[name].currentPercentTrue==null){
			continue
		}
		console.log(window.learner[name].currentPercentTrue * 2);
		temptotal += (window.learner[name].currentPercentTrue * 2)
	}
	console.log('total: ' + temptotal + ' avg: ' + (temptotal / tempnames.length))
}

// returns the sum of all learner percents
window.learner.getTotalPercents=function(){
	var tempnames = window.learner.getLearnerNames();
	var temptotal = 0;
	for (var i = 0; i < tempnames.length; i++) {
		let name = tempnames[i];
		if (typeof window.learner[name].currentPercentTrue=="undefined" || window.learner[name].currentPercentTrue==0 || window.learner[name].currentPercentTrue==null){
			continue
		}
		temptotal += (window.learner[name].currentPercentTrue * 2)
	}
	return temptotal
}

// Returns a modifier from 0-2 based on the average percent of predections
window.learner.getAveragePercents=function(){
	var tempnames = window.learner.getLearnerNames();
	var temptotal = 0;
	for (var i = 0; i < tempnames.length; i++) {
		let name = tempnames[i];
		if (typeof window.learner[name].currentPercentTrue=="undefined" || window.learner[name].currentPercentTrue==0 || window.learner[name].currentPercentTrue==null){
			continue
		}
		temptotal += (window.learner[name].currentPercentTrue * 2)
	}
	return (temptotal / tempnames.length)
}
// Logs the stats for current learner patterns to the console, if they have at least [minimumPredictions] and the sum must be 1% or more of the predictions, else it is likely to not be a good predictor
window.learner.displayCurrentIDStats=function(minimumPredictions=0,minimumSumPercentOfPred=0.01){
	let predictionDivider=1/minimumSumPercentOfPred;
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		if (window.learner[name].ID==null){
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
		typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
		typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
		let numPredictions=window.learner[name].Predictions[window.learner[name].ID];
		let sum=window.learner[name].Sums[window.learner[name].ID];
		let sumReq=numPredictions/predictionDivider;
		if ((numPredictions>=minimumPredictions) && ((Math.abs(sum))>=sumReq)){
			let godlycolor="white";
			window.learner[name].Sums[window.learner[name].ID]>=1?godlycolor="Yellow":null;
			window.learner[name].Sums[window.learner[name].ID]>=2?godlycolor="GreenYellow":null;
			window.learner[name].Sums[window.learner[name].ID]>=4?godlycolor="YellowGreen":null;
			window.learner[name].Sums[window.learner[name].ID]>=8?godlycolor="Lime":null;

			window.learner[name].Sums[window.learner[name].ID]<=-1?godlycolor="Yellow":null;
			window.learner[name].Sums[window.learner[name].ID]<=-2?godlycolor="Orange":null;
			window.learner[name].Sums[window.learner[name].ID]<=-4?godlycolor="OrangeRed":null;
			window.learner[name].Sums[window.learner[name].ID]<=-8?godlycolor="Crimson":null;
			console.log(`%c ${name} Pattern: (${window.learner.get_Pattern(name)}) ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:'+godlycolor);	
		}
		
	}
}

window.learner.getSumSum=function(minimumPredictions=4,minimumSumPercentOfPred=0.01){
	let SumSum=0;
	let predictionDivider=1/minimumSumPercentOfPred;
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		if (window.learner[name].ID==null){
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
		typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
		typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
		let numPredictions=window.learner[name].Predictions[window.learner[name].ID];
		let sum=window.learner[name].Sums[window.learner[name].ID];
		let sumReq=numPredictions/predictionDivider;
		if ((numPredictions>=minimumPredictions) && ((Math.abs(sum))>=sumReq)){
			SumSum+=window.learner[name].Sums[window.learner[name].ID];
		}
		
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return SumSum
}
//return number of learners with the minimum predictions/sum
window.learner.getNLearners=function(minimumPredictions=4,minimumSumPercentOfPred=0.01){
	let SumSum=0;
	let predictionDivider=1/minimumSumPercentOfPred;
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		if (window.learner[name].ID==null){
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
		typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
		typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
		let numPredictions=window.learner[name].Predictions[window.learner[name].ID];
		let sum=window.learner[name].Sums[window.learner[name].ID];
		let sumReq=numPredictions/predictionDivider;
		if ((numPredictions>=minimumPredictions) && ((Math.abs(sum))>=sumReq)){
			SumSum++
		}
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return SumSum
}

//returns an array of learner names with the minimum predictions/sum
window.learner.getLearnerNames=function(minimumPredictions=4,minimumSumPercentOfPred=0.01){
	let LNames=[];
	let predictionDivider=1/minimumSumPercentOfPred;
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		if (window.learner[name].ID==null){
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
		typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
		typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
		let numPredictions=window.learner[name].Predictions[window.learner[name].ID];
		let sum=window.learner[name].Sums[window.learner[name].ID];
		let sumReq=numPredictions/predictionDivider;
		if ((numPredictions>=minimumPredictions) && ((Math.abs(sum))>=sumReq)){
			LNames.push(name);
		}
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return LNames
}

window.learner.getNPositiveSums=function(minimumPredictions=4,minimumSumPercentOfPred=0.01){
	let SumSum=0;
	let predictionDivider=1/minimumSumPercentOfPred;
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		if (window.learner[name].ID==null){
			continue
		}
		typeof window.learner[name].Outcomes[window.learner[name].ID]=="undefined"?window.learner[name].Outcomes[window.learner[name].ID]=0:null;
		typeof window.learner[name].Predictions[window.learner[name].ID]=="undefined"?window.learner[name].Predictions[window.learner[name].ID]=0:null;
		typeof window.learner[name].Sums[window.learner[name].ID]=="undefined"?window.learner[name].Sums[window.learner[name].ID]=0:null;
		let numOutcomes=window.learner[name].Outcomes[window.learner[name].ID];
		let sum=window.learner[name].Sums[window.learner[name].ID];
		let numPredictions=window.learner[name].Predictions[window.learner[name].ID];
		
		let sumReq=numPredictions/predictionDivider;
		if ((numPredictions>=minimumPredictions) && ((Math.abs(sum))>=sumReq)){
			if (window.learner[name].Sums[window.learner[name].ID]>0){
				if (window.learner[name].Predictions[window.learner[name].ID]>=minimumPredictions){
					SumSum++
				}
			}
		}
		
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
	return SumSum
}
window.learner.setAllID=function(){
	for (var i=0; i<window.learner.learners.length; i++){
		let name=window.learner.learners[i];
		window.learner[name].ID=window.learner.get_ID(name);
		//console.log(`%c ${name} Pattern ID: ${window.learner[name].ID} THIS PATTERN PRECEDED A 2x ${(window.learner[name].Outcomes[window.learner[name].ID])}/${(window.learner[name].Predictions[window.learner[name].ID])} TIMES (SUM: ${window.learner[name].Sums[window.learner[name].ID]})`,'color:skyblue');
	}
}

window.learner.saveLearnersToLocalStorage=function(){
	if (localStorage){
		localStorage.learner=JSON.stringify(window.learner);
		
		return true
	} 
	return false
}

window.learner.loadLearnersFromLocalStorage=function(){
	if (localStorage){
		if (localStorage.learner){
			if (localStorage.learner.length>128){
				window.learner=JSON.parse(localStorage.learner);
				return true
			}	
		}
	} 
	return false
}
