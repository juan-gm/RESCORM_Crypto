import React from 'react';
import {GLOBAL_CONFIG} from '../config/config';
//const {answer, mode, extra_mode_info, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import * as I18n from '../vendors/I18n.js';
const {extra_mode_info} = GLOBAL_CONFIG;


export default class Caesar extends React.Component {
  constructor(props){
    super(props);
  }

  createAlphabet(){
    const ALPHABET = I18n.getTrans("i.alphabet");
    return ALPHABET.split('').map(char => char.toUpperCase() + ' ');
  }

  createArrows(){
    const length = I18n.getTrans("i.alphabet").length;
    let arrows = [];

    for (let i = 0; i < length; i++) {
      arrows.push(' | ')
    }

    return arrows;
  }

  createModifiedAlphabet(){
    const ALPHABET = I18n.getTrans("i.alphabet");
    let modifiedAlphabet = [];
    let numberOfJumps = parseInt(extra_mode_info);

    for (let i = numberOfJumps; i < ALPHABET.length + numberOfJumps; i++) {
      let index = (i < ALPHABET.length ? i : i - ALPHABET.length);
      modifiedAlphabet.push(ALPHABET[index]);
    }
    console.log(modifiedAlphabet);
    return modifiedAlphabet.map(char => char.toUpperCase() + ' ');
  }

  render(){
    return <div>
      <div>{this.createAlphabet()}</div>

      <div>{this.createArrows()}</div>

      <div>{this.createModifiedAlphabet()}</div>
      <table>
      tr td Caracter unicode de una flecha
      </table>
      
      
    </div>
    /*
    return <div className="symbol">
      <div className="choice" >
        {this.props.question.choices[currentChoice].value ? <img className="symbol-img" src={(GLOBAL_CONFIG.PUBLIC_URL || "./..") + this.props.question.choices[currentChoice].value}/> : this.props.question.choices[currentChoice].id}
      </div>
      <div className="buttons">
        <Button buttonName="keyboard_arrow_down" buttonFunc={this.onUp}/>
        <Button buttonName="keyboard_arrow_up" buttonFunc={this.onDown}/>
      </div>
    </div>;
    */
  }
}