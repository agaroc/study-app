// netlify/functions/generateQuiz.js
const axios = require('axios');

exports.handler = async (event, context) => {
  const { numQ, topic, selectedTestType } = JSON.parse(event.body);

  if (!numQ || !topic || !selectedTestType) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' }),
    };
  }

  let prompt = '';
  if (selectedTestType === 'mcq') {
    prompt = `Generate ${numQ} multiple choice questions on ${topic}. Add the answer for each question after "Answer" and if it is mcq answer with just the letter and make each option start with a &. Add the explanation after "Explanation". Make each question start with ~.`;
  } else {
    prompt = `Generate ${numQ} free response questions on ${topic}. Add the answer for each question after "Answer" and add the explanation after "Explanation". Make each question start with ~.`;
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      max_tokens: 150 * parseInt(numQ),
      model: 'gpt-3.5-turbo',
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const generatedContent = response.data.choices[0].message.content;
    const indivQs = generatedContent.split('~').slice(1);
    const questionsAndAnswers = indivQs.map(choice => {
      let [questionPart, answerAndExplanationPart] = choice.split('Answer:');
      const [question, optionsPart] = questionPart.split('?');
      let [answer, explanation] = answerAndExplanationPart.split('Explanation:');

      let options = null;
      if (selectedTestType === 'mcq') {
        const trimmedOptionsPart = optionsPart.trim();
        options = trimmedOptionsPart.split('&').map(option => option.trim());
      }

      return {
        question: question.trim(),
        options,
        answer: answer ? answer.trim() : '',
        explanation: explanation ? explanation.trim() : '',
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ questionsAndAnswers }),
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate quiz' }),
    };
  }
};
