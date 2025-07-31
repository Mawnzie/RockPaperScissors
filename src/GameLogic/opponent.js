
import * as tf from '@tensorflow/tfjs';

import { getModel , jointOneHotEncode } from './TextModel';  // import the accessor


export function predict(prevUserMove, prevOpponentMove) {
  const model = getModel();  
  if (!model) {
    // If model is not initialized yet, fallback to random
    return Math.floor(Math.random() * 3);
  }

  const inputArr = jointOneHotEncode(prevUserMove, prevOpponentMove);
  const inputTensor = tf.tensor2d([inputArr]); // shape [1, 9]

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



