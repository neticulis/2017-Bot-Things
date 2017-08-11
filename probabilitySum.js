// returns the % probability of >=X being seen
function prob(multiplier) {
	if (multiplier == 0) {
		return 1 - (100 / 101);
	}
	return (100 / 101) * (99 / (multiplier * 100 - 1));
}

// A new way of doing medians based on probability
function probSum(numGames = this.history.length, startAt = 0) {
  if (numGames > this.history.length) {
    numGames = this.history.length;
  }
  let psum = 0;
  for (var gamesBack = startAt; gamesBack < (numGames + startAt); gamesBack++) {
    C++
    let X = this.history[gamesBack];
    if (X > 200) {
      psum += 0.490099 - prob(X / 100)
    } else {
      if (X <= 100) {
        psum -= 0.990099;
      } else {
        psum += (0.490099 - prob(X / 100));
      }
    }
  }
  // should even out at 0 much like 1.97x median: 0 should be more likely the more games are summed
  // with the house edge we must add 0.02 per game so that the above is true
  return (psum+(0.02*numGames)); 
}
