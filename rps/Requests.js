export class Requests{
  constructor(repository){
    this.repository = repository;
  }
  play(p1Throw, p2Throw, uiObserver){
    function isValid(value) {
      return value === "rock" || value === "scissors" || value === "paper";
    }

    if( !isValid(p1Throw) || !isValid(p2Throw)){
      uiObserver.invalid();
      this.repository.save({p1Throw: p1Throw,
            p2Throw: p2Throw,
            result: "invalid"});
      return;
    }

    if( p1Throw === p2Throw ){
      uiObserver.tie();
      this.repository.save({p1Throw: p1Throw,
        p2Throw: p2Throw,
        result: "tie"});
      return;
    }

    if( p1Throw === "rock") {
      if (p2Throw === "scissors") {
        uiObserver.p1Wins();
        this.repository.save({p1Throw: p1Throw,
          p2Throw: p2Throw,
          result: "p1Wins"});
        return;
      }
    }

    if( p1Throw === "scissors"){
      if( p2Throw === "paper"){
        uiObserver.p1Wins();
        this.repository.save({p1Throw: p1Throw,
          p2Throw: p2Throw,
          result: "p1Wins"});
        return;
      }
    }

    if( p1Throw === "paper") {
      if ( p2Throw === "rock") {
        uiObserver.p1Wins();
        this.repository.save({p1Throw: p1Throw,
          p2Throw: p2Throw,
          result: "p1Wins"});
        return;
      }
    }
    uiObserver.p2Wins();
    this.repository.save({p1Throw: p1Throw,
      p2Throw: p2Throw,
      result: "p2Wins"});
  }

  getHistory(historyObserver) {
    let rounds = this.repository.getAll();

    if (rounds.length === 0) {
      historyObserver.noRounds();
    } else {
      historyObserver.rounds(rounds);
    }
  }
}
