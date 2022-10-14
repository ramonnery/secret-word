// CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// Data
import { wordsList } from "./data/words"

// Components
import { StartScreen } from './components/StartScreen';
import { Game } from './components/Game';
import { GameOver } from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 5

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)]

    const wordsByCateogry = words[category]
    const word = wordsByCateogry[Math.floor(Math.random() * wordsByCateogry.length)]

    return [word, category]
  }, [words])

  const startGame = useCallback(() => {
    cleartLetterStates()

    // Pegar palavra e pegar categoria
    const [word, category] = pickWordAndCategory()

    // Criando uma array de letras
    let wordLetters = word.toLowerCase().split("")

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // Checando se a letra já foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters(actualGuessedLetters => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters(actualWrongLetters => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses(actualGuesses => actualGuesses - 1)
    }

  }

  const cleartLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {

    if(guesses <= 0) {

      // Resetar todos os estados
      cleartLetterStates()

      setGameStage(stages[2].name)
    }

  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    // win conditions
    if(guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore(actualScore => actualScore += 100)

      startGame()
    }

  }, [guessedLetters, letters, startGame])

  const retry = () => {
    
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
