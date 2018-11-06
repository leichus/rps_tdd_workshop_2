export class InMemoryRoundRepo {
  constructor() {
    this.rounds = [];
  }

  save(round) {
    this.rounds.push(round);
  }

  getAll() {
    return this.rounds;
  }
}

//round = {
// player1Throw: "Asdf",
// player2Throw: "asdf",
// result: "asdf"
// }