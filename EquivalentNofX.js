// returns the equivalent exponential X for a streakLength of multiplier
// assuming we bet all our winnings and hit these in a streak we would win the equivalent of what is returned
// ex four 3x = 3 * 3 * 3 * 3 = 81x
function get_equivExpFromNStreakOfX(streakLength=2,multiplier = 200){
  return (Math.round(((multiplier/100)**streakLength)*100))
}

// returns the equivalent sum X for streakLength*multiplier
// ex four 3x = 3 + 3 + 3 + 3 12x
function get_equivSumFromNStreakOfX(streakLength=2,multiplier = 200){
  return (Math.round(((multiplier/100)*streakLength)*100))
}

// returns the equivalent exponential X for multpliers in array 
// assuming we bet all our winnings and hit these in a streak we would win the equivalent of what is returned
// ex 2x times 3x times 4x = 24x
// ex 1.33x times 1.28x times 1.17x = 2x ... 100@1.33x->133@1.28x->170@1.17x = ~100 bit profit
// 1.5 * 1.34 * 1.28 * 1.17 = 3.01x ... 100@1.5x->150@1.34->201@1.28x->257@1.17x = ~200 bit profit
function get_equivExpFromMultipliers(arrayOfMultipliers = [200, 300, 400]){
  if (typeof arrayOfMultipliers!='object'){
    return false
  }
  return (arrayOfMultipliers.reduceRight(function(a,b,c){return Math.ceil((a/100)*b)}))
}

// returns the equivalent summed X for multpliers in array 
// ex 2x + 3x + 4x = 9x
function get_equivSumFromMultipliers(arrayOfMultipliers = [200, 300, 400]){
  if (typeof arrayOfMultipliers!='object'){
    return false
  }
  return (arrayOfMultipliers.reduceRight(function(a,b,c){return Math.ceil(a+b)}))
}
