/*
Caleb Ng
CS 4990
*/
import React, { useState } from 'react';
import './App.css'; 
import TestQuestions from './TestQuestions';

const App = () => {
  const [test, setTest] = useState(false);
  const [topic, setTopic] = useState('');
  const [numQ, setNumQ] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [selectedTestType, setSelectedTestType] = useState(''); 
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [checkedTest, setCheckedTest] = useState(false); 

  const handleTestTypeChange = (e) => {
      setSelectedTestType(e.target.value);
    
  };


  const generateTest = async () => {
    try {
      setTest(false);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Generate ${numQ} ${selectedTestType} questions on ${topic}. Add the answer for each question after "Answer" and the explanation after "Explanation".  Also if it is a multiple choice question list them with a period. Seperate each question using ~ before the number of the quesiton.`
          }
        ],
        max_tokens: 150 * parseInt(numQ),
        model: "gpt-3.5-turbo"
      })
      });
      const data = await response.json();   
      const generatedContent = data.choices[0].message.content;
      console.log("G: "+ generatedContent);
      const indivQs = generatedContent.split('~').slice(1);
      console.log("I: "+ indivQs);
      const questionsAndAnswers = indivQs.map(choice => {
        console.log("C:" +choice);
        let [questionPart, answerAndExplanationPart] = choice.split('Answer:');
        const [question, optionsPart] = questionPart.split('?');
        let [answer, explanation] = answerAndExplanationPart.split('Explanation:');

      

        let options = null;
        if (selectedTestType === "mcq") {
          const trimmedOptionsPart = optionsPart.trim();
          options = trimmedOptionsPart.split(/\s(?=[a-dA-D]\.|[a-dA-D]\))/).map(option => option.trim());
          return { question, options, answer: answer.trim(), explanation: explanation.trim() };

        }
        return { question, options, answer: answer.trim(), explanation: explanation.trim() };
      });

      setQuestionsAndAnswers(questionsAndAnswers);
      setTest(true);
      setShowCheckButton(true);
    } catch (error) {
      console.error('Error generating test:', error);
    }
  };

  const handleCheckTest = () => {
    setCheckedTest(true);
  };

  const handleResetTest = () => {
    setTest(false);
    setTopic('');
    setNumQ('');
    setQuestionsAndAnswers([]);
    setSelectedTestType('');
    setShowCheckButton(false);
    setCheckedTest(false);
  }

  return (
    <div className="app">
      <div className="main-section">
        {test && <TestQuestions testType={selectedTestType} questionsAndAnswers={questionsAndAnswers} checkedTest={checkedTest} />}
        {!test && <div className="empty-test">Please Generate a Test</div>}
        {showCheckButton && <button onClick={handleCheckTest} className="check-test-button">Check Test</button>}

      </div>
      <div className="sidebar">
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="input-field"
        />
       <select
          value={selectedTestType}
          onChange= {handleTestTypeChange}
          className="input-field"
        >
          <option value="none">Select a Test Type</option>
          <option value="mcq">Multiple Choice Questions</option>
          <option value="frq">Free Response Questions</option>
        </select>
        <input
           type="text"
           placeholder="Amount of questions"
           value={numQ}
           onChange={(e) => setNumQ(e.target.value)}
           className="input-field"
        />
        {test ? (
          <button onClick={handleResetTest} className="reset-test-button">Reset Test</button>
        ) : (
          <button onClick={generateTest} className="generate-button">Generate Test</button>
        )}
      </div>
    </div>
  );
};

export default App;
