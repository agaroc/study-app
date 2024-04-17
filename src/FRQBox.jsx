import React from 'react';
import './FRQBox.css';


const FRQBox = ({ question, answer, explain, check }) => {
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
