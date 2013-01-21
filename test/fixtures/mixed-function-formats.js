/**
 * A function that adds two numbers.
 * @param {number} num1 The first number to add.
 * @param {number} num2 The second number to add.
 */
function sum (num1, num2) {
  return num1 + num2;
}

/**
 * A function that subtracts one number from another.
 * @param {number} minuend The number to be subratected from.
 * @param {number} subtrahend The number to subract from the minuend.
 */
var subtract = function (minuend, subtrahend) {
  return minuend - subtrahend;
}

var obj = {
  /**
   * A function that multiplies two numbers.
   * @param {number} num1 The first number to multiply.
   * @param {number} num2 The second number to multiply.
   */
  'multiply': function (num1, num2) {
    return num1 * num2;
  }
};
