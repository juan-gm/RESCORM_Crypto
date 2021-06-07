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
    this.callbackFunction = this.callbackFunction.bind(this);
  }

  callbackFunction(e, index) {
    let newAnswer = this.props.user_answer.split('');

    let solveEmptyCells = [];
    for (let idx = 0; idx <= Math.max(index, newAnswer.length - 1); idx++) {
      const element = newAnswer[idx];
      if (element === undefined) {
        solveEmptyCells.push(' ');
      } else {
        solveEmptyCells.push(element);
      }
    }
    solveEmptyCells[index] = ((e.target.value === '') ? ' ' : e.target.value);
    
    let messageWithoutSpaces = answer.replace(/\s/g, '');
    
    if (index < messageWithoutSpaces.length) {
      document.getElementById('input_' + (index + 1)).focus();
    }
    this.props.onConfigChange("user_answer", solveEmptyCells.join(''));
    // Casilla en blanco.
  }


  generateInput(counter){
    let userAnswer = {name: "user_answer", value: this.props.user_answer, callback: this.callbackFunction.bind(this)};
    return <input key={counter} id={'input_' + counter} name="user_answer" type="text" value = {(userAnswer.value[counter] === ' ') ? '' : (userAnswer.value[counter] || '')} onChange={(e) => this.callbackFunction(e, counter)} className="form-group w-5 h-5" style={{width: "25px", height: "25px", textAlign: "center"}}/>
  }

  generateRow(counter){
    let result = [];
    for (let index = 0; index < extra_mode_info.length; index++){
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
    let counter = 0;

    for (let index = 0; index < numberOfRows; index++) {
      //result.push(this.generateRow(counter));
      let row = [];
      for (let column = 0; column < extra_mode_info.length; column++){
        row.push(this.generateInput(counter));
        counter++;
      }
      result.push(<div>{row}</div>);
    }
    return result;

    return [<div key="key">hola</div>,
      <div key="key">Hola</div>
    ];
  }

  render(){
    return (
      <div>
        <div className="d-flex justify-content-center ">
          <p><b>{I18n.getTrans("i.noSpaces")}</b></p>
        </div>

        <div  className="d-flex justify-content-center ">
          <form className="form-group">
            {this.generateForm()}
          </form>
        </div>
      </div>
    );
  }
}