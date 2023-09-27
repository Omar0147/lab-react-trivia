import React, { useState, useEffect } from "react";
import axios from 'axios';
import ResultCard from "./components/ResultCard";
import QuestionCard from "./components/QuestionCard";
import { shuffleArray } from "./lib/utils";

function App() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionData, setQuestionData] = useState(null);

  // Function to fetch a new question from the API
  const fetchQuestion = () => {
    axios.get('https://opentdb.com/api.php?amount=1&category=9&type=multiple')
      .then(response => {
        const result = response.data.results[0];
        const answers = [...result.incorrect_answers, result.correct_answer];
        setQuestionData({
          question: result.question,
          options: answers,
          correctAnswer: result.correct_answer
        });
        setSelectedAnswer(null); // Reset the selected answer
      });
  };

  // Fetch the initial question when the component is mounted
  useEffect(fetchQuestion, []); 

  // Function to set the selected answer
  const selectAnswer = (selection) => {
    setSelectedAnswer(selection);
  };

  // If there is no question data yet, display a loading message
  if (!questionData) {
    return <p>Loading...</p>;
  }

  let card;
  let options = shuffleArray(questionData.options);

  // Determine whether to show the question card or the result card
  if (selectedAnswer) {
    card = (
      <ResultCard
        correct={selectedAnswer === questionData.correctAnswer}
        answer={questionData.correctAnswer}
      />
    );
  } else {
    card = (
      <QuestionCard
        question={questionData.question}
        options={options}
        selectAnswer={selectAnswer}
      />
    );
  }

  return (
    <div className="w-100 my-5 d-flex justify-content-center align-items-center">
      <div style={{ maxWidth: "45%" }}>
        <h1 className="text-center">Trivia App</h1>
        {/* Button to fetch the next question */}
        <button className="btn btn-success" onClick={fetchQuestion}>Next Question</button>
        {card}
      </div>
    </div>
  );
}

export default App;
