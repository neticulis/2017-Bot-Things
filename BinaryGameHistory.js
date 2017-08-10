/* 
 - get_historyAsBinary parses game crash history and returns a binary string where ...
   ... 1 denotes previousX >= crashNum, a 0 denotes previousX < crashNum. 1st character is most recent game.
 - >= is the default comparison, but there are 36 more to choose from for serious number crunches:
 - comparison Types: >= <= > < == != %> %< >% <% *> *< **> **< /> /< >/ </ ...
   ... />* /<* *>/ *</ >1x >2x >3x >4x >5x >6x >7x >8x >X2 >X3 >X4 >X5 >X6 >X7 >X8
 - comparison Key: [*: x doubled] [**: x squared] [/: x halfed]  [/>*: x halfed > crashNum doubled] 
   [>1...8x: currentX >= 1x to 8x above crashNum] [>X2...X8: currentX >= double to octuple crashNum]
*/
function get_historyAsBinary(crashNum=198,numGames = 32, startAt = 0,comparisonType='>=',returnType='string') {
  if (numGames+startAt > crashes.history.length) {
    numGames = crashes.history.length-(startAt+1);
  }
  if (crashNum==0){
    if (comparisonType=='%>' || comparisonType=='%<'){
      // we cant use these comparison types for a 0x - will result in NaN
      // but we can make it interesting if we change the 0x to 0.02x (2) 
      // with 0x changed to 2, remainder will be either 1 or 0
      console.log(`get_historyAsBinary cant use ${comparisonType} comparison for 0x, changed 0x to 0.02x`);
      crashNum=2;
    }
    if (comparisonType=='>/' || comparisonType=='</' || comparisonType=='*>/' || comparisonType=='*</'){
      // we cant use these comparison types for a 0x - will result in NaN
      // default comparison to >
      console.log(`get_historyAsBinary cant use ${comparisonType} comparison for 0x - changed to > (all but 0x will be 1)`);
      comparisonType='>';
    }
  }
  // slice history into an array the length of what we need, dont loop through a huge array needlessly
  let historyArray=crashes.history.slice(startAt,(startAt+numGames));
  // 
  let binaryArray = [];
  for (var gamesBack = 0; gamesBack < numGames; gamesBack++) {
    C+=2;
    // cX is the crash number from gamesBack
    let cX=historyArray[gamesBack];
    if (comparisonType=='>='){
      // 1 if cx greater than or equal to crashNum - the default comparison
      cX >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='<='){
      // 1 if cx less than or equal to crashNum
      cX <= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>'){
      // 1 if cx greater than crashNum
      cX > crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='<'){
      // 1 if cx less than crashNum
      cX < crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='=='){
      // 1 if cx equal to crashNum
      cX == crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='!='){
      // 1 if cx not equal to crashNum
      cX != crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='>1x'){
      // 1 if cx is 1.00x or more above crashNum
      (cX - crashNum) > 99 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>2x'){
      // 1 if cx is 2.00x or more above crashNum
      (cX - crashNum) > 199 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>3x'){
      // 1 if cx is 3.00x or more above crashNum
      (cX - crashNum) > 299 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>4x'){
      // 1 if cx is 4.00x or more above crashNum
      (cX - crashNum )> 399 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>5x'){
      // 1 if cx is 5.00x or more above crashNum
      (cX - crashNum) > 499 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>6x'){
      // 1 if cx is 6.00x or more above crashNum
      (cX - crashNum) > 599 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>7x'){
      // 1 if cx is 7.00x or more above crashNum
      (cX - crashNum) > 699 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>8x'){
      // 1 if cx is 8.00x or more above crashNum
      (cX - crashNum )> 799 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X2'){
      // 1 if cX is double the crashNum or more 
      (cX - crashNum) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X3'){
      // 1 if cX is triple the crashNum or more 
      (cX - (crashNum*2)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X4'){
      // 1 if cX is quadruple the crashNum or more 
      (cX - (crashNum*3)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X5'){
      // 1 if cX is quintuple the crashNum or more 
      (cX - (crashNum*4)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X6'){
      // 1 if cX is sextuple the crashNum or more 
      (cX - (crashNum*5)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X7'){
      // 1 if cX is septuple the crashNum or more 
      (cX - (crashNum*6)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>X8'){
      // 1 if cX is octuple the crashNum or more 
      (cX - (crashNum*7)) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='/>'){
      // 1 if half of cX is >= crashNum
      cX==0?cX=2:null;
      cX/2 >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='/<'){
      // 1 if half of cX is <= crashNum
      cX==0?cX=2:null;
      cX/2 <= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='>/'){
      // 1 if cX is >= half of crashNum
      cX >= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='</'){
      // 1 if cX is <= half of crashNum
      cX <= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='/>*'){
      // 1 if half of cX is >= crashNum doubled
      cX==0?cX=2:null;
      cX/2 >= crashNum*2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='/<*'){
      // 1 if half of cX is <= crashNum doubled
      cX==0?cX=2:null;
      cX/2 <= crashNum*2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='*>/'){
      // 1 if cX doubled is >= half of crashNum 
      cX*2 >= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='*</'){
      // 1 if cX doubled is <= half of crashNum 
      cX*2 <= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    } 

    else if (comparisonType=='*>'){
      // 1 if cX doubled is >= crashNum 
      cX*2 >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='*<'){
      // 1 if cX doubled is <= crashNum 
      cX*2 <= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='>*'){
      // 1 if cX is >= crashNum doubled
      cX >= crashNum*2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='<*'){
      // 1 if cX is <= crashNum doubled
      cX <= crashNum*2 ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='**>'){
      // 1 if cX squared greater than crashNum 
      // since cX is not in decimal form, to get correct power we must divide by 100 after **
      ((cX**2)/100) >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='**<'){
      // 1 if cX squared less than crashNum 
      // since cX is not in decimal form, to get correct power we must divide by 100 after **
      ((cX**2)/100) <= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='>**'){
      // 1 if cX greater than crashNum squared
      // since crashNum is not in decimal form, to get correct power we must divide by 100 after **
      cX >= ((crashNum**2)/100) ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='<**'){
      // 1 if cX less than crashNum squared
      // since crashNum is not in decimal form, to get correct power we must divide by 100 after **
      cX <= ((crashNum**2)/100) ? binaryArray.push(1) : binaryArray.push(0);
    } 
    else if (comparisonType=='%>'){
      // 1 if the remainder of currentX/crashNum >= half of crashNum
      cX%crashNum >= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='%<'){
      // 1 if the remainder of currentX/crashNum <= half of crashNum
      cX%crashNum <= crashNum/2 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='>%'){
      // 1 if the remainder of crashNum/currentX >= half of currentX

      // if currentX is a 0x, change it to 2 so the remainder will be either 1 or 0 instead of NaN
      cX==0?cX=2:null;
      crashNum%cX >= cX/2 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else if (comparisonType=='<%'){
      // 1 if the remainder of crashNum/currentX <= half of currentX
      // if currentX is a 0x, change it to 2 so the remainder will be either 1 or 0 instead of NaN
      cX==0?cX=2:null;
      crashNum%cX <= cX/2 ? binaryArray.push(1) : binaryArray.push(0);
    }
    else {
      // if no comparison type matched, default to >=
      cX >= crashNum ? binaryArray.push(1) : binaryArray.push(0);
    }

  }
  if (binaryArray.length<1){
    console.log(`get_historyAsBinary Error: no results.`);
    return false
  }
  if (returnType=='string'){
    // return as a string
    let binaryString=binaryArray.join().replace(/,/g,'');
    return binaryString
  } else {
    // return as an array
    return binaryArray
  }

}
	
