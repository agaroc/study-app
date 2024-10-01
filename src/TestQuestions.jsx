/*Caleb Ng 
Component for handling the type of question and displaying it
*/
import React from 'react';
import FRQBox from './frq_question/FRQBox'
import MCQBox from './mcq_question/MCQBox';
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
