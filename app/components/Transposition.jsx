import React from 'react';
import {GLOBAL_CONFIG} from '../config/config';
// const {answer, mode, extra_mode_info, escapp, puzzleLength, good, bad, tip, PUBLIC_URL} = GLOBAL_CONFIG;
import * as I18n from '../vendors/I18n.js';
const {answer, extra_mode_info} = GLOBAL_CONFIG;

export default class Transposition extends React.Component {
  constructor(props){
    super(props);
  }

  generateInput(){
    return <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>

  }

  generateRow(){
    let result = [];
    for (let index = 0; index < extra_mode_info.length; index++) {
      result.push(this.generateInput());
    }

    return <div>{result}</div>;

    return <div>
      <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
    </div>
  }

  generateForm(){
    let result = [];
    let messageWithoutSpaces = answer.replace(/\s/g, '');
    let numberOfRows = Math.ceil(messageWithoutSpaces.length / extra_mode_info.length)

    for (let index = 0; index < numberOfRows; index++) {
      result.push(this.generateRow())
    }
    return result;
    
    return [<div key="key">hola</div>,
      <div key="key">Hola</div>
    ]
  }

  render(){
    return <div>
      <form className="center">
        <div>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
        </div>

        <div>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/>
          <input type="text" style={{borderRadius: "5px", borderColor: "blue", width: "25px", height: "25px", textAlign: "center"}}/> 
        </div>
      </form>
      {this.generateForm()}
    </div>
  }
}