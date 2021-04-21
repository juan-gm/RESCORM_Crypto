import React from 'react';
import {GLOBAL_CONFIG} from '../config/config';
// const {answer, mode, extra_mode_info, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import * as I18n from '../vendors/I18n.js';
const {answer, extra_mode_info} = GLOBAL_CONFIG;

export default class Transposition extends React.Component {
  constructor(props){
    super(props);
    let characterUserAnswer = [];
    this.state = {characterUserAnswer};
  }

  generateInput(counter){
    counter[0] += 1;
    let userAnswer = { name: "user_answer", value: this.props.user_answer, callback: (e) => {this.props.onConfigChange("user_answer", e.target.value)}};
    return <input name="user_answer" type="text" value = {userAnswer.value[counter[0]]} onChange={userAnswer.callback} className="form-group w-5 h-5" style={{ width: "25px", height: "25px", textAlign: "center"}}/>
  }

  generateRow(counter){
    let result = [];
    for (let index = 0; index < extra_mode_info.length; index++) {
      result.push(this.generateInput(counter));
    }

    return <div>{result}</div>;

    return <div>
      <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
    </div>
  }

  generateForm(){
    let result = [];
    let messageWithoutSpaces = answer.replace(/\s/g, '');
    let numberOfRows = Math.ceil(messageWithoutSpaces.length / extra_mode_info.length);
    let counter = [-1];

    for (let index = 0; index < numberOfRows; index++) {
      result.push(this.generateRow(counter));
    }
    return result;
    
    return [<div key="key">hola</div>,
      <div key="key">Hola</div>
    ]
  }

  render(){
    return <div className="d-flex justify-content-center "> 
      <form className="form-group">
        {this.generateForm()}
      </form>
    </div>
  }
}