var OriginalBoard;
const human = 'O';
const computer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
Startgame();

function Startgame() {
	document.querySelector(".endgame").style.display = "none";
	OriginalBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.backgroundColor ="#838888"
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof OriginalBoard[square.target.id] == 'number') {
		turn(square.target.id, human)
		if (!checkWin(OriginalBoard, human) && !checkTie()) turn(bestSpot(), computer);
	}
}

function turn(squareId, player) {
	OriginalBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	if(player==human){

	document.getElementById(squareId).style.backgroundColor ="#ECAF4F"}
	else{
		document.getElementById(squareId).style.backgroundColor ="#DC685A"

	}

	let gameWon = checkWin(OriginalBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
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
	declareWinner(gameWon.player == human ? "🎆🎉  yeee! You win!" : "😂 You lose.😎");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return OriginalBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(OriginalBoard, computer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner(" 🥱  Tie Game!")
		return true;
	}
	return false;
}

function minimax(TempBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(TempBoard, human)) {
		return {score: -10};
	} else if (checkWin(TempBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = TempBoard[availSpots[i]];
		TempBoard[availSpots[i]] = player;

		if (player == computer) {
			var result = minimax(TempBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(TempBoard, computer);
			move.score = result.score;
		}

		TempBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
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