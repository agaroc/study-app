import React from 'react';
import './MCQBox.css';


const MCQBox = ({ question, options, answer, explain, check }) => {
  const options2 = options.slice(1);
  const ansIndex = letterToNumer(answer[0].trim()[0]);
  const letter = answer[0].trim()[0];
  console.log("Letter: " + letter)
  function letterToNumer( letter){
    switch(letter)
    {
      case "A":
      case "a":
        return 0;
      case "B":
      case "b":
        return 1;
      case "C":
      case "c":
        return 2;
      case "D":
      case "d":
        return 3;
      default:
        return null;
    }
  }


  return (
    <div className="mcq-box">
      <div className="mcq-question">{question}</div>
      <div className='mcq-options'>
        {options2.map((option, index) => {                      
          console.log("AI: "+ansIndex)
          console.log("index: "+index)
          return (
            <div key={index} className={check && index === ansIndex ? 'correct-answer' : ''}>
              <input type="radio" name={question} value={option} disabled={check} />
              <label>{option}</label>
            </div>
          );
        })}
      </div>
      {check && (
        <div className="explanation">
          Explanation: {explain}.
        </div>
      )}
    </div>
  );
};

export default MCQBox;
