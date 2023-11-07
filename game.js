document.getElementById("minimax").addEventListener("click", startGameAi);

const cells = document.querySelectorAll(".cell");
const playerStatus = document.querySelector("#playerStatus");
const restartBtn = document.querySelector("#restartBtn");

var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
let currentPlayer = 'X';

const winCondition = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

let fieldOption = ["","","","","","","","",""];

let running = false;

startGame();

function startGame() {
    cells.forEach(cell => cell.addEventListener("click", clickedCell));
    restartBtn.addEventListener("click", restartGame);
    playerStatus.textContent = `${currentPlayer}'s turn to play!`;
    running = true;
}

function clickedCell() {
    const indexCell = this.getAttribute("indexCell");
    
    if(fieldOption [indexCell] != "" || !running) {
        return;
    }
    cellUpdate(this, indexCell);
    checkWinner();
}

function cellUpdate(cell, index) {
    fieldOption [index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(isAiGame = false) {
	if (isAiGame) {
		currentPlayer = huPlayer;
	} else {
		currentPlayer = (currentPlayer == "X") ? "O" : "X";
	}
    
    playerStatus.textContent = `${currentPlayer}'s turn to play!`;
}

function checkWinner() {
    let roundWinner = false;

    for (let i = 0; i < winCondition.length; i++) {
        const condition = winCondition[i];
        const cellOne = fieldOption[condition[0]];
        const cellTwo = fieldOption[condition[1]];
        const cellThree = fieldOption[condition[2]];

        if(cellOne == "" || cellTwo == "" || cellThree == "") {
            continue;
        }
        if(cellOne == cellTwo && cellTwo == cellThree) {
            roundWinner = true;
            break;   
    }
}
    if(roundWinner) {
        playerStatus.textContent = `${currentPlayer} is a winner!`
        running = false;
    }
    else if(!fieldOption.includes("")) {
        playerStatus.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}
function restartGame() {
    currentPlayer = "X";
    fieldOption = ["","","","","","","","",""];
    playerStatus.textContent = `${currentPlayer}'s turn to play!`
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

//ai
function startGameAi() {
	playerStatus.textContent = 'Play'
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	changePlayer(true);
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCondition.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer  ? "You win!" : "You lose.");

}

function declareWinner(who) {
	
	document.querySelector("#playerStatus").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Draw!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

