import * as React from "react";

export class RPSApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "",
      p1Throw: "",
      p2Throw: "",
      history: []
    };

    this.updateP1Throw = this.updateP1Throw.bind(this);
    this.updateP2Throw = this.updateP2Throw.bind(this);
  }

  componentDidMount() {
    this.props.requests.getHistory(this);
  }

  render() {
    const historyItems = this.state.history.length === 0 ?
        <div>No rounds</div> :
        this.state.history.map((round, index) => {
          return (
              <div key={index}>
                <div>Round {index+1}:</div>
                <div>p1Throw <strong>{round.p1Throw}</strong></div>
                <div>p2Throw <strong>{round.p2Throw}</strong></div>
                <div>result <strong>{round.result}</strong></div>
                <br/>
              </div>
          );
        });

    return <div>
      <h1>Hey Start Playing Below</h1>
      <label>Player 1</label><input id="p1Throw" value={this.state.p1Throw} onChange={this.updateP1Throw}/>
      <br/>
      <label>Player 2</label><input id="p2Throw" value={this.state.p2Throw} onChange={this.updateP2Throw}/>
      <br/>
      <button onClick={() => this.handleButtonClick()}>Play</button>
      <br/>
      {this.state.message}
      <br/>
      <h1>History</h1>
      <div>{historyItems}</div>
    </div>;
  }


  updateP1Throw(event) {
    this.setState({
      p1Throw: event.target.value
    });
  }

  updateP2Throw(event) {
    this.setState({
      p2Throw: event.target.value
    });
  }

  handleButtonClick() {
    this.props.requests.play(this.state.p1Throw, this.state.p2Throw, this);
    this.props.requests.getHistory(this);
  }

  p1Wins() {
    this.setState({message: "Player 1 Wins"});
  }

  p2Wins() {
    this.setState({message: "Player 2 Wins"});
  }

  tie() {
    this.setState({message: "Tie"});
  }

  invalid() {
    this.setState({message: "Invalid"});
  }

  noRounds() {
    this.setState({history: []});
  }

  rounds(arrayOfResults) {
    this.setState({history: arrayOfResults});
  }


}