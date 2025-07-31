import './index.css';
import {Container,Row,Col,ButtonGroup,Button} from 'react-bootstrap';
import { useState  } from 'react';
import MyButton from './components/MyButton';
import { createOpponent , getWinner } from './GameLogic/opponent';
import Modal from './components/Modal';
import {trainStep} from './GameLogic/TextModel';

const opponent = createOpponent();


function App() {
  const [currentMove, setCurrentMove] = useState();
  const [moves, setMoves] = useState([]);
  const [opponentMove,setOpponentMove]=useState();
  const [winner,setWinner] = useState();
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);


  const movesArray = ['Rock', 'Paper', 'Scissors'];

  
  const handleButtonClick = async (move) => {
    const currentMoveIndex = movesArray.indexOf(move);
    const prevUserMove = moves.length > 0 ? moves[moves.length - 1][0] : 0;
    const prevOpponentMove = moves.length > 0 ? moves[moves.length - 1][1] : 0;
    const prediction = opponent.predict(prevUserMove,prevOpponentMove);
    const result = getWinner(currentMoveIndex, prediction); // ← calculate result immediately

    // Update opponent model (optional logic order)
    //opponent.update([currentMoveIndex, prediction], moves);
    setMoves((prev) => [...prev, [currentMoveIndex, prediction]])

    await trainStep(prevUserMove,prevOpponentMove,currentMoveIndex);

    // Update state
    setCurrentMove(currentMoveIndex);
    setOpponentMove(prediction);

    // Score logic — based on immediate `result`
    if (result === 'user') {
      setUserScore(prev => prev + 1);
    } else if (result === 'opponent') {
      setOpponentScore(prev => prev + 1);
    }
};


  const result = getWinner(currentMove, opponentMove);

  


return (
    <div className="body">
      
      <h1 className="gameHeader">
        Rock Paper Scissors 
      </h1>
        <div className="button-group">
         <ButtonGroup aria-label="Basic example">
          {/* {choicesArray.map((choice, index) =>  {return <MyButton key={index} choice={choice} setChoices={setChoices}/>})} */}
           {movesArray.map((move, index) =>  
            (<Button key={index} onClick={()=> handleButtonClick(move)}> {move} </Button>
            ))}

      </ButtonGroup>
      </div>

      <Container  style={{ marginTop: "20px" }}>
        <Row>
         <Col className="choice" > Your move: {movesArray[currentMove]} </Col>
        <Col className="choice">Opponent's move: {movesArray[opponentMove]}</Col>

        </Row>
        <Row>
        <Col className="choice">
          {
            result === 'user' ? 'You won' :
            result === 'opponent' ? 'Opponent won' :
            result === 'draw' ? "It's a draw" :
            "–"
          }
        </Col>         

        </Row>
    
          <Row>
            <Col className="score">Your Score: {userScore}</Col>
            <Col className="score">Opponent Score: {opponentScore}</Col>
          </Row>
        
      </Container>

    </div>
  );
}

export default App;


