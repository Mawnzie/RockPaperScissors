import * as tf from "@tensorflow/tfjs";

let windowSize = 27;
let model = null;

function createDefaultModel() {
  const m = tf.sequential();

  m.add(
    tf.layers.bidirectional({
      layer: tf.layers.lstm({ units: 20, returnSequences: true }),
      inputShape: [windowSize, 9],
    })
  );

  m.add(
    tf.layers.bidirectional({
      layer: tf.layers.lstm({ units: 20 }),
    })
  );

  m.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  m.compile({
    optimizer: tf.train.adam(0.001),
    loss: "categoricalCrossentropy",
  });

  return m;
}

export function setModel(newModel) {
  if (model) {
    model.dispose();
  }
  if (!newModel.optimizer) {
    newModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: "categoricalCrossentropy",
    });
  }
  model = newModel;

  windowSize = model.inputs[0].shape[1];
}

export function getWindowSize() {
  return windowSize;
}

export function getModel() {
  if (!model) {
    model = createDefaultModel();
  }
  return model;
}

export function jointOneHotEncode(userMove, opponentMove) {
  const index = 3 * userMove + opponentMove;
  const arr = new Array(9).fill(0);
  if (index >= 0 && index < 9) arr[index] = 1;
  return arr;
}

export function oneHotLabel(move) {
  const arr = [0, 0, 0];
  if (move >= 0 && move < 3) arr[move] = 1;
  return arr;
}

export async function trainStep(prevMoves, actualUserMove) {
  const m = getModel();
  const input = prevMoves
    .slice(-windowSize)
    .map(([u, o]) => jointOneHotEncode(u, o));
  const label = oneHotLabel(actualUserMove);

  const xs = tf.tensor3d([input]);
  const ys = tf.tensor2d([label]);

  await m.trainOnBatch(xs, ys);

  xs.dispose();
  ys.dispose();
}
