import React from 'react';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import * as ReactDOM from "react-dom";
import {RPSApp} from "../src/RPSApp.jsx";
import * as sinon from 'sinon';

const expect = chai.expect;
chai.use(sinonChai);

describe('play form', function () {
  let domFixture;

  beforeEach(setupDOM);

  afterEach(cleanupDOM);

  it('should tells the user that Player 1 Wins when the Request module says that p1Wins', ()=> {
    renderApp({
      play: (p1,p2,observer) => observer.p1Wins(),
      getHistory: () => {}
    });

    expect(page()).not.to.contain("Player 1 Wins");
    submitForm();
    expect(page()).to.contain("Player 1 Wins");

  });

  it('should tells the user that Player 2 Wins when the Request module says that p2Wins', ()=> {
    renderApp({
      play: (p1,p2,observer) => observer.p2Wins(),
      getHistory: () => {}
    });

    expect(page()).not.to.contain("Player 2 Wins");
    submitForm();
    expect(page()).to.contain("Player 2 Wins");

  });

  it('should tells the user that it was a tie when the Request module says that tie', ()=> {
    renderApp({
      play: (p1,p2,observer) => observer.tie(),
      getHistory: () => {}
    });

    expect(page()).not.to.contain("Tie");
    submitForm();
    expect(page()).to.contain("Tie");

  });

  it('should tell the user the game was invalid when the Request module says that invalid', ()=> {
    renderApp({
      play: (p1,p2,observer) => observer.invalid(),
      getHistory: () => {}
    });

    expect(page()).not.to.contain("Invalid");
    submitForm();
    expect(page()).to.contain("Invalid");

  });


  it('should pass through rock and scissors to the requests object', function () {
    // renderApp({play: (p1,p2,observer) => observer.p1Wins()});
    const requestsSpy = {play: sinon.spy(), getHistory: () => {}};

    renderApp(requestsSpy);

    play("rock", "scissors");

    expect(requestsSpy.play).to.have.been.calledWith("rock", "scissors");
  });

  it('should show no rounds when no rounds have been played', function() {
    const requestsFake = {
      play: () => {},
      getHistory: (observer) => {
        observer.noRounds();
      }
    };

    renderApp(requestsFake);

    expect(page()).to.contain("No rounds");
  });

  it('should show rounds when rounds have been played', function() {
    const requestsFake = {
      play: () => {},
      getHistory: (observer) => {
        observer.rounds([{
          p1Throw: "rock",
          p2Throw: "rock",
          result: "tie"
        }]);
      }
    };

    renderApp(requestsFake);

    expect(page()).not.to.contain("No rounds");
    expect(page()).to.contain("p1Throw rock\np2Throw rock\nresult tie");
  });

  function play(p1, p2){
    setInputValue("p1Throw", p1);
    setInputValue("p2Throw", p2);
    document.querySelector("button").click();

  }

  function setInputValue(id,value){
    const input = document.getElementById(id);
    const lastValue = input.value;

    input.value = value;

    // react 16 hack
    let tracker = input._valueTracker;
    if(tracker) {
      tracker.setValue(lastValue)
    }

    input.dispatchEvent(new Event('input', {'bubbles':true, 'cancelable':true}));
  }
  function setupDOM() {
    domFixture = document.createElement("div");
    document.querySelector("body").appendChild(domFixture);
  }

  function  cleanupDOM() {
    domFixture.remove();
  }

  function renderApp(request){
    ReactDOM.render(<RPSApp requests={request}/>, domFixture);
  }

  function submitForm() {
    document.querySelector("button").click();
  }
  function page() {
    return document.body.innerText;
  }
});
