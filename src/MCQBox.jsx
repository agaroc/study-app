import React from 'react';
import './MCQBox.css';


const MCQBox = ({ question, options, answer, explain, check }) => {
  return (
    <div className="mcq-box">
      <div className="mcq-question">{question}</div>
      <div>
          {options.map((option, index) => (
            <div key={index}>
              <input type="radio" name={question} value={option} />
              <label>{option}</label>
            </div>
          ))}
      </div>
      {check && (
        <div className="correct-answer">
          Correct Answer: {answer}
        </div>
      )}
      {check && (
        <div className="explanation">
          Explanation: {explain}.
        </div>
      )}
    </div>
  );
};

export default MCQBox;
