// returns a higher number the further red numbers are from their probabilistic average.
// returns 1 if probability at equilibrium
function get_redRarity() {
  let lowXProb = null;
  let lowXProbs = [];
  for (var X = 100; X <= 197; X++) {
    (crashes.seen(X, '<=')) != false ? lowXProbs.push((crashes.seen(X, '<=') * (1 - prob(X / 100)))) : null;
  }
  lowXProb = ((lowXProbs.reduce((a, b) => a + b)) / 1.02);
  return lowXProb
}

// returns a higher number the farther green numbers are from their probabilistic average.
// returns 1 if probability at equilibrium
function get_greenRarity() {
  let highXProb = null;
  let highXProbs = [];
  for (var X = 198; X <= 4951; X += 49) {
    (crashes.seen(X, '>=')) != false ? highXProbs.push((crashes.seen(X, '>=') * (prob(X / 100)))) : null;
  }
  highXProb = ((highXProbs.reduce((a, b) => a + b)) / 1.02);
  return highXProb
}
