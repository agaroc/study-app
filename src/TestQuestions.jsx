import React from 'react';
import FRQBox from './FRQBox';
import MCQBox from './MCQBox';
import { useEffect } from 'react';
import './TestQuestions.css'
const TestQuestions = ({ testType, questionsAndAnswers, checkedTest }) => {

useEffect(() => {
    }, [checkedTest]);
return (
    <div className='test-questions'>
      {testType === 'mcq' && questionsAndAnswers.map((qa, index) => (
        <MCQBox
          key={index}
          question={qa.question}
          options={qa.options}
          answer={qa.answer}
          explain={qa.explanation}
          check={checkedTest}
        />
      ))}
      {testType === 'frq' && questionsAndAnswers.map((qa, index) => (
        <FRQBox
          key={index}
          question={qa.question}
          answer={qa.answer}
          explain={qa.explanation}
          check={checkedTest}
        />
      ))}
    </div>
  );
};

export default TestQuestions;
