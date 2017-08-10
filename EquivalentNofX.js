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
