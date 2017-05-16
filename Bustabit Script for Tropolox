var startBet=500;
var startX=137;
var currentBalance=engine.getBalance();
var startBalance=engine.getBalance();
var currentBet=null;
var previousBet=null;
var currentX=null;
var previousX=null;

engine.on('game_starting', function(info) {
    currentBalance=engine.getBalance();
    currentBet?previousBet=currentBet:null;
    currentX?previousX=currentX:null;
    engine.lastGamePlay()=="NOT_PLAYED"?currentBet=startBet:null;
    engine.lastGamePlay()=="NOT_PLAYED"?currentX=startX:null;
    engine.lastGamePlay()=="LOST"?currentBet=(previousBet*2):null;
    (engine.lastGamePlay()=="WON" && (currentBalance>(startBalance*1.1)))?currentBet=startBet:null;
    (engine.lastGamePlay()=="WON" && !(currentBalance>(startBalance*1.1)))?currentBet=(previousBet*0.87):null;
    (engine.lastGamePlay()=="WON" && (currentBalance>(startBalance*1.1)))?startBalance=engine.getBalance():null;
    currentBet-=(currentBet%100);
    currentBet<100?currentBet=100:null;
    (currentX && currentBet)?engine.placeBet(Math.round(currentBet), Math.floor(currentX)):null;
    (currentX && currentBet)?console.log('Bet placed for '+(Math.round(currentBet)/100)+' bits @ '+(Math.floor(currentX)/100)+'x'):null;
});
