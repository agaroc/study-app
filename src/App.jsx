/*
Caleb Ng
CS 4990
*/
import React, { useState } from 'react';
import './App.css'; 
import TestQuestions from './TestQuestions';
import BeatLoader from "react-spinners/BeatLoader";


const App = () => {
  const [test, setTest] = useState(false);
  const [topic, setTopic] = useState('');
  const [numQ, setNumQ] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [selectedTestType, setSelectedTestType] = useState(''); 
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [checkedTest, setCheckedTest] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleTestTypeChange = (e) => {
      setSelectedTestType(e.target.value);
    
  };


  const generateTest = async () => {
    try {
      setIsLoading(true); 
      setTest(false);
      let prompt = '';
      if(selectedTestType === "mcq")
      {
        console.log("mcq");
        prompt = `Generate ${numQ} multiple choice questions on ${topic}. Add the answer for each question after "Answer" and if it is mcq answer with just the letter and make each option start with a &. Add the explanation after "Explanation". . Make each question start with ~.`
      }
      else
      {
        console.log("Frq");
        prompt = `Generate ${numQ} free response questions on ${topic}. Add the answer for each question after "Answer" and add the explanation after "Explanation".  Make each question start with ~.`
      }
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
            content: prompt
          }
        ],
        max_tokens: 150 * parseInt(numQ),
        model: "gpt-3.5-turbo"
      })
      });
      const data = await response.json();   
      const generatedContent = data.choices[0].message.content;
      //console.log("G: "+ generatedContent);
      const indivQs = generatedContent.split('~').slice(1);
      //console.log("I: "+ indivQs);
      const questionsAndAnswers = indivQs.map(choice => {
      //console.log("C:" +choice);
        let [questionPart, answerAndExplanationPart] = choice.split('Answer:');
        const [question, optionsPart] = questionPart.split('?');
        let [answer, explanation] = answerAndExplanationPart.split('Explanation:');
        // console.log("qp: "+ questionPart);
        // console.log("ae: "+ answerAndExplanationPart);
        // console.log("Question:", question);
        // console.log("Options Part:", optionsPart);
        // console.log("Answer:", answer);
        // console.log("Explanation:", explanation);

        let options = null;
        if (selectedTestType === "mcq") {
          const trimmedOptionsPart = optionsPart.trim();
          options = trimmedOptionsPart.split("&").map(option => option.trim());
          return { question, options, answer: answer.trim(), explanation: explanation.trim() };

        }
        return { question, options, answer: answer.trim(), explanation: explanation.trim() };
      });

      setQuestionsAndAnswers(questionsAndAnswers);
      setTest(true);
      setShowCheckButton(true);
    } catch (error) {
      console.error('Error generating test:', error);
    } finally {
      setIsLoading(false); 
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
        <div className="loading-spinner"> 
          {isLoading ? <p style={{marginTop: '10px', marginRight:'10px'}}>Loading</p>:''}
          <BeatLoader size={10}color={"#0056b3"} loading={isLoading} />
        </div>
        {test && <TestQuestions testType={selectedTestType} questionsAndAnswers={questionsAndAnswers} checkedTest={checkedTest} />}
        {!test && !isLoading && <div className="empty-test">Please Generate a Test</div>}
        {showCheckButton && <button onClick={handleCheckTest} className="check-test-button">Check Test</button>}
      </div>
      <div className="sidebar">
        <h1 className="title">Test Generator</h1>
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="input-field"
          disabled={test}
        />
       <select
          value={selectedTestType}
          onChange= {handleTestTypeChange}
          className="input-select-field"
          disabled={test}
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
           disabled={test}
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
