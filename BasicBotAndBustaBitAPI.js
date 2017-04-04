// This strategy editor is in BETA mode, please
// exercise extreme caution and use exclusively at
// your own risk. No bets can or will be refunded in
// case of errors.

// Please note the strategy editor executes arbitrary
// javascript without a sandbox and as such, only use
// strategies from trusted sources, as they can be
// backdoored to lose all your money or have
// intentional exploitable weaknesses etc.

// To see the full engine API go to:
///https://github.com/FuzzyHobbit/bustabit-webserver/blob/master/client_new/scripts/game-logic/script-controller.js

// To discuss, request or post a strategy checkout:
///http://www.reddit.com/r/moneypot/

//Engine events: 

engine.on('game_starting', function(info) {
    console.log('Game Starting in ' + info.time_till_start);
  basicBot();
});

engine.on('game_started', function(data) {
    console.log('Game Started', data);
});

engine.on('game_crash', function(data) {
    console.log('Game crashed at ', data.game_crash);
});

engine.on('player_bet', function(data) {
    console.log('The player ', data.username, ' placed a bet. This player could be me :o.')
});

engine.on('cashed_out', function(resp) {
    console.log('The player ', resp.username, ' cashed out. This could be me.');
});

engine.on('msg', function(data) {
    console.log('Chat message!...');
});

engine.on('connect', function() {
    console.log('Client connected, this wont happen when you run the script');
});

engine.on('disconnect', function() {
    console.log('Client disconnected');
});

////////////// Simplest bot to make: 
var myBaseBet=500; // 5 bits
var myBaseMultiplier=123; // 1.23x
function basicBot(){
  let mybet=myBaseBet; // 100=1 bit
  let mymultiplier=myBaseMultiplier; // 200=2.00x
  // Did I lose the last game?
  if (engine.lastGamePlay()==="LOST"){
    // Yes, Increase bet
    mybet=mybet*1.5;
  } else if (engine.lastGamePlay()==="WON"){
    // No, Return to first bet
    mybet=myBaseBet;
  } else { /* didnt play */ }
  engine.placeBet(mybet, mymultiplier);
}
//Getters:
console.log('Balance: ' + engine.getBalance());
console.log('The current payout is: ' + engine.getCurrentPayout());
console.log('My username is: ', engine.getUsername());
console.log('The max current bet is: ', engine.getMaxBet()/100, ' Bits');
console.log('The current maxWin is: ', engine.getMaxWin()/100, ' Bits');
// engine.getEngine() for raw engine 


//Helpers:
console.log('Was the last game played? ', engine.lastGamePlayed()?'Yes':'No');
console.log('Last game status: ', engine.lastGamePlay());


//Actions:
//Do this between the 'game_starting' and 'game_started' events
//engine.placeBet(betInSatoshis, autoCashOutinPercent, autoPlay);

//engine.cashOut(); //Do this when playing
//engine.stop(); //Stops the strategy
//engine.chat('Hello Spam');
