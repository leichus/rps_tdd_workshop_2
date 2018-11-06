import React from 'react';
import ReactDOM from "react-dom";
import {RPSApp} from "./RPSApp";
import {Requests} from "../../rps/Requests";
import {InMemoryRoundRepo} from "../../rps/InMemoryRoundRepo";

const domFixture = document.createElement('div');
domFixture.id = 'reactApp';
document.querySelector('body').appendChild(domFixture);


ReactDOM.render(
    <RPSApp requests={new Requests(new InMemoryRoundRepo())}/>,
    domFixture
);
