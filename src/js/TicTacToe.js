import { checkWinner, resetBoard } from './gameLogic.js';

class TicTacToe {
    constructor() {
        // Initial state
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.gameMode = ''; // 'human' or 'computer'
        this.difficulty = 'easy';
        this.player1 = '';
        this.player2 = '';
        this.gameModeSelected = false;
        this.player1Score = 0;
        this.player2Score = 0;
        this.isComputerTurn = false;

        // DOM element references
        this.cells = document.querySelectorAll('.cell');
        this.message = document.querySelector('.message');
        this.resetButton = document.querySelector('.reset-button');
        this.backButton = document.querySelector('#back-button');
        this.gameSection = document.querySelector('#game');
        this.modal = document.querySelector('#modal');
        this.startButton = document.querySelector('#start');
        this.winnerMessage = document.querySelector('.winner');
        this.resetAll = document.getElementById('reset-all');
        this.yearSpan = document.getElementById('current-year');
        this.buttons = document.querySelectorAll('.button-only');
        this.humanButton = document.getElementById('human');
        this.computerButton = document.getElementById('computer');
        this.player1Input = document.getElementById('player1');
        this.player2Input = document.getElementById('player2');

        // Initialize game
        this.initializeGame();
    }

    initializeGame() {
        this.addEventListeners();
        this.updateYear();
        this.resetAllButton();
        this.updateBoard();
        this.checkInputsAndEnableButton();
    }

    addEventListeners() {
        // Adding input events
        this.player1Input.addEventListener('input', () => this.checkInputsAndEnableButton());
        this.player2Input.addEventListener('input', () => this.checkInputsAndEnableButton());

        // Adding click events to mode selection buttons
        this.humanButton.addEventListener('click', () => this.enableStartButton('human'));
        this.computerButton.addEventListener('click', () => this.enableStartButton('computer'));

        // Adding click events to other buttons
        this.cells.forEach((cell, index) => cell.addEventListener('click', () => this.handleClick(index)));
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.backButton.addEventListener('click', () => this.backToMenu());
        this.startButton.addEventListener('click', () => this.startGame());
        this.buttons.forEach(button => button.addEventListener('click', (e) => this.toggleActiveState(e)));

        this.humanButton.addEventListener('click', () => {
            this.gameMode = 'human';
            document.querySelector('#player2-section').classList.remove('hidden');
            document.querySelector('#difficulty-section').classList.add('hidden');
        });

        this.computerButton.addEventListener('click', () => {
            this.gameMode = 'computer';
            document.querySelector('#player2-section').classList.add('hidden');
            document.querySelector('#difficulty-section').classList.remove('hidden');
        });
    }

    checkInputsAndEnableButton() {
        const player1Valid = this.player1Input.value.trim() !== '';
        const player2Valid = this.player2Input.style.display !== 'none' ? this.player2Input.value.trim() !== '' : true;

        if (this.gameModeSelected === 'human') {
            this.startButton.disabled = !(player1Valid && player2Valid);
        } else if (this.gameModeSelected === 'computer') {
            this.startButton.disabled = !player1Valid;
        }
    }

    enableStartButton(mode) {
        this.gameModeSelected = mode;
        this.checkInputsAndEnableButton();
    }

    toggleActiveState(event) {
        this.buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    updateYear() {
        const currentYear = new Date().getFullYear();
        this.yearSpan.textContent = currentYear;
    }

    resetAllButton() {
        this.resetAll.addEventListener('click', () => {
            location.reload();
            this.player1Score = 0;
            this.player2Score = 0;
            document.getElementById('player1-score').textContent = `Player 1: 0`;
            document.getElementById('player2-score').textContent = `Player 2: 0`;
        });
    }

    updateBoard() {
        this.cells.forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.classList.toggle('x', this.board[index] === 'X');
            cell.classList.toggle('o', this.board[index] === 'O');
        });

        this.winner = checkWinner(this.board);

        const turnMessage = document.getElementById('turn-message');

