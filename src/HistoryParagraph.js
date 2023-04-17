import { ACTIONS } from "./App"

export default function HistoryParagraph({previousOperand, currentOperand, operation, evaluation, dispatch}) {
    let text = `${previousOperand} ${operation} ${currentOperand} = ${evaluation}`
    return (
        <p onClick={() => dispatch({type: ACTIONS.RETURN_HISTORY, payload: {evaluation}})}>{text}</p>
    )
}


