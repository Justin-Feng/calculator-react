// Import components
import {useReducer} from "react"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import HistoryParagraph from "./HistoryParagraph"
import "./styles.css"


/*
 TODOs:
 history area() {
    make the equation clickable
      go back to the equation result, show it in currentOperand
    mark the equation
 }
 */


 // Global variable ACTIONS for the reducer conditions
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation', 
  CLEAR: 'clear', 
  DELETE_DIGIT: 'delete-digit', 
  EVALUATE: 'evaluate', 
  RETURN_HISTORY: 'return-history'
}


/* The Reducer Function */
function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
      if(state.overwrite) {
        return {
          ...state, 
          currentOperand: payload.digit, 
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0') return state
      if(payload.digit === '.' && state.currentOperand.includes(".")) return state
      return {
        ...state, 
        currentOperand: `${state.currentOperand || ""}${payload.digit}`, 
        overwrite: false
      }
    case ACTIONS.CHOOSE_OPERATION: 
      if(state.currentOperand == null && state.previousOperand == null) return state
      if(state.currentOperand == null) {
        return {
          ...state, 
          operation: payload.operation
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state, 
          operation: payload.operation, 
          previousOperand: `${state.currentOperand}`, 
          currentOperand: null
        }
      }
      return {
        ...state, 
        previousOperand: evaluate(state), 
        historyTextArr: [(<p>{`${state.previousOperand} ${state.operation} ${state.currentOperand} = ${evaluate(state)}`}</p>), ...state.historyTextArr], 
        operation: payload.operation, 
        currentOperand: null
      }
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null)
        return state
      return {
        ...state, 
        overwrite: true, 
        previousOperand: null, 
        operation: null, 
        currentOperand: evaluate(state), 
        historyTextArr: [(<p>{`${state.previousOperand} ${state.operation} ${state.currentOperand} = ${evaluate(state)}`}</p>), ...state.historyTextArr]
      }
    case ACTIONS.DELETE_DIGIT: 
      if(state.overwrite) {
        return {
          ...state, 
          overwrite: false, 
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }
      return {
        ...state, 
        currentOperand: state.currentOperand.toString().slice(0, -1)
      }
    case ACTIONS.CLEAR: 
      return {
        ...state, 
        currentOperand: null, 
        previousOperand: null, 
        operation: null, 
        overwrite: null
      }
  }
}

// evluate() helper function for ACTIONS.EVALUATE
function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}

// formatting the number helper part
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})
function formatOperand(operand) {
  if(operand == null) return
  const [integer, decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


/* The Main App Function Component */
function App() {

  // useReducer
  const [{currentOperand, previousOperand, operation, historyTextArr}, dispatch] = useReducer(reducer, {historyTextArr: []})

  return (
    <div className="root">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
      <div className="history">
        {historyTextArr}
      </div>
    </div>
  );
}



export default App;
