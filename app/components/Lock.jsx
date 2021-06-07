import React from 'react';
import Symbol from './Symbol.jsx';
import Caesar from './Caesar.jsx';
import Vigenere from './Vigenere.jsx';
import Transposition from './Transposition.jsx';
import {GLOBAL_CONFIG} from '../config/config';
const {answer, mode, extra_mode_info, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import {checkEscapp, timeout} from '../vendors/Utils';
import * as I18n from '../vendors/I18n.js';

let escappObject;

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

  componentDidMount(){
    // Para hacer lo de escapp
    escappObject = new window.ESCAPP(GLOBAL_CONFIG.escappConfig);
    escappObject.reset(); //Uncomment for removing local data storage
    escappObject.validate(function(success, er_state){
      if(success) {
        this.restoreState(er_state);
      }
    }.bind(this));;
  }

  restoreState(er_state){
    if(er_state.puzzlesSolved.length > 0){
      let puzzleId = GLOBAL_CONFIG.escappConfig.appPuzzleIds[0];
      if(er_state.puzzlesSolved.indexOf(puzzleId) !== -1){
        // Puzzle already solved
        if((typeof er_state.puzzleData === "object") && (typeof er_state.puzzleData[puzzleId] === "object")){
          let puzzleData = er_state.puzzleData[puzzleId];
          let message = puzzleData.msg;
          if((typeof message === "string") && (message.trim() !== "")){
            GLOBAL_CONFIG.good = message;
            // Finish app
            console.log('Entered!');
            this.setState({success: true});
            this.props.onSubmit(true, true, message, '');
          }
        }
      }
    }

    //this.iniciarPuzzle();
    // this.props.dispatch(loaded(true)); //'iniciarPuzzle()'' will change loading to false.
  }

  onChangeSymbol(index, content){
    let current_choice_index = Object.assign([], this.state.current_choice_index);
    current_choice_index[index] = content;
    this.setState({current_choice_index});
  }

  caesarCipher(message = answer, number = extra_mode_info){
    const ALPHABET = I18n.getTrans("i.alphabet");
    number = parseInt(number, 10);
    message = message.toLowerCase();

    let result = "";

    for (let i = 0; i < message.length; i++){
      if (message[i] === " "){
        result = result + " ";
      } else {
        let index = ALPHABET.indexOf(message[i]);
        index = index + number;
        if (index >= ALPHABET.length){
          index = index - ALPHABET.length;
        }
        // Ya tenemos el index de la letra a añadir, así que añadimos la letra correspondiente a nuestro resultados
        result = result + ALPHABET[index];
      }
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
      } else {
        result = result + this.caesarCipher(message[i], word_array[word_array_index]);
        word_array_index = word_array_index + 1;
        if (word_array_index >= word_array.length){
          word_array_index = 0;
        }
      }
    }
    return result;
  }

  columnarTranspositionCipher(message = answer, word = extra_mode_info.toLowerCase()){
    message = message.toLowerCase();

    let messageWithoutSpaces = message.replace(/\s/g, '');
    let length = word.length;

    let array_of_columns = [];

    for (let i = 0; i < length; i++){
      let column_array = [];
      for (let j = 0; j + i < messageWithoutSpaces.length; j += length){
        column_array.push(messageWithoutSpaces[j + i]);
      }
      if (Math.ceil(messageWithoutSpaces.length / length) !== column_array.length){
        column_array.push('-');
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

  helpingComponent(){
    switch (mode){
    case 'Caesar':
      return <Caesar/>;
      break;
    case 'Vigenere':
      return <Vigenere/>;
      break;
    case 'Transposition':
      return (<Transposition {...this.state} onConfigChange={(prop, value)=>{this.setState({[prop]:value}, this.preview)}}/>);
      break;
    }
  }

  render(){
    const currentQuestion = this.state.quiz.questions[0];
    const respuesta = (escapp ? Array(puzzleLength).fill("") : answer.toLowerCase().split(""));
    let className = "flex-symbols-container";
    className += this.state.success ? " success" : "";
    className += this.state.error ? " error" : "";

    return (
      <div className="quiz symbols">
        <h2 className="center h2">{tip}</h2>
        <h2 className="center h2">{I18n.getTrans("i.cipheredMessage")}</h2>

        <div className="center h5 card card-body">
          {this.cipherAlgorithm()}
        </div>
        <br />

      {/* <div style={{"--number-of-symbols": escapp ? puzzleLength : answer.length}} className={className}>
          {respuesta.map((char, i) =>
            <Symbol i={i} key={i}
              current_choice_index = {this.state.current_choice_index}
              question={currentQuestion}
              onChangeSymbol={this.onChangeSymbol.bind(this)}
            />)
          }
        </div> */}


        <div className="d-flex justify-content-center">
          {this.helpingComponent()}
        </div>
        <br />

        <form className="d-flex justify-content-center form-group" onSubmit={this.handleEnter.bind(this)}>
          <textarea className="form-control" placeholder = {I18n.getTrans("i.placeholder")} value={this.state.user_answer} onChange={this.handleChangeForm.bind(this)}
            rows="5" cols="40"
          />
        </form>
        <br />

        <div className="d-flex justify-content-center">{this.state.answered ? null :
          <button className="button_lock" onClick={this.lockClick}>
            <img src={`./assets/images/${this.state.success ? "lock_open" : "lock_closed"}.png`} width="80px" height="100px" />
          </button>}
        </div>
      </div>
    );
  }

  async lockClick(){
    let currentQuestion = this.state.quiz.questions[0];
    // let userAnswer = this.state.current_choice_index.reduce((accum, el)=>accum + currentQuestion.choices[el].id.toLowerCase(), "");
    let userAnswer = this.state.user_answer.toLowerCase().replace(/\s/g, '');
    let msg = bad;
    let ok = false;
    let extraMessage;

    if (escapp){
      /*
      La idea es que nosotros en vez de llamar a la función 'chapucera' checkEscapp, llamemos
      a la función que nos ofrece la librería de escapp_client, que es:
      escapp.submitPuzzle(número del puzzle, solución del usuario, {}, functionCallback)
      Para ver un ejemplo de llamar a escapp.submitPuzzle, mirar en el proyecto
      de PuzzleER en App.jsx la línea 432.

      La función checkEscapp está definida en Utils.js
      const res = await checkEscapp(userAnswer);
      msg = res.msg;
      ok = res.ok;
      extraMessage = res.extraMessage;
      */
      console.log(escappObject);
      escappObject.submitPuzzle(GLOBAL_CONFIG.escappConfig.appPuzzleIds[0], userAnswer, {}, function(success/*'equivalente al ok'*/, res/*'aquí viene el mensaje de si está bien o está mal la solución'*/){
        console.log("Solution "+ GLOBAL_CONFIG.solution);
        /*this.props.dispatch(checkSolution(success));
        if(success){
          let message = res.msg;
          if((typeof message === "string") && (message.trim() != "")){
            GLOBAL_CONFIG.endMessageSuccess = message;
          }
        }
        this.mostrarMsgFinal();*/

        if (success) {
          this.setState({success: true});
          msg = res.msg;
          this.props.onSubmit(true, true, msg, '');
        }
      }.bind(this));
      // El callback devuelve si lo has superado o no superado el reto.
    } else if (answer && (userAnswer === answer.toLowerCase().replace(/\s/g, ''))){
      ok = true;
      msg = good;
    }

    // Esta comprobación del if(ok) solo se hace si NO estamos usando Escapp.
    // También se puede hacer con una función, que es luego la que le pasaríamos a submitPuzzle.
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