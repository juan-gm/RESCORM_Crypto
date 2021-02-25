import React from 'react';

import Symbol from './Symbol.jsx';
import {GLOBAL_CONFIG} from '../config/config';
const {answer, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import {checkEscapp, timeout} from '../vendors/Utils';

export default class Lock extends React.Component {
  constructor(props){
    super(props);
    let {quiz, answered} = this.props;
    let current_choice_index = (escapp ? Array(puzzleLength).fill("") : answer.toLowerCase().split("")).map((_, i) => i);
    // current_choice_index is set to an array of incrementing integers starting on zero up until the answer length - 1.
    // For example, if answer = "hola", current_choice_index = [0, 1, 2, 3]
    // Create a new state to hold the contents of the form, which is the user answer:
    let user_answer = "en un lugar";
    this.state = {quiz, answered, current_choice_index, user_answer};
    this.lockClick = this.lockClick.bind(this);
  }

  onChangeSymbol(index, content){
    let current_choice_index = Object.assign([], this.state.current_choice_index);
    current_choice_index[index] = content;
    this.setState({current_choice_index});
  }

  caesarCipher(message, number){
    const ALPHABET = "abcdefghijklmnñopqrstuvwxyz";

    let result = "";

    for (let i = 0; i < message.length; i++){
      if (message[i] === " "){
        result = result + " ";
        continue;
      }
      let index = ALPHABET.indexOf(message[i]);
      index = index + number;
      if (index >= ALPHABET.length){
        index = index - ALPHABET.length;
      }
      // Ya tenemos el index de la letra a añadir, así que añadimos la letra correspondiente a nuestro resultados
      result = result + ALPHABET[index];
    }
    return result;
  }

  handleChangeForm(e) {
    e.preventDefault();
    this.setState({user_answer: e.target.value});
  }

  handleEnter(e) {
    e.preventDefault();
    this.lockClick;
  }

  render(){
    const currentQuestion = this.state.quiz.questions[0];
    const respuesta = (escapp ? Array(puzzleLength).fill("") : answer.toLowerCase().split(""));
    let className = "flex-symbols-container";
    className += this.state.success ? " success" : "";
    className += this.state.error ? " error" : "";

    return (
      <div className="quiz symbols">
        <h2 className="center">{tip}</h2>
        <h2 className="center">Mensaje cifrado: {this.caesarCipher(answer, 3)}</h2>

        <div style={{"--number-of-symbols": escapp ? puzzleLength : answer.length}} className={className}>
          {respuesta.map((char, i) =>
            <Symbol i={i} key={i}
              current_choice_index = {this.state.current_choice_index}
              question={currentQuestion}
              onChangeSymbol={this.onChangeSymbol.bind(this)}
            />)
          }
        </div>

        <form className="center">
          <input type="text" value={this.state.user_answer} onSubmit={this.handleEnter.bind(this)} onChange={this.handleChangeForm.bind(this)}>
          </input>
        </form>

        <div className="center">{this.state.answered ? null :
          <button className="button_lock" onClick={this.lockClick}>
            <img src={`${PUBLIC_URL || "./.."}/assets/images/${this.state.success ? "lock_open" : "lock_closed"}.png`} width="80px" height="100px" />
          </button>}</div>
      </div>
    );
  }

  async lockClick(){
    let currentQuestion = this.state.quiz.questions[0];
    //let userAnswer = this.state.current_choice_index.reduce((accum, el)=>accum + currentQuestion.choices[el].id.toLowerCase(), "");
    let userAnswer = this.state.user_answer.toLowerCase().trim();
    let msg = bad;
    let ok = false;
    let extraMessage;

    if (escapp){
      const res = await checkEscapp(userAnswer);
      msg = res.msg;
      ok = res.ok;
      extraMessage = res.extraMessage;
    } else if (answer && (userAnswer === answer.toLowerCase())){
      ok = true;
      msg = good;
    }

    if (ok){
      this.setState({success: true});
      this.props.onSubmit(true, true, msg, extraMessage);
    } else {
      this.setState({error: true});
      await timeout(2000);
      this.setState({error: false});
    }
  }
}