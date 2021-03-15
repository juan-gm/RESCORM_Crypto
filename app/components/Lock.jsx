import React from 'react';

import Symbol from './Symbol.jsx';
import {GLOBAL_CONFIG} from '../config/config';
const {answer, mode, extra_mode_info, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import {checkEscapp, timeout} from '../vendors/Utils';
import * as I18n from '../vendors/I18n.js';

export default class Lock extends React.Component {
  constructor(props){
    super(props);
    let {quiz, answered} = this.props;
    let current_choice_index = (escapp ? Array(puzzleLength).fill("") : answer.toLowerCase().split("")).map((_, i) => i);
    // current_choice_index is set to an array of incrementing integers starting on zero up until the answer length - 1.
    // For example, if answer = "hola", current_choice_index = [0, 1, 2, 3]
    // Create a new state to hold the contents of the form, which is the user answer:
    let user_answer = "";
    this.state = {quiz, answered, current_choice_index, user_answer};
    this.lockClick = this.lockClick.bind(this);
  }

  onChangeSymbol(index, content){
    let current_choice_index = Object.assign([], this.state.current_choice_index);
    current_choice_index[index] = content;
    this.setState({current_choice_index});
  }

  caesarCipher(message = answer, number = extra_mode_info){
    const ALPHABET = I18n.getTrans("i.alphabet");
    number = parseInt(number, 10);

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

  vigenereCipher(message = answer, word = extra_mode_info){
    const ABECEDARIO = I18n.getTrans("i.alphabet");
    word = word.toLowerCase();
    message = message.toLowerCase();

    let word_array = [];
    for (let i = 0; i < word.length; i++){
      let index = ABECEDARIO.indexOf(word[i]);
      word_array.push(index);
    }

    let result = "";
    let word_array_index = 0;

    for (let i = 0; i < message.length; i++){
      if (message[i] === " "){
        result = result + " ";
        continue;
      }
      result = result + this.caesarCipher(message[i], word_array[word_array_index]);
      word_array_index = word_array_index + 1;
      if (word_array_index >= word_array.length){
        word_array_index = 0;
      }
    }
    return result;
  }

  columnarTranspositionCipher(message = answer, word = extra_mode_info){
    message = message.toLowerCase();

    let message_without_spaces = message.replace(/\s/g, '');
    let length = word.length;

    let array_of_columns = [];

    for (let i = 0; i < length; i++){
      let column_array = [];
      for (let j = 0; j + i < message_without_spaces.length; j += length){
        column_array.push(message_without_spaces[j + i]);
      }
      array_of_columns.push(column_array);
    }
    let ciphered_array = [];
    let ordered_word = word.split('').sort().join('');
    let copy_of_word = word;
    let arr = '';

    for (let i = 0; i < copy_of_word.length; i++){
      ciphered_array.push(array_of_columns[copy_of_word.indexOf(ordered_word[i])]);
      arr = copy_of_word.split('');
      arr[copy_of_word.indexOf(ordered_word[i])] = '-';
      copy_of_word = arr.join('');
    }

    return ciphered_array.flat().join('');
  }

  cipherAlgorithm(){
    let result = "";
    switch (mode){
    case 'Caesar':
      result = this.caesarCipher();
      break;
    case 'Vigenere':
      result = this.vigenereCipher();
      break;
    case 'Transposition':
      result = this.columnarTranspositionCipher();
      break;
    }
    return result;
  }

  handleChangeForm(e){
    e.preventDefault();
    this.setState({user_answer: e.target.value});
  }

  handleEnter(e){
    e.preventDefault();
    this.lockClick();
    return false;
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
        <h2 className="center">Mensaje cifrado:</h2>

        <div className="center">
          {this.cipherAlgorithm()}
        </div>

        <div style={{"--number-of-symbols": escapp ? puzzleLength : answer.length}} className={className}>
          {respuesta.map((char, i) =>
            <Symbol i={i} key={i}
              current_choice_index = {this.state.current_choice_index}
              question={currentQuestion}
              onChangeSymbol={this.onChangeSymbol.bind(this)}
            />)
          }
        </div>

        <form className="center" onSubmit={this.handleEnter.bind(this)}>
          <textarea placeholder = {I18n.getTrans("i.placeholder")} value={this.state.user_answer} onChange={this.handleChangeForm.bind(this)}
            rows="5" cols="40" style={{borderRadius: "5px", borderColor: "blue" }}
          />
        </form>
        <br />

        <div className="center">{this.state.answered ? null :
          <button className="button_lock" onClick={this.lockClick}>
            <img src={`${PUBLIC_URL || "./.."}/assets/images/${this.state.success ? "lock_open" : "lock_closed"}.png`} width="80px" height="100px" />
          </button>}
        </div>
          
        <div>
          {}
        </div>
      </div>
    );
  }

  async lockClick(){
    let currentQuestion = this.state.quiz.questions[0];
    // let userAnswer = this.state.current_choice_index.reduce((accum, el)=>accum + currentQuestion.choices[el].id.toLowerCase(), "");
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