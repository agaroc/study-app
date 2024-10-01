/*
Caleb Ng
Logic for FRQ answer
*/
import React from 'react';
import './FRQBox.css';

//similar to MCQBox
const FRQBox = ({ question, answer, explain, check }) => {
  console.log(answer);
  return (
    <div className="frq-box">
      <div className="frq-question">{question}</div>
      <textarea className="frq-answer" placeholder="Your answer..." />
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

export default FRQBox;