        if (this.winner) {
            if (this.winner === 'draw') {
                this.message.textContent = "It's a draw!";
                this.winnerMessage.textContent = '';
            } else {
                if (this.winner === 'X') {
                    this.player1Score++;
                    this.message.textContent = `${this.player1} wins!`;
                } else {
                    this.player2Score++;
                    this.message.textContent = `${this.player2} wins!`;
                }

                this.winnerMessage.textContent = this.winner === 'X' ? this.player1 : this.player2;
                document.getElementById('player1-score').textContent = `Player 1: ${this.player1Score}`;
                document.getElementById('player2-score').textContent = this.gameMode !== 'computer' ? `Player 2: ${this.player2Score}` : `Computer: ${this.player2Score}`;
                this.message.classList.add('animated-message');
            }
            return;
        }

        if (this.gameMode === 'computer') {
            let aux = false;
            if (this.currentPlayer === 'X' && !aux) {
                aux = true;
                turnMessage.textContent = `${this.player1}'s Turn`;
            }

            if (this.currentPlayer === 'O' && aux) {
                aux = false;
                turnMessage.textContent = `Computer's Turn`;
            }
        } else {
            turnMessage.textContent = `${this.currentPlayer === 'X' ? this.player1 : this.player2}'s Turn`;
        }

        if (this.currentPlayer === 'X') {
            if (this.gameMode === 'computer') {
                this.currentPlayer = 'O';
                this.computerMove();
            } else {

                this.currentPlayer = 'O';
            }
        } else {
            this.currentPlayer = 'X';
        }
    }

    handleClick(index) {
        if (this.board[index] || this.winner) return;
        this.board[index] = this.currentPlayer;
        this.updateBoard();
    }

    computerMove() {
        const availableCells = this.board
            .map((val, index) => (val === null ? index : null))
            .filter(val => val !== null);

        let move;

        if (this.difficulty === 'easy') {
            move = this.easyAI(availableCells);
        } else if (this.difficulty === 'medium') {
            move = this.mediumAI(availableCells);
        } else {
            move = this.hardAI(availableCells);
        }

        this.board[move] = 'O';
        this.updateBoard();
        this.currentPlayer = 'X';
    }

    easyAI(availableCells) {
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    mediumAI(availableCells) {
        let move = this.findBlockingMove(availableCells, 'X');
        return move !== null ? move : this.easyAI(availableCells);
    }

    hardAI(availableCells) {
        let move = this.findBlockingMove(availableCells, 'O') ?? this.findBlockingMove(availableCells, 'X');
        return move !== null ? move : this.easyAI(availableCells);
    }

    findBlockingMove(availableCells, player) {
        for (const cell of availableCells) {
            this.board[cell] = player;
            if (checkWinner(this.board) === player) {
                this.board[cell] = null;
                return cell;
            }
            this.board[cell] = null;
        }
        return null;
    }

    resetGame() {
        this.board = resetBoard();
        this.winner = null;
        this.currentPlayer = 'X';
        this.message.textContent = '';
        this.winnerMessage.textContent = '';
        this.updateBoard();
    }

    backToMenu() {
        this.modal.style.display = 'flex';
        this.gameSection.style.display = 'none';
        this.resetGame();
    }

    startGame() {
        this.player1 = this.player1Input.value.trim();
        this.player2 = this.gameMode === 'human' ? this.player2Input.value.trim() : 'Computer';
        this.difficulty = this.gameMode === 'computer' ? document.querySelector('#difficulty').value : 'easy';
        this.currentPlayer = Math.random() < 0.5 ? 'X' : 'O';
        document.getElementById('player1-score').textContent = `Player 1: 0`;
        if (this.gameMode === 'computer') {
            document.getElementById('player2-score').textContent = `Computer: 0`;
        } else {
            document.getElementById('player2-score').textContent = `Player 2: 0`;
        }

        if (this.gameMode === 'computer' && this.currentPlayer === 'O') {
            this.computerMove();
        }

        this.modal.style.display = 'none';
        this.gameSection.style.display = 'block';
        this.resetGame();
    }
}

export default TicTacToe;
