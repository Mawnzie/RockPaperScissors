
import * as tf from '@tensorflow/tfjs';

import { getModel , jointOneHotEncode ,windowSize} from './textModel';  // import the accessor


export function getMove(prediction){
  switch(prediction){
    case 0:
      return 1;
    case 1: 
      return 2;
    case 2:
      return 0;
  }

}

// export function predict(prevUserMove, prevOpponentMove) {
//   const model = getModel();  
//   if (!model) {
//     // If model is not initialized yet, fallback to random
//     return Math.floor(Math.random() * 3);
//   }

//   const inputArr = jointOneHotEncode(prevUserMove, prevOpponentMove);
//   const inputTensor = tf.tensor2d([inputArr]); // shape [1, 9]

//   const outputTensor = model.predict(inputTensor); // shape [1, 3]
//   const outputData = outputTensor.dataSync(); // get probabilities as typed array

//   console.log('Model prediction:', outputData);

//   inputTensor.dispose();
//   outputTensor.dispose();

//   // Find the index with the highest probability
//   let maxIndex = 0;
//   let maxProb = outputData[0];
//   for (let i = 1; i < outputData.length; i++) {
//     if (outputData[i] > maxProb) {
//       maxProb = outputData[i];
//       maxIndex = i;
//     }
//   }

//   return maxIndex; // 0=Rock, 1=Paper, 2=Scissors
// }

export function predict(moves) {
  const model = getModel();  
  if (!model) {
    // If model is not initialized yet, fallback to random
    return Math.floor(Math.random() * 3);
  }

  
  if (moves.length>= windowSize){
    const lastMoves = moves.slice(-windowSize); // array of [userMove, opponentMove]
    const sequence = lastMoves.map(([u, o]) => jointOneHotEncode(u, o)); // shape [10, 9]
    const inputTensor = tf.tensor3d([sequence], [1, windowSize, 9]); // shape [1, 10, 9]

    const outputTensor = model.predict(inputTensor); // shape [1, 3]
    const outputData = outputTensor.dataSync(); // get probabilities as typed array

    console.log('Model prediction:', outputData);

    inputTensor.dispose();
    outputTensor.dispose();

    // Find the index with the highest probability
    let maxIndex = 0;
    let maxProb = outputData[0];
    for (let i = 1; i < outputData.length; i++) {
      if (outputData[i] > maxProb) {
        maxProb = outputData[i];
        maxIndex = i;
      }
    }
    return maxIndex; // 0=Rock, 1=Paper, 2=Scissors
} else {
  return Math.floor(Math.random() * 3);
}
}

  


export function createOpponent() {
  return {
    predict
  };
}

export function getWinner(userMove, opponentMove) {
  if (userMove === opponentMove) return 'draw';

  // Rock beats Scissors → (0 - 2 + 3) % 3 === 1
  // Paper beats Rock → (1 - 0 + 3) % 3 === 1
  // Scissors beats Paper → (2 - 1 + 3) % 3 === 1

  return (userMove - opponentMove + 3) % 3 === 1 ? 'user' : 'opponent';
}



