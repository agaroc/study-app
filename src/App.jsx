/*
Caleb Ng
CS 4990
*/
import React, { useState } from 'react';
import './App.css'; 
import TestQuestions from './TestQuestions';
import BeatLoader from "react-spinners/BeatLoader";   //import animation for loader


const App = () => {
  const [test, setTest] = useState(false);
  const [topic, setTopic] = useState('');
  const [numQ, setNumQ] = useState('');
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);   //all states needed and variables for the app
  const [selectedTestType, setSelectedTestType] = useState(''); 
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [checkedTest, setCheckedTest] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleTestTypeChange = (e) => {
      setSelectedTestType(e.target.value);      //select the test type
  };


  const generateTest = async () => {
    try {
      setIsLoading(true);     //start loading animation
      setTest(false);     //no test yet
      const requestBody = {
        numQ,
        topic,
        selectedTestType,
      };
  
      const response = await fetch('/.netlify/functions/generatequiz', { // Call the serverless function
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }
      console.log("data: " + data);

  
      const { questionsAndAnswers } = data;

      console.log(questionsAndAnswers);

      setQuestionsAndAnswers(questionsAndAnswers);    //showing the test
      setTest(true);
      setShowCheckButton(true);   //allow user to use the check test button
    } catch (error) {
        console.error('Error generating test:', error);
    } finally {
      setIsLoading(false); //loading is done
    }
  };

  const handleCheckTest = () => {
    setCheckedTest(true);
  };

  const handleResetTest = () => {
    setTest(false);
    setTopic('');
    setNumQ('');
    setQuestionsAndAnswers([]);   //set everything back to the original state
    setSelectedTestType('');
    setShowCheckButton(false);
    setCheckedTest(false);
  }

  return (
    <div className="app">
      <div className="main-section">
        <div className="loading-spinner">   {/* Area that either shows no test or the test*/}
          {isLoading ? <p style={{marginTop: '10px', marginRight:'10px'}}>Loading</p>:''}
          <BeatLoader size={10}color={"#0056b3"} loading={isLoading} />
        </div>
        {test && <TestQuestions testType={selectedTestType} questionsAndAnswers={questionsAndAnswers} checkedTest={checkedTest} />}
        {!test && !isLoading && <div className="empty-test">Please Generate a Test</div>}
        {showCheckButton && <button onClick={handleCheckTest} className="check-test-button">Check Test</button>}
      </div>
      <div className="sidebar">    {/* Area for selecting test type, number of questions, and topic*/ }
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
