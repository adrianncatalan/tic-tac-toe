import { checkWinner, resetBoard } from './gameLogic.js';

// Initial state
let board = Array(9).fill(null);
let currentPlayer = 'X'; // The player who starts
let winner = null;
let gameMode = ''; // 'human' or 'computer'
let difficulty = 'easy'; // Difficulty of the computer
let player1 = '';
let player2 = '';

// DOM element references
const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const resetButton = document.querySelector('.reset-button');
const backButton = document.querySelector('#back-button');
const gameSection = document.querySelector('#game');
const modal = document.querySelector('#modal');
const startButton = document.querySelector('#start');
const winnerMessage = document.querySelector('.winner');
const player2Section = document.querySelector('#player2-section');
const difficultySection = document.querySelector('#difficulty-section');
const validationModal = document.querySelector('#validation-modal'); // Validation modal
const validationMessage = document.querySelector('#validation-message');
const closeValidationModalButton = document.querySelector('#close-validation-modal');

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
      winnerMessage.textContent = '';
    } else {
      message.textContent = `${winner} wins!`;
      winnerMessage.textContent = winner === 'X' ? player1 : player2;
    }
    return;
  }

  // Change turn
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // If the game is against the computer, make its move
  if (gameMode === 'computer' && currentPlayer === 'O') {
    computerMove();
  }
};

// Function to handle clicks on cells
const handleClick = (index) => {
  if (board[index] || winner) return; // If there's already a value or a winner, do nothing

  board[index] = currentPlayer;
  updateBoard();
};

// Function to make a computer move
const computerMove = () => {
  let availableCells = board.map((val, index) => val === null ? index : null).filter(val => val !== null);
  let move;
  if (difficulty === 'easy') {
    move = availableCells[Math.floor(Math.random() * availableCells.length)];
  } else if (difficulty === 'medium') {
    move = mediumAI(availableCells);
  } else if (difficulty === 'hard') {
    move = hardAI(availableCells);
  }

  board[move] = 'O';
  updateBoard();
};

// Function for medium difficulty
const mediumAI = (availableCells) => {
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Function for hard difficulty
const hardAI = (availableCells) => {
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Function to reset the game
const resetGame = () => {
  board = resetBoard();
  winner = null;
  currentPlayer = 'X'; // Always start with X
  message.textContent = '';
  winnerMessage.textContent = '';
  updateBoard();
};

// Function to go back to the menu
const backToMenu = () => {
  modal.style.display = 'flex'; // Show the modal
  gameSection.style.display = 'none'; // Hide the game section
  resetGame(); // Reset the game
};

// Function to start the game
const startGame = () => {
  player1 = document.querySelector('#player1').value.trim();

  // If the game is against the computer, Player 2 is not needed
  player2 = gameMode === 'human' ? document.querySelector('#player2').value.trim() : 'Computer';

  // Only ask for difficulty if the game is against the computer
  difficulty = gameMode === 'computer' ? document.querySelector('#difficulty').value : 'easy';

  // Validate that Player 1 has a name
  if (!player1) {
    showValidationModal('Player 1 must have a name!');
    return;
  }

  // If the game is in "human" mode, validate that Player 2 has a name
  if (gameMode === 'human' && !player2) {
    showValidationModal('Player 2 must have a name!');
    return;
  }

  // Randomly determine who starts
  currentPlayer = Math.random() < 0.5 ? 'X' : 'O';  // 50% chance for X or O to start

  // If the game is against the computer, make its move if it's its turn
  if (gameMode === 'computer' && currentPlayer === 'O') {
    computerMove();
  }

  // Hide the modal and show the game
  modal.style.display = 'none'; // Hide the game mode modal
  gameSection.style.display = 'block'; // Show the game
  resetGame(); // Reset the game
};

// Function to show the validation modal
const showValidationModal = (message) => {
  validationMessage.textContent = message; // Set the error message
  validationModal.style.display = 'flex'; // Show the modal
};

// Function to close the validation modal
closeValidationModalButton.addEventListener('click', () => {
  validationModal.style.display = 'none'; // Close the validation modal
});

// Assign the click event to each cell
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleClick(index));
});

// Assign the click event to the reset button
resetButton.addEventListener('click', resetGame);

// Assign the click event to the back to menu button
backButton.addEventListener('click', backToMenu);

// Assign the click event to the start button
startButton.addEventListener('click', startGame);

// Assign opponent choice buttons
document.querySelector('#human').addEventListener('click', () => {
  gameMode = 'human';
  document.querySelector('#player2-section').classList.remove('hidden');
  document.querySelector('#difficulty-section').classList.add('hidden');
});

document.querySelector('#computer').addEventListener('click', () => {
  gameMode = 'computer';
  document.querySelector('#player2-section').classList.add('hidden');
  document.querySelector('#difficulty-section').classList.remove('hidden');
});

// Start the game
updateBoard();
