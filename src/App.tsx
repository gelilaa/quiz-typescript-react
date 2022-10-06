import React, {useState}from 'react';
import {QuestionCard} from "./components/QuestionCard"
import { fetchQuestions } from './API';
import { Difficulty,QuestionState } from './API';
import "./App.css"
export type AnswerObject ={
  question:string,
  answer: string,
  correct:boolean,
  correctAnswer: string
}
const TOTAL_QUESTIONS=15

function App() {
  const [loading,Setloading]=useState(false)
  const [ questions,Setquestions]= useState<QuestionState[]>([]);
  const [qnumber,Setqnumber]=useState(0)
  const [userAnswer,SetuserAnswer]=useState<AnswerObject[]>([]);
  const [score,Setscore]= useState(0);
  const [gameover,Setgameover]= useState(true)



 
  const startTrivia = async ()=>{
 Setloading(true)
 Setgameover(false)
 const newquestions = await fetchQuestions(TOTAL_QUESTIONS,Difficulty.EASY)
 Setquestions(newquestions)
 Setscore(0)
 SetuserAnswer([])
 Setqnumber(0)
 Setloading(false)
 
  }
  const CheckAnswer =(e:React.MouseEvent<HTMLButtonElement>)=>{
 if(!gameover){
  const answer = e.currentTarget.value
  const correct = questions[qnumber].correct_answer === answer;
  if(correct) Setscore(prev=>prev+1);
  const AnswerObject ={
    question: questions[qnumber].question,
    answer,
    correct,
    correctAnswer: questions[qnumber].correct_answer,
  }
  SetuserAnswer((prev) => [...prev, AnswerObject]);
 }
  }
  const NextQuestion =()=>{
  const nextQuestion = qnumber +1
  if(nextQuestion === TOTAL_QUESTIONS){
    Setgameover(true)
  }else{
    Setqnumber(nextQuestion)
  }


  }
  return (
    <div className="container">
      <h1>General Quiz</h1>
      {gameover || userAnswer.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) : null}

      {!gameover ? <p className="score">Score:{score}</p> : null}
      {loading && <p className="loader">Loading questions...</p>}
      {!loading && !gameover && (
        <QuestionCard
          questionNr={qnumber + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[qnumber].question}
          answers={questions[qnumber].answers}
          userAnswer={userAnswer ? userAnswer[qnumber] : undefined}
          callback={CheckAnswer}
        />
      )} 
      {!gameover &&
      !loading &&
      userAnswer.length === qnumber + 1 &&
      qnumber !== TOTAL_QUESTIONS - 1 ? (
        <button className="next start" onClick={NextQuestion}>
          Next Question
        </button>
      ) : null}
    
    </div>
  );
}

export default App;
