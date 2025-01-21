// src/App.js
import { checkWinner, resetBoard } from './gameLogic.js';

// Initial status of the board
let board = Array(9).fill(null);
let currentPlayer = 'X';
let winner = null;

// Referencia a los elementos del DOM
const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const resetButton = document.querySelector('.reset-button');

// Function to update the interface
const updateBoard = () => {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    if (board[index] === 'X') {
      cell.classList.add('x');
      cell.classList.remove('o');
    } else if (board[index] === 'O') {
      cell.classList.add('o');
      cell.classList.remove('x');
    } else {
      cell.classList.remove('x', 'o');
    }
  });

  // Check if there is a winner
  winner = checkWinner(board);
  if (winner) {
    if (winner === 'draw') {
      message.textContent = "It's a draw!";
    } else {
      message.textContent = `${winner} wins!`;
    }
    return;
  }

  // Change turn
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

// Function to handle cell clicking
const handleClick = (index) => {
  if (board[index] || winner) return; // If there is already a value or a winner, do nothing

  board[index] = currentPlayer;
  updateBoard();
};

// Function to reset the game
const resetGame = () => {
  board = resetBoard();
  winner = null;
  currentPlayer = 'X';
  message.textContent = '';
  updateBoard();
};

// Assign click event to each cell
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleClick(index));
});

// Assign the click event to the reset button
resetButton.addEventListener('click', resetGame);

// Start the game
updateBoard();

