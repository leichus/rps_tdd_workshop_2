export class ObserverSpy{

  constructor(){
    this.p1WinsWasCalled = false;
    this.tieWasCalled = false;
    this.p2WinsWasCalled = false;
    this.invalidWasCalled = false;
  }

  p1Wins(){
    this.p1WinsWasCalled = true;
  }

  p2Wins(){
    this.p2WinsWasCalled = true;
  }

  tie(){
    this.tieWasCalled = true;
  }

  invalid(){
    this.invalidWasCalled = true;
  }
}