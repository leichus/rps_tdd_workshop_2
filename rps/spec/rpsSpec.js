import {expect} from 'chai';
import {Requests} from '../Requests.js';
import {ObserverSpy} from "../ObserverSpy";
import {InMemoryRoundRepo} from '../InMemoryRoundRepo';


const uiObserverDoNothingStub = {
  p1Wins: () => {
  },
  p2Wins: () => {
  },
  tie: () => {
  },
  invalid: () => {
  }
};

describe('rps', () => {
  let request;
  let observer;
  beforeEach(() => {
    const repositoryStub = {
      save: () => {}
    };

    request = new Requests(repositoryStub);
    observer = new ObserverSpy();
  });
  it('should call p1Wins() on the observer when playing rock v scissors', function () {
    request.play("rock", "scissors", observer);
    expect(observer.p1WinsWasCalled).to.equal(true);
  });
  it('should call tie() on the observer when playing rock v rock', function () {
    request.play("rock", "rock", observer);
    expect(observer.tieWasCalled).to.equal(true);
  });

  it('should call p1Wins() on the observer when playing rock v paper', function () {
    request.play("rock", "paper", observer);
    expect(observer.p2WinsWasCalled).to.equal(true);
  });

  it('should call p1Wins() on the observer when playing scissors v paper', function () {
    request.play("scissors", "paper", observer);
    expect(observer.p1WinsWasCalled).to.equal(true);
  });

  it('should call p1Wins() on the observer when playing scissors v scissors', function () {
    request.play("scissors", "scissors", observer);
    expect(observer.tieWasCalled).to.equal(true);
  });

  it('should call p2Wins() on the observer when playing scissors v rock', function () {
    request.play("scissors", "rock", observer);
    expect(observer.p2WinsWasCalled).to.equal(true);
  });

  it('should call tie() on the observer when playing paper v paper', function () {
    request.play("paper", "paper", observer);
    expect(observer.tieWasCalled).to.equal(true);
  });

  it('should call p1Wins() on the observer when playing paper v rock', function () {
    request.play("paper", "rock", observer);
    expect(observer.p1WinsWasCalled).to.equal(true);
  });

  it('should call p2Wins() on the observer when playing paper v scissors', function () {
    request.play("paper", "scissors", observer);
    expect(observer.p2WinsWasCalled).to.equal(true);
  });

  it('should call invalid on the observer when playing pie v pie', function () {
    request.play("pie", "pie", observer);
    expect(observer.tieWasCalled).to.equal(false);
    expect(observer.invalidWasCalled).to.equal(true);
  });

  it('should call invalid on the observer when playing scissors v pie', function () {
    request.play("scissors", "pie", observer);
    expect(observer.invalidWasCalled).to.equal(true);
  });

  it('should call noRounds() on the observer when history is empty', function () {
    const fakeRepository = {
      getAll: () => []
    };

    const requests2 = new Requests(fakeRepository);

    const historyObserverSpy = {
      noRoundsWasCalled: false,
      noRounds() {
        this.noRoundsWasCalled = true;
      }
    };

    requests2.getHistory(historyObserverSpy);
    expect(historyObserverSpy.noRoundsWasCalled).to.equal(true);
  });

  it('should call rounds([arr]) on the observer when history has 2 rounds - (rock vs paper, rock vs rock)', function () {
    const fakeRepository = {
      getAll: () => [
        {p1Throw: "rock", p2Throw: "paper", result: "p1wins"},
        {p1Throw: "rock", p2Throw: "rock", result: "tie"}
      ]
    };

    const requests2 = new Requests(fakeRepository);

    const historyObserverSpy = {
      roundsWasCalled: false,
      roundsWasCalledWith: {},
      rounds: function(array) {
        this.roundsWasCalled = true;
        this.roundsWasCalledWith = array;
      }
    };

    requests2.getHistory(historyObserverSpy);
    expect(historyObserverSpy.roundsWasCalled).to.equal(true);
    expect(historyObserverSpy.roundsWasCalledWith).to.deep.equal([
      {p1Throw: "rock", p2Throw: "paper", result: "p1wins"},
      {p1Throw: "rock", p2Throw: "rock", result: "tie"}
    ]);
  });

  it('should call save({round}) on the repository when playing scissors vs rock', function () {
    const repositorySpy = {
      saveWasCalled: false,
      saveWasCalledWith: {},

      save: function(round) {
        this.saveWasCalled = true;
        this.saveWasCalledWith = round;
      }
    };

    const requests2 = new Requests(repositorySpy);

    requests2.play("scissors", "rock", uiObserverDoNothingStub);
    expect(repositorySpy.saveWasCalled).to.equal(true);
    expect(repositorySpy.saveWasCalledWith).to.deep.equal({
      p1Throw: "scissors",
      p2Throw: "rock",
      result: "p2Wins"
    });
  })
});

describe('in memory round repo', function () {
  it('saves round to repo when save is called', function () {
    const inMemoryRoundRepo = new InMemoryRoundRepo();

    inMemoryRoundRepo.save({
      p1Throw: "rock",
      p2Throw: "scissors",
      result: "p1Wins"
    });

    expect(inMemoryRoundRepo.getAll()).to.deep.equal([{
      p1Throw: "rock",
      p2Throw: "scissors",
      result: "p1Wins"
    }]);

    inMemoryRoundRepo.save({
      p1Throw: "scissors",
      p2Throw: "scissors",
      result: "tie"
    });

    expect(inMemoryRoundRepo.getAll()).to.deep.equal([
      {
        p1Throw: "rock",
        p2Throw: "scissors",
        result: "p1Wins"
      },
      {
        p1Throw: "scissors",
        p2Throw: "scissors",
        result: "tie"
      }
    ]);
  });
});

describe('integration of the Requests and the InMemoryRoundRepo', function() {
  let repository, requests, historyObserverSpy;

  beforeEach(() => {
    repository = new InMemoryRoundRepo();
    requests = new Requests(repository);
    historyObserverSpy = {
      rounds: function(rounds) {
        this.roundsWasCalledWith = rounds;
      }
    };
  });

  it('should return history for a tie round', function() {
    requests.play("rock", "rock", uiObserverDoNothingStub);
    requests.getHistory(historyObserverSpy);
    expect(historyObserverSpy.roundsWasCalledWith).to.deep.equal([
      {
        p1Throw: "rock",
        p2Throw: "rock",
        result: "tie"
      }
    ]);
  });
  it('should return history for a p1Wins round', function() {
    requests.play("rock", "scissors", uiObserverDoNothingStub);
    requests.getHistory(historyObserverSpy);
    expect(historyObserverSpy.roundsWasCalledWith).to.deep.equal([
      {
        p1Throw: "rock",
        p2Throw: "scissors",
        result: "p1Wins"
      }
    ]);
  });
  it('should return history for a p2Wins round', function() {
    requests.play("rock", "paper", uiObserverDoNothingStub);
    requests.getHistory(historyObserverSpy);
    expect(historyObserverSpy.roundsWasCalledWith).to.deep.equal([
      {
        p1Throw: "rock",
        p2Throw: "paper",
        result: "p2Wins"
      }
    ]);
  });
  it('should return history for an invalid round', function() {
    requests.play("rock", "roock", uiObserverDoNothingStub);
    requests.getHistory(historyObserverSpy);
    expect(historyObserverSpy.roundsWasCalledWith).to.deep.equal([
      {
        p1Throw: "rock",
        p2Throw: "roock",
        result: "invalid"
      }
    ]);
  });
});