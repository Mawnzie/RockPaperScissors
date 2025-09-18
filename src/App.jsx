import './index.css';
import {Container,Row,Col,ButtonGroup,Button} from 'react-bootstrap';
import { useState  } from 'react';
import MyButton from './components/MyButton';
import { createOpponent, getWinner, getMove } from "./GameLogic/opponent";
import Modal from './components/Modal';
import { trainStep, getWindowSize } from "./GameLogic/textModel";
import SaveButton from "./components/SaveButton";
import FileUploader from "./components/FileUploader";
import * as tf from "@tensorflow/tfjs";
import { setModel } from "./GameLogic/textModel";

const opponent = createOpponent();

function App() {
  const [currentMove, setCurrentMove] = useState();
  const [moves, setMoves] = useState([]);
  const [opponentMove, setOpponentMove] = useState();
  const [winner, setWinner] = useState();
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const movesArray = ["Rock", "Paper", "Scissors"];

  const [isOpen, setIsOpen] = useState(false);

  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;

    try {
      // tf.io.browserFiles expects an array of File objects (json + all bins)
      const loadedModel = await tf.loadLayersModel(tf.io.browserFiles(files));
      setModel(loadedModel); // global replacement

      alert("Model loaded successfully!");
    } catch (err) {
      console.error("Failed to load model:", err);
      alert(
        "Failed to load model. Make sure you selected the .json and all .bin files together."
      );
    }
  };
  const handleButtonClick = async (move) => {
    const windowSize = getWindowSize();
    const currentMoveIndex = movesArray.indexOf(move);
    const prediction = opponent.predict(moves);
    console.log("currentMoveIndex:", currentMoveIndex);
    console.log("prediction", prediction);
    console.log("getMove(prediction):", getMove(prediction));
    const result = getWinner(currentMoveIndex, getMove(prediction)); // ← calculate result immediately
    console.log("result:", result);
    // Update opponent model (optional logic order)
    //opponent.update([currentMoveIndex, prediction], moves);
    setMoves((prev) => [...prev, [currentMoveIndex, prediction]]);

    if (moves.length >= windowSize) {
      await trainStep(moves, currentMoveIndex);
    }

    // Update state
    setCurrentMove(currentMoveIndex);
    setOpponentMove(getMove(prediction));

    // Score logic — based on immediate `result`
    if (result === "user") {
      setUserScore((prev) => prev + 1);
    } else if (result === "opponent") {
      setOpponentScore((prev) => prev + 1);
    }
    setRound((prev) => prev + 1);
  };

  const result = getWinner(currentMove, opponentMove);

  const accuracy = opponentScore / round || 0;

  return (
    <div className="body">
      <h1 className="gameHeader">Rock Paper Scissors</h1>
      <div className="button-group">
        <ButtonGroup aria-label="Basic example">
          {/* {choicesArray.map((choice, index) =>  {return <MyButton key={index} choice={choice} setChoices={setChoices}/>})} */}
          {movesArray.map((move, index) => (
            <Button key={index} onClick={() => handleButtonClick(move)}>
              {move}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col className="choice"> Your move: {movesArray[currentMove]} </Col>
          <Col className="choice">
            Opponent's move: {movesArray[opponentMove]}
          </Col>
        </Row>
        <Row>
          <Col className="choice">
            {result === "user"
              ? "You won"
              : result === "opponent"
              ? "Opponent won"
              : result === "draw"
              ? "It's a draw"
              : "–"}
          </Col>
        </Row>

        <Row>
          <Col className="score">Your Score: {userScore}</Col>
          <Col className="score">Opponent Score: {opponentScore}</Col>
        </Row>
        <Row>
          <Col className="score">Round: {round}</Col>

          <Col className="score">
            Model Accuracy: {(accuracy * 100).toFixed(0)}%
          </Col>
        </Row>
        <div className="button-group">
          <ButtonGroup aria-label="Basic example">
            <SaveButton />
          </ButtonGroup>
        </div>
        <button onClick={() => setIsOpen(true)}>Load </button>
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="gameHeader">Load Game</h2>
          <FileUploader onFilesSelected={handleFilesSelected} />
        </Modal>
      </Container>
    </div>
  );
}

export default App;


