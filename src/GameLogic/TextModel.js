import * as tf from '@tensorflow/tfjs';


export const windowSize= 15;
// --- Step 1: Create and compile the model ---
const model = tf.sequential();

model.add(tf.layers.bidirectional({
  layer: tf.layers.lstm({ units: 20, returnSequences: true }),
  inputShape: [windowSize, 9]  // 10 time steps, each with 9 features
}));

model.add(tf.layers.bidirectional({
  layer: tf.layers.lstm({ units: 20 })  // no returnSequences on final LSTM
}));

model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'categoricalCrossentropy'
});

export function jointOneHotEncode(userMove, opponentMove) {
  const index = 3 * userMove + opponentMove;
  const arr = new Array(9).fill(0);
  if (index >= 0 && index < 9) {
    arr[index] = 1;
  }
  return arr;
}

export function oneHotLabel(move) {
  const arr = [0, 0, 0];
  if (move >= 0 && move < 3) arr[move] = 1;
  return arr;
}

export async function trainStep(prevMoves, actualUserMove) {
  const input = prevMoves.slice(-windowSize).map( ([u, o]) => jointOneHotEncode(u,o));
  const label = oneHotLabel(actualUserMove);

  const xs = tf.tensor3d([input]);  // Shape [1, 9]
  const ys = tf.tensor2d([label]);  // Shape [1, 3]

  await model.trainOnBatch(xs, ys);

  xs.dispose();
  ys.dispose();
}



export function getModel() {
  return model;
}


// import * as tf from '@tensorflow/tfjs';


// // --- Step 1: Create and compile the model ---
// const model = tf.sequential();
// model.add(tf.layers.dense({ inputShape: [9], units: 20, activation: 'relu' }));
// model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

// model.compile({
//   optimizer: tf.train.adam(0.01),
//   loss: 'categoricalCrossentropy',
// });


// export function jointOneHotEncode(userMove, opponentMove) {
//   const index = 3 * userMove + opponentMove;
//   const arr = new Array(9).fill(0);
//   if (index >= 0 && index < 9) {
//     arr[index] = 1;
//   }
//   return arr;
// }

// export function oneHotLabel(move) {
//   const arr = [0, 0, 0];
//   if (move >= 0 && move < 3) arr[move] = 1;
//   return arr;
// }

// export async function trainStep(prevUserMove, prevOpponentMove, actualUserMove) {
//   const input = jointOneHotEncode(prevUserMove, prevOpponentMove);
//   const label = oneHotLabel(actualUserMove);

//   const xs = tf.tensor2d([input]);  // Shape [1, 9]
//   const ys = tf.tensor2d([label]);  // Shape [1, 3]

//   await model.trainOnBatch(xs, ys);

//   xs.dispose();
//   ys.dispose();
// }



// export function getModel() {
//   return model;
// }
