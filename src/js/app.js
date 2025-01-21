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
const resetAll = document.getElementById('reset-all');
const yearSpan = document.getElementById('current-year');
const buttons = document.querySelectorAll('.button-only');
const humanButton = document.getElementById('human');
const computerButton = document.getElementById('computer');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');

// Variable to check if the game mode has been selected
let gameModeSelected = false;

// Function to check if both inputs are full or if only Player 1 is full (when the mode is “computer”).
const checkInputsAndEnableButton = () => {
  const player1Valid = player1Input.value.trim() !== '';
  const player2Valid = player2Input.style.display !== 'none' ? player2Input.value.trim() !== '' : true;

  // Enable button if both fields have value or only Player 1 has value depending on game mode
  if (gameModeSelected === 'human') {
    // If the mode is “Human”, both players must have one name
    startButton.disabled = !(player1Valid && player2Valid);
  } else if (gameModeSelected === 'computer') {
    // If the mode is “Computer”, only Player 1 must have a name
    startButton.disabled = !player1Valid;
  }
};

// Function to enable the game mode and activate the button
const enableStartButton = (mode) => {
  gameModeSelected = mode; // Sets the selected game mode (human or computer)
  checkInputsAndEnableButton(); // Check if the button can now be enabled.
};

// Adding input events to text fields
player1Input.addEventListener('input', checkInputsAndEnableButton);
player2Input.addEventListener('input', checkInputsAndEnableButton);

// Adding click events to mode selection buttons
humanButton.addEventListener('click', () => enableStartButton('human'));
computerButton.addEventListener('click', () => enableStartButton('computer'));

// Call the function to make sure the button is disabled at startup
startButton.disabled = true;

// Function active buttons
const toggleActiveState = (event) => {
  const button = event.target;

  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
};
buttons.forEach(button => {
  button.addEventListener('click', toggleActiveState);
});

// Function to get the current year
const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  yearSpan.textContent = currentYear
}

// Function to reset all
const reset = () => {
  resetAll.addEventListener('click', () => {
    location.reload();
  });
}

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
    move = easyAI(availableCells); // Easy AI, random move
  } else if (difficulty === 'medium') {
    move = mediumAI(availableCells); // Medium AI, smart move based on available cells
  } else if (difficulty === 'hard') {
    move = hardAI(availableCells); // Hard AI, aggressive strategy
  }

  board[move] = 'O';
  updateBoard();
};

// Function for easy difficulty
const easyAI = (availableCells) => {
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Function for medium difficulty
const mediumAI = (availableCells) => {
  // Try to block the player from winning, otherwise pick randomly
  let move = null;

  // Check for possible player win and block it
  move = findBlockingMove(availableCells, 'X');
  if (move !== null) return move;

  // If no blocking move, pick a random available cell
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Function for hard difficulty
const hardAI = (availableCells) => {
  // Try to win if possible, otherwise block the player
  let move = null;

  // Check for possible AI win and take it
  move = findBlockingMove(availableCells, 'O');
  if (move !== null) return move;

  // If no winning move, check if player can win and block it
  move = findBlockingMove(availableCells, 'X');
  if (move !== null) return move;

  // If no winning or blocking move, pick randomly
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Function to find blocking move
const findBlockingMove = (availableCells, player) => {
  for (let i = 0; i < availableCells.length; i++) {
    const cell = availableCells[i];
    board[cell] = player; // Temporarily make the move
    if (checkWinner(board) === player) {
      board[cell] = null; // Undo the move
      return cell; // Return the blocking move
    }
    board[cell] = null; // Undo the move if no winner
  }
  return null; // No blocking move found
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
reset();
getCurrentYear();
checkInputsAndEnableButton();
