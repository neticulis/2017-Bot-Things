//Group Follow Strategy Prototyping - Part 9 https://www.youtube.com/watch?v=VeZ7tuctGqA

window.strategyPrototype[1]=function(){
	if (player.strategy.groupFollow==false){
		// bankrollPlus:
		// each cell number repressents the percent of bankroll increase to flag
		player.strategy.bankrollPlus=[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
		
		player.strategy.bankrollPlus20Percent=false;
		player.strategy.bankrollPlus50Percent=false;
		player.strategy.bankrollDoubled=false;
		// RVG Log for State Of The Game tag 0-14
		player.strategy.sotg14=['','','','','','','','','','','','','','',''];
		// RVG Log for State Of The Game tag 1-144
		player.strategy.sotg144=['0','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',''];
		player.strategy.StateOfTheGame833='000'; // a game state - '000' to '833'
		player.strategy.StateOfTheGame14=0; // a game state - 0 to 14
		player.strategy.StateOfTheGame144=1;// a game state - 0 to 144
		player.strategy.StateOfTheGameEnabled=true;
		player.strategy.StateLog14=[]; // a log of the SOTG 14 ID
		player.strategy.StateLog144=[];	// a log of the SOTG 144 ID
		player.strategy.StateLog833=[];	// a log of the SOTG 833 ID
		player.strategy.bankrollTripled=false;
		player.strategy.bankrollQuadrupled=false;
		player.strategy.groupFollow=true;
		player.strategy.coperc=0.5;
		// copercHistory needs at least 1 entry to start
		player.strategy.copercHistory.push(0.5);
	}
	
	if (player.currentBankroll>=player.initialBankroll*1.2){
		player.strategy.bankrollPlus20Percent=true;
	}
	if (player.currentBankroll>=player.initialBankroll*1.5){
		player.strategy.bankrollPlus50Percent=true;
	}
	if (player.currentBankroll>=player.initialBankroll*2){
		player.strategy.bankrollDoubled=true;
	}
	if (player.currentBankroll>=player.initialBankroll*3){
		player.strategy.bankrollTripled=true;
	}
	if (player.currentBankroll>=player.initialBankroll*4){
		player.strategy.bankrollQuadrupled=true;
	}
	if (players.playersInProfit.length<10){
		tools.get_pip();
		console.log(`Waiting for ${10-players.playersInProfit.length} more players in iprofit.`);
		return {'amount':0,'multiplier':0}
	}
	if (crashes.history.length<16){
		console.log(`Waiting for ${(16-crashes.history.length)} more games to start betting.`);
		return {'amount':0,'multiplier':0}
	}
	medians.generate_medians();
	
	let med1Rise=medians.Tiny>=medians.Short;
	let med2Rise=medians.Short>=medians.Mid;
	let med3Rise=medians.Tiny>=medians.Mid;
	let medRise=(med1Rise && med2Rise && med3Rise);
	// Set strategy.bankrollPlus array flags to mark bankroll increases
	if (player.netProfit!=null && player.netProfit!=0 && player.netProfit>0){
		// percProf gives us a whole number percentage so we can set bankrollPlus array flags
		let percProf=Math.floor((Math.abs(player.netProfit)/player.initialBankroll)*100);
		player.strategy.bankrollPlus[percProf]=true;
	}
	// UNSET strategy.bankrollPlus array flags when the opposite netDebt is reached (ex: reset 1% profit flag at 1% debt)
	if (crashes.history.length>80 && player.netProfit!=null && player.netProfit!=0 && player.netProfit<0){
		let percProf=Math.floor((Math.abs(player.netProfit)/player.initialBankroll)*100);
		// only unset multiple when medians are rising
		// else only unset one percent
		if (((med1Rise)+(med2Rise)+(med3Rise))>=2){
			// percProf gives us a whole number percentage so we can set bankrollPlus array flags
			//percProf<=20?percProf*=2:null;
			//percProf<=50?percProf*=4:null;
			player.strategy.bankrollPlus[percProf]=false;
			player.strategy.bankrollPlus[percProf+1]=false;
			percProf>1?player.strategy.bankrollPlus[percProf-1]=false:null;
			percProf>2?player.strategy.bankrollPlus[percProf-2]=false:null;
			percProf>3?player.strategy.bankrollPlus[percProf-3]=false:null;
			percProf>4?player.strategy.bankrollPlus[percProf-4]=false:null;
			percProf>5?player.strategy.bankrollPlus[percProf-5]=false:null;
			percProf>6?player.strategy.bankrollPlus[percProf-6]=false:null;
			percProf>7?player.strategy.bankrollPlus[percProf-7]=false:null;
			percProf>8?player.strategy.bankrollPlus[percProf-8]=false:null;
			percProf>9?player.strategy.bankrollPlus[percProf-9]=false:null;
			percProf>10?player.strategy.bankrollPlus[percProf-10]=false:null;
			percProf>11?player.strategy.bankrollPlus[percProf-11]=false:null;
			percProf>12?player.strategy.bankrollPlus[percProf-12]=false:null;
			percProf>13?player.strategy.bankrollPlus[percProf-13]=false:null;
			percProf>14?player.strategy.bankrollPlus[percProf-14]=false:null;
			percProf>15?player.strategy.bankrollPlus[percProf-15]=false:null;
			percProf>16?player.strategy.bankrollPlus[percProf-16]=false:null;
			percProf>17?player.strategy.bankrollPlus[percProf-17]=false:null;
			percProf>18?player.strategy.bankrollPlus[percProf-18]=false:null;
			percProf>19?player.strategy.bankrollPlus[percProf-19]=false:null;
			percProf>20?player.strategy.bankrollPlus[percProf-20]=false:null;
			percProf>21?player.strategy.bankrollPlus[percProf-21]=false:null;
			percProf>22?player.strategy.bankrollPlus[percProf-22]=false:null;
			percProf>23?player.strategy.bankrollPlus[percProf-23]=false:null;
			percProf>24?player.strategy.bankrollPlus[percProf-24]=false:null;
			percProf>25?player.strategy.bankrollPlus[percProf-25]=false:null;
			percProf>26?player.strategy.bankrollPlus[percProf-26]=false:null;
			percProf>27?player.strategy.bankrollPlus[percProf-27]=false:null;
			percProf>28?player.strategy.bankrollPlus[percProf-28]=false:null;
			percProf>29?player.strategy.bankrollPlus[percProf-29]=false:null;
			percProf>30?player.strategy.bankrollPlus[percProf-30]=false:null;
			percProf>31?player.strategy.bankrollPlus[percProf-31]=false:null;
			percProf>32?player.strategy.bankrollPlus[percProf-32]=false:null;
			percProf>33?player.strategy.bankrollPlus[percProf-33]=false:null;
			percProf>34?player.strategy.bankrollPlus[percProf-34]=false:null;
			percProf>35?player.strategy.bankrollPlus[percProf-35]=false:null;
			percProf>36?player.strategy.bankrollPlus[percProf-36]=false:null;
			percProf>37?player.strategy.bankrollPlus[percProf-37]=false:null;
			percProf>38?player.strategy.bankrollPlus[percProf-38]=false:null;
			percProf>39?player.strategy.bankrollPlus[percProf-39]=false:null;
			percProf>40?player.strategy.bankrollPlus[percProf-40]=false:null;
		} else {
			
			player.strategy.bankrollPlus[percProf]=false;
		}
		
	}
	
	let medianPIPCashoutPerc11=null;
	let medianPIPCashoutPerc33=null;
	let avgPIPCashoutPerc=null;
	let medianPIPCashoutPerc=null;
	let medianFirstThirdPIPCashoutPerc=null;
	let medianThirdThirdPIPCashoutPerc=null;
	let medianFirstFourthPIPCashoutPerc=null;
	let medianFourthFourthPIPCashoutPerc=null;
	let on_LOST_Coperc=null;
	let on_WON_Coperc = null;
		
	if (player.strategy.copercHistory.length>=1){
		medianPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		medianPIPCashoutPerc=medianPIPCashoutPerc.sort(function(a,b){return a-b})[Math.floor(player.strategy.copercHistory.length/2)];
		medianPIPCashoutPerc11=Array.from(player.strategy.copercHistory.slice(0,11));
		medianPIPCashoutPerc11=medianPIPCashoutPerc11.sort(function(a,b){return a-b})[5];
		medianPIPCashoutPerc33=Array.from(player.strategy.copercHistory.slice(0,33));
		medianPIPCashoutPerc33=medianPIPCashoutPerc33.sort(function(a,b){return a-b})[16];
		avgPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		avgPIPCashoutPerc=avgPIPCashoutPerc.reduce(function(a,b){return a+b})/player.strategy.copercHistory.length;
		medianFirstThirdPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		medianFirstThirdPIPCashoutPerc=medianFirstThirdPIPCashoutPerc.sort(function(a,b){return a-b})[Math.floor(player.strategy.copercHistory.length/3)]
		medianThirdThirdPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		medianThirdThirdPIPCashoutPerc=medianThirdThirdPIPCashoutPerc.sort(function(a,b){return a-b})[Math.floor(player.strategy.copercHistory.length-(player.strategy.copercHistory.length/3))]
		medianFirstFourthPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		medianFirstFourthPIPCashoutPerc=medianFirstFourthPIPCashoutPerc.sort(function(a,b){return a-b})[Math.floor(player.strategy.copercHistory.length/4)]
		medianFourthFourthPIPCashoutPerc=Array.from(player.strategy.copercHistory);
		medianFourthFourthPIPCashoutPerc=medianFourthFourthPIPCashoutPerc.sort(function(a,b){return a-b})[Math.floor(player.strategy.copercHistory.length-(player.strategy.copercHistory.length/4))]
		on_LOST_Coperc=[medianFourthFourthPIPCashoutPerc,medianFirstFourthPIPCashoutPerc,medianFirstThirdPIPCashoutPerc,medianThirdThirdPIPCashoutPerc,medianFourthFourthPIPCashoutPerc];
		on_WON_Coperc = [medianFirstFourthPIPCashoutPerc, medianFourthFourthPIPCashoutPerc, medianThirdThirdPIPCashoutPerc, medianFirstThirdPIPCashoutPerc, medianFirstFourthPIPCashoutPerc];
		
	} else {
		tools.get_pip();
		console.log(`${players.playersInProfit.length} players in iprofit.`);
		return {'amount':0,'multiplier':0}
	}
	/* Find the highest over average pip median */
	let medianMostOver=0.5;
	let medianMostOverHighest=0;
	let totalOverage=((medianPIPCashoutPerc11-0.5)+(medianPIPCashoutPerc33-0.5)+(medianPIPCashoutPerc-0.5)+(medianFirstThirdPIPCashoutPerc-0.33)+(medianThirdThirdPIPCashoutPerc-0.67)+(medianFirstFourthPIPCashoutPerc-0.25)+(medianFourthFourthPIPCashoutPerc-0.75));
	if (medianPIPCashoutPerc>0.5 && medianPIPCashoutPerc-0.5>medianMostOverHighest){
		medianMostOverHighest=medianPIPCashoutPerc-0.5;
		medianMostOver=medianPIPCashoutPerc;
	}
	if (medianFirstThirdPIPCashoutPerc>0.33 && medianFirstThirdPIPCashoutPerc-0.33>medianMostOverHighest){
		medianMostOverHighest=medianFirstThirdPIPCashoutPerc-0.33;
		medianMostOver=medianFirstThirdPIPCashoutPerc;
	}
	if (medianThirdThirdPIPCashoutPerc>0.67 && medianThirdThirdPIPCashoutPerc-0.67>medianMostOverHighest){
		medianMostOverHighest=medianThirdThirdPIPCashoutPerc-0.67;
		medianMostOver=medianThirdThirdPIPCashoutPerc;
	}
	if (medianFirstFourthPIPCashoutPerc>0.25 && medianFirstFourthPIPCashoutPerc-0.25>medianMostOverHighest){
		medianMostOverHighest=medianFirstFourthPIPCashoutPerc-0.25;
		medianMostOver=medianFirstFourthPIPCashoutPerc;
	}
	if (medianFourthFourthPIPCashoutPerc>0.75 && medianFourthFourthPIPCashoutPerc-0.75>medianMostOverHighest){
		medianMostOverHighest=medianFourthFourthPIPCashoutPerc-0.75;
		medianMostOver=medianFourthFourthPIPCashoutPerc;
	}
	player.strategy.cashedOut=false;
	
	player.strategy.coperc=0.5;
	player.strategy.sitOut=true;
	player.strategy.ready=false;
	let amt=1000;
	
	
	
	let testMultiple=medianFirstFourthPIPCashoutPerc*4;
	let testMultiple2=medianPIPCashoutPerc*2;
	let testMultiple3=medianFirstThirdPIPCashoutPerc*3;
	let testMultiple4=player.currentBankroll/player.initialBankroll;
	testMultiple>2?testMultiple=2:null;
	testMultiple2>2?testMultiple2=2:null;
	testMultiple3>2?testMultiple3=2:null;
	testMultiple4>2?testMultiple4=2:null;
	
	let testMultiple5=(((medians.Tiny+medians.Short+medians.Mid)/3)/100)-1;
	
	
	
	
	
	
	
	let oneXAdd=(medianPIPCashoutPerc11<0.5)+(medianPIPCashoutPerc33<0.5)+(medianPIPCashoutPerc<0.5)+(medianFirstFourthPIPCashoutPerc<0.25)+(medianFirstThirdPIPCashoutPerc<0.33)+(medianFirstFourthPIPCashoutPerc+medianFourthFourthPIPCashoutPerc<1)+(medianFirstThirdPIPCashoutPerc+medianThirdThirdPIPCashoutPerc<1)+(avgPIPCashoutPerc<0.5);
	
	
	
	let ourmulti=100000;
	// A 3 variabled 3 digit number from 000 to 833 representing ~144 possible "game states" [0-8][0-3][0-3] 
	// A prototype for deciding when to use what strategy and trigger other things. 
	// A game state of 000 is the best, everything in the game is rolling perfectly for the most part
	// A game state of 833 is the worst, everything that can suck is sucking
	let stateOfTheGame=(oneXAdd)+''+((!med1Rise) + (!med2Rise) + (!med3Rise))+''+((medians.Tiny<197) + (medians.short<197) + (medians.Mid<197));
	// Game state as a 14 digit binary
	let stateOfTheGame2=((medianPIPCashoutPerc11<0.5)+0)+''+((medianPIPCashoutPerc33<0.5)+0)+''+((medianPIPCashoutPerc<0.5)+0)+''+((medianFirstFourthPIPCashoutPerc<0.25)+0)+''+((medianFirstThirdPIPCashoutPerc<0.33)+0)+''+((medianFirstFourthPIPCashoutPerc+medianFourthFourthPIPCashoutPerc<1)+0)+''+((medianFirstThirdPIPCashoutPerc+medianThirdThirdPIPCashoutPerc<1)+0)+''+((avgPIPCashoutPerc<0.5)+0)+' '+((!med1Rise)+0) +''+ ((!med2Rise)+0) +''+ ((!med3Rise)+0)+' '+((medians.Tiny<197)+0) +''+ ((medians.short<197)+0) +''+ ((medians.Mid<197)+0);
	// Game state as one number from 0-14
	let stateOfTheGame3=(medianPIPCashoutPerc11<0.5)+(medianPIPCashoutPerc33<0.5)+(medianPIPCashoutPerc<0.5)+(medianFirstFourthPIPCashoutPerc<0.25)+(medianFirstThirdPIPCashoutPerc<0.33)+(medianFirstFourthPIPCashoutPerc+medianFourthFourthPIPCashoutPerc<1)+(medianFirstThirdPIPCashoutPerc+medianThirdThirdPIPCashoutPerc<1)+(avgPIPCashoutPerc<0.5)+(!med1Rise) + (!med2Rise) + (!med3Rise)+(medians.Tiny<197) + (medians.short<197) + (medians.Mid<197);
	// the 3 digit Game state modified into a number 1-144, for the 144 game states
	let sotg144=0; // 1-144
	let sotgcount=0;
	stateOfTheGame=='000'?sotg144=1:null;
	for (var i=0;i<=8;i++){
		for (var ii=0;ii<=3;ii++){
			for (var iii=0;iii<=3;iii++){
				sotgcount++;
				if (stateOfTheGame==((i)+''+(ii)+''+(iii))){
					sotg144=sotgcount;
				}
			}
		}	
	}
	player.strategy.StateOfTheGame833=stateOfTheGame;
	player.strategy.StateOfTheGame14=stateOfTheGame3;
	player.strategy.StateOfTheGame144=sotg144;
	player.strategy.StateLog14.reverse();
	player.strategy.StateLog14.push(player.strategy.StateOfTheGame14);
	player.strategy.StateLog14.reverse();
	player.strategy.StateLog144.reverse();
	player.strategy.StateLog144.push(player.strategy.StateOfTheGame144);
	player.strategy.StateLog144.reverse();
	player.strategy.StateLog833.reverse();
	player.strategy.StateLog833.push(player.strategy.StateOfTheGame833);
	player.strategy.StateLog833.reverse();
	amt=player.currentBankroll/(345*((stateOfTheGame3+2)/2));
	if (player.currentStreakType=="WON"){
		// player.lastLossStreak
		//amt=player.currentBankroll/123;
		let lw=player.lastWinX/100;
		let streakSum=player.sumOfMultipliersHit;
		let sumLikely=player.lastLossStreak;
		
		amt=(((player.currentBankroll/(123*((stateOfTheGame3+2)/2)))+(player.winningsThisStreak+player.lastWinProfit))/(lw*(streakSum/(lw-1))));
		
		let amt2=amt+0;
		amt/=streakSum;
		amt=((amt+amt2)/2);
		if (streakSum>=sumLikely){
			let dec=1+((streakSum-sumLikely)/lw);
			amt/=dec;
		} else {
			amt*=1.05;
		}
		(amt>(player.winningsThisStreak/streakSum))?amt=player.winningsThisStreak/streakSum:null;
	}
	if (player.currentStreakType=="LOST"){
		// after we lose more games than player.sumOfPrevMultipliersHit we should increase bet
		let lossesLikely=Math.floor(player.sumOfPrevMultipliersHit);
		
		let lw=player.lastWinX/100;
		amt=((player.currentBankroll/(456*((stateOfTheGame3+2)/2)))+player.lastLossProfit)/2;
		if (player.currentStreakCount>=lossesLikely){
			let inc=1+((player.currentStreakCount-lossesLikely)/lw);
			amt*=inc;
		} else {
			amt/=lw;
		}
		//amt*=((player.currentStreakCount*2)/3.14159);
		(amt>(player.currentBankroll/(123*((stateOfTheGame3+2)/2))))?amt=(player.currentBankroll/(123*((stateOfTheGame3+2)/2))):null;
	}
	amt>player.currentBankroll/(67*((stateOfTheGame3+2)/2))?amt=player.currentBankroll/(67*((stateOfTheGame3+2)/2)):null;
	console.log('  Setting Bet: '+((amt/100).toFixed(0))+' bits');
	
	
	

	// If we have a large enough net profit, we treat it as our bankroll (somewhat)
	player.netProfit=player.currentBankroll-player.initialBankroll;
	if (player.netProfit > player.initialBankroll / 2) {
		amt > player.netProfit / 40 ? amt = player.netProfit / 40 : null;
	} else if (player.netProfit > player.initialBankroll / 4) {
		amt > player.netProfit / 24 ? amt = player.netProfit / 24 : null;
	} else if (player.netProfit > player.initialBankroll / 8) {
		amt > player.netProfit / 14 ? amt = player.netProfit / 14 : null;
	} else if (player.netProfit > player.initialBankroll / 16) {
		amt > player.netProfit / 9 ? amt = player.netProfit / 9 : null;
	} else if (player.netProfit > player.initialBankroll / 24) {
		amt > player.netProfit / 7 ? amt = player.netProfit / 7 : null;
	} else if (player.netProfit > player.initialBankroll / 32) {
		amt > player.netProfit / 6 ? amt = player.netProfit / 6 : null;
	} else if (player.netProfit > player.initialBankroll / 40) {
		amt > player.netProfit / 5 ? amt = player.netProfit / 5 : null;
	} else if (player.netProfit > player.initialBankroll / 48) {
		amt > player.netProfit / 4 ? amt = player.netProfit / 4 : null;
	} else if (player.netProfit > player.initialBankroll / 64) {
		amt > player.netProfit / 3 ? amt = player.netProfit / 3 : null;
	} else if (player.netProfit > player.initialBankroll / 80) {
		amt > player.netProfit / 2 ? amt = player.netProfit / 2 : null;
	}
	console.log(`%c SOTG [1-14] [1-144] [000-833]: [${stateOfTheGame3}] [${sotg144}] [${stateOfTheGame}] [${stateOfTheGame2}]`,'color:#0f0;font-size:16px;');
	
	// loop through 400 cells of player.strategy.bankrollPlus 
	// cell num is percent of bankroll we increased, if that cell is true 
	// if a cell is true we should lower our bet, test /1.01 for each cell
	
	let totalPercMod=0;
	for (var percentageIncreased=1;percentageIncreased<=400;percentageIncreased++){
		player.strategy.bankrollPlus[percentageIncreased]==true?totalPercMod+=0.025:null;
	}
	
	totalPercMod+=1;
	if (player.strategy.bankrollPlus20Percent == true) {
		let pamt=amt+0;
		amt/=1.1;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.1 = '+((amt/100).toFixed(0))+' bits (bankrollPlus20Percent)');
	}
	if (player.strategy.bankrollPlus50Percent==true){
		let pamt=amt+0;
		amt/=1.25;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.25 = '+((amt/100).toFixed(0))+' bits (bankrollPlus50Percent)');
	}
	if (player.strategy.bankrollDoubled==true){
		let pamt=amt+0;
		amt/=1.5;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.5 = '+((amt/100).toFixed(0))+' bits (bankrollDoubled)');
	}
	if (player.strategy.bankrollTripled==true){
		let pamt=amt+0;
		amt/=2;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 2 = '+((amt/100).toFixed(0))+' bits (bankrollTripled)');
	}
	if (player.strategy.bankrollQuadrupled==true){
		let pamt=amt+0;
		amt/=2;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 2 = '+((amt/100).toFixed(0))+' bits (bankrollQuadrupled)');
	}
	if (totalPercMod!=0 && totalPercMod!=1){
		let pamt=amt+0;
		amt/=totalPercMod;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / '+(totalPercMod.toFixed(2))+' = '+((amt/100).toFixed(0))+' bits (bankrollPlus Flags)');
	}
	
	let overageMod=0;
	// if totalOver < 0 - divide betamt by Mod, else multiply
	overageMod=(1+(Math.abs(totalOverage)));
	
	if (totalOverage>0){
		let pamt=amt+0;
		amt*=overageMod;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' * '+(overageMod.toFixed(2))+' = '+((amt/100).toFixed(0))+' bits (Total PIP Median was POSITIVE: '+(totalOverage.toFixed(2))+')');
		
	} else if (totalOverage<0){
		let pamt=amt+0;
		amt/=overageMod;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / '+(overageMod.toFixed(2))+' = '+((amt/100).toFixed(0))+' bits (Total PIP Median was NEGATIVE: '+(totalOverage.toFixed(2))+')');
		
	}
	if (medianMostOverHighest==0){
		// no PIP medians are over what they should be, luck is bad
		
		let pamt=amt+0;
		amt/=2;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 2 = '+((amt/100).toFixed(0))+' bits (No PIP median was over probability)');
		
		player.strategy.coperc=((medianPIPCashoutPerc+medianPIPCashoutPerc11)/2);
		player.strategy.coperc=((player.strategy.coperc+medianPIPCashoutPerc)/2);
		player.strategy.coperc=((player.strategy.coperc+medianPIPCashoutPerc33)/2);
		player.strategy.coperc=((player.strategy.coperc+medianPIPCashoutPerc11)/2);
		// use precalculated player.strategy.coperc
	} else {
		player.strategy.coperc=medianMostOver;
		player.strategy.coperc=((medianMostOver+player.strategy.coperc+medianPIPCashoutPerc33+medianPIPCashoutPerc11)/4);
		player.strategy.coperc=((medianMostOver+player.strategy.coperc+medianPIPCashoutPerc33)/3);
		player.strategy.coperc=((medianMostOver+player.strategy.coperc+medianPIPCashoutPerc11)/3);
	}
	if (players.playersInProfit.length<8){
		let pamt=amt+0;
		amt/=32;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 32 = '+((amt/100).toFixed(0))+' bits (PIPs under 8)');
	} else if (players.playersInProfit.length<12){
		let pamt=amt+0;
		amt/=16;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 16 = '+((amt/100).toFixed(0))+' bits (PIPs under 12)');
	} else if (players.playersInProfit.length<24){
		let pamt=amt+0;
		amt/=8;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 8 = '+((amt/100).toFixed(0))+' bits (PIPs under 24)');
	} else if (players.playersInProfit.length<36){
		let pamt=amt+0;
		amt/=4;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 4 = '+((amt/100).toFixed(0))+' bits (PIPs under 36)');
	} else if (players.playersInProfit.length<42){
		let pamt=amt+0;
		amt/=2;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 2 = '+((amt/100).toFixed(0))+' bits (PIPs under 42)');
	} else if (players.playersInProfit.length<62){
		let pamt=amt+0;
		amt/=1.5;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.5 = '+((amt/100).toFixed(0))+' bits (PIPs under 62)');
	} else if (players.playersInProfit.length<86){
		let pamt=amt+0;
		amt/=1.25;
		console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.25 = '+((amt/100).toFixed(0))+' bits (PIPs under 86)');
		
	}
	
	// sotg144
	let bestStates=tools.bestStates();
	let worstStates=tools.bestStates();
	if (bestStates.length>0){
		if (bestStates.indexOf(sotg144)>=0){
			// current state of game is in the best states array (60%+ rate of >2x)
			let pamt=amt+0;
			amt*=1.2;
			console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' * 1.2 = '+((amt/100).toFixed(0))+' bits (SOTG #'+sotg144+' is one of the best game states)');
		}
	}
	if (worstStates.length>0){
		if (worstStates.indexOf(sotg144)>=0){
			// current state of game is in the worst states array (40%- rate of >2x)
			let pamt=amt+0;
			amt/=1.2;
			console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' / 1.2 = '+((amt/100).toFixed(0))+' bits (SOTG #'+sotg144+' is one of the worst game states)');
		}
	}
	amt<100?amt=100:null;
	
	
	
	if (player.currentStreakType=="WON"){
		let pamt=amt+0;
		let lw=player.lastWinX/100;
		let streakSum=player.sumOfMultipliersHit;
		let sumLikely=player.lastLossStreak;
		if ((lw>1.97 || streakSum>0.985) && (streakSum>=sumLikely)){
			// dont bet more than last bet, dont bet more than last profit
			if (amt>player.strategy.previousValidBet || amt>player.lastWinProfit){
				let pamt=amt+0;
				amt>player.strategy.previousValidBet?amt=player.strategy.previousValidBet:null;
				amt>player.lastWinProfit?amt=player.lastWinProfit:null;
				
				console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' bit bet is over last profit or last bet. New bet: '+((amt/100).toFixed(0))+' bits (a loss is likely)');
			}
		}
		
	}
	if (player.currentStreakType=="LOST"){
		//player.lastLossProfit
		let pamt=amt+0;
		let lw=player.lastWinX/100;
		let lossesLikely=(player.sumOfPrevMultipliersHit/overageMod);
		if (player.currentStreakCount>=lossesLikely){
			let inc=1+((player.currentStreakCount-lossesLikely)/lw);
			amt*=inc;
			console.log('Modifying Bet: '+((pamt/100).toFixed(0))+' * '+(inc.toFixed(2))+' = '+((amt/100).toFixed(0))+' bits (a win is likely)');
		} else {
			amt/=lw;
		}
		
	}
	window.tools.normalizeProfit(2);
	if (player.netProfit>0 && amt>player.currentBankroll/22){
		let pamt=amt+0;
		amt=player.currentBankroll/22;
		console.log(((pamt/100).toFixed(0))+' bit bet is over our max of br/22: New bet: '+((amt/100).toFixed(0))+' bits');
    } else if (player.netProfit<0 && amt>player.currentBankroll/33){
		let pamt=amt+0;
		amt=player.currentBankroll/33;
		console.log(((pamt/100).toFixed(0))+' bit bet is over our max of br/33: New bet: '+((amt/100).toFixed(0))+' bits');
    }
amt<100?amt=100:null;
		return {'amount':amt,'multiplier':ourmulti}
	
	
	
}
