
let board = ["","","",
             "","","",
             "","",""]

let winningBoard = [[0,1,2],
                    [3,4,5],
                    [6,7,8],
                    [0,3,6],
                    [1,4,7],
                    [2,5,8],
                    [0,4,8],
                    [2,4,6]]


let gameHistory = [];
let redoGameHistory = [];
let computerPlayer;
let secondPlayerName;
let firtsPlayerName;
let countdownTimer = false;
// Create a pop-up window to get the play mode and get player name
let userSelection =  prompt("Select the game mode: 1: 2 player, 2:easy , 3: difficult", "3")
if(userSelection=== "1") computerPlayer = ""
else if(userSelection=== "2") computerPlayer = "pc"
else computerPlayer = "sm"
firtsPlayerName =  prompt("Please enter your name", "")
if(userSelection === "1"){
    secondPlayerName =  prompt("Please enter your name", "")
}else{
    secondPlayerName = "PC"
}
console.log(computerPlayer)

let activateTimer =  prompt("Do you want to use timer", "yes")
let playerTurn = "X"
let winner = false
let tie = false
let playesScore = [0,0]

// Get html elements DOM
const boardElement = document.querySelector(".board")
const squareElements = document.querySelectorAll(".sqr")
const resetButtonElement = document.querySelector("#reset")
const undoButtonElement = document.querySelector("#undo")
const redoButtonElement = document.querySelector("#redo")
const messageElement = document.querySelector("#message")
const resultsDisplayElements = document.querySelectorAll(".results-display")
const playerNameElement = document.querySelectorAll(".player-name")

playerNameElement[0].textContent = `${firtsPlayerName} play by X score`
playerNameElement[1].textContent = `${secondPlayerName} play by O score`

resetButtonElement.style.visibility = "hidden";

const displayResults = ()=>{
    resultsDisplayElements[0].textContent = playesScore[0]
    resultsDisplayElements[1].textContent = playesScore[1]
}

function updateMessage(){
    messageElement.textContent = `Player ${playerTurn} turn`
}


updateMessage()

// This function used for timing source https://stackoverflow.com/questions/31106189/create-a-simple-10-second-countdown
let timeleft = 0;
let timerStoperKey = false
if(activateTimer === "yes"){
    timerStoperKey = true
}
let downloadTimer 
if(timerStoperKey){
    downloadTimer = setInterval(function(){
    if(timeleft >= 10){
        countdownTimer = true;
        play(getRoundomIndex(),"O");
        if(computerPlay) computerPlay();
        timeleft = 0;
    }
    if(winner || tie){
        
    }else{
        messageElement.innerHTML = `Player ${playerTurn} turn ➪ time remain: ${10 - timeleft}`
    }
        timeleft += 1;
    }, 1000);
}
function checkWiningCompareBoard(boardTemp){
    for(let line of winningBoard){
        let a = line[0]
        let b = line[1]
        let c = line[2]
        if(boardTemp[a] === boardTemp[b] && boardTemp[b] === boardTemp[c] && boardTemp[a] !== ""){
            return boardTemp[a];
        }
    }
    let emptyTiles = getEmptyTileIndex(boardTemp)
    if(emptyTiles.length === 0){
       return "tie";
    }
    return false;
}


const isGameOver = ()=>{
    if(winner){
        messageElement.textContent =`Player ${winner} is the winner`
        if(winner === 'X') playesScore[0] += 1;
        else if(winner === 'O') playesScore[1] += 1;
    }else if(tie){
        messageElement.textContent =`Game is tie`
    }

    if(winner || tie){
        undoButtonElement.disabled =true;
        redoButtonElement.disabled =true;
        resetButtonElement.style.visibility = "visible";
    }
}

function updateWinner(tempWinner){
    if(tempWinner === "tie"){
        tie = true;
    }else if (tempWinner !== ""){
        winner=tempWinner
    }
}

// This function use to display the player simpoles and update the 
// board and the history
function play(index, nextPlayerTurn){
    squareElements[index].textContent = playerTurn
    board[index] = playerTurn
    updateWinner(checkWiningCompareBoard(board))
    gameHistory.push(index)
    playerTurn = nextPlayerTurn
    redoGameHistory = []
}



function getEmptyTileIndex(boardTemp){
    let emptyTiles = []
    for (let i = 0; i < boardTemp.length; i++) {
        if(boardTemp[i] === ""){
            emptyTiles.push(i)
        }
    }
    return emptyTiles
}

function getRoundomIndex(){
    let emptyTiles = getEmptyTileIndex(board);
        if (emptyTiles.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyTiles.length)
            return emptyTiles[randomIndex];
        }
}
function computerPlay() {
    if (computerPlayer === "pc" && !winner && !tie) {
        play(getRoundomIndex(), "X");
    }
    if( computerPlayer === "sm" && !winner && !tie){
        let index =  bestMove()
        console.log(`sn play ${index}`)
        play(index, "X");
    }
    isGameOver()
    displayResults()
}

// For loop to wait buttons event
squareElements.forEach((square)=>{
    square.addEventListener('click',(event)=>{
        let boardIndex = event.target.id
        if(board[boardIndex] === "" && winner === false){
            if(playerTurn === "X"){
                play(boardIndex, "O")
                computerPlay()
                timeleft = 0;
            }else if (computerPlayer !== "pc"){
                play(boardIndex, "X")
                timeleft = 0;
            }
            // updateMessage()
        }
    })
})


// Reset the game
resetButtonElement.addEventListener('click',()=>{
    board = ["","","",
             "","","",
             "","",""];
    playerTurn = "X";
    winner = false
    tie = false;;
    updateMessage();
    squareElements.forEach((square)=>{
        square.textContent = "";
        // square.style.color = "black";
    })
    gameHistory = []
    redoGameHistory = []
    undoButtonElement.disabled =false;
    redoButtonElement.disabled =false;
    resetButtonElement.style.visibility = "hidden";
    if(timerStoperKey){
        setInterval(downloadTimer(),1000);
    }
    
})

// This function to undo the game
function undoGame(){
    if(gameHistory.length> 0){
        let lastIndexAdded = gameHistory.pop()
        redoGameHistory.push({player:board[lastIndexAdded], index:lastIndexAdded})
        playerTurn = board[lastIndexAdded]
        updateMessage()
        board[lastIndexAdded] = ""
        squareElements[lastIndexAdded].textContent = ""
    }
}

// This function to undo the game
function redoGame(){
    if(redoGameHistory.length> 0){
        let redoObject = redoGameHistory.pop();
        board[redoObject.index] = redoObject.player;
        squareElements[redoObject.index].textContent = redoObject.player;
        gameHistory.push(redoObject.index);
        playerTurn = (redoObject.player === "O") ? "X" : "O";
        updateMessage();
    }
}

redoButtonElement.addEventListener('click', redoGame);
undoButtonElement.addEventListener('click', undoGame);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Use miniMax algorithms
function bestMove(){
    let bestScore = -Infinity
    let bestMove;
    let actions = getActionList(board);

    for(let action of actions){
        board[action] ="O"
        let score = miniMax(board,0, false);
        board[action] =""
        if(score > bestScore){
            bestMove = action;
            bestScore = score;
        }
    }
    return bestMove;
}


function getActionList(boardTemp){
    let actionsList = getEmptyTileIndex(boardTemp);
    return actionsList;

}

function miniMax(boardTemp, depth, isMaximising){
    let winnerTemp = checkWiningCompareBoard(boardTemp)
    if (winnerTemp){
        if(winnerTemp === "tie"){
            return 0;
        }else if(winnerTemp === "O"){
            return 10 - depth;
        }else{
            return depth - 10;
        }
    }

    if (isMaximising){ // if player O maximise the score
        let score = -Infinity;
        let actions = getActionList(boardTemp);
        if (!actions.length) return 0;
        for(const action of actions){
            boardTemp[action] = "O"
            let minmaxScore = miniMax(boardTemp,depth + 1,false)
            boardTemp[action] = ""
            score = Math.max(score, minmaxScore)
        }
        return score;
    }else{ // if player X minimise the score
        let score = Infinity;
        let actions = getActionList(boardTemp);
        if (!actions.length) return 0;
        for(const action of actions){
            boardTemp[action] = "X"
            let minmaxScore = miniMax(boardTemp,depth + 1,true)
            boardTemp[action] = ""
            score = Math.min(score, minmaxScore)
        }
        return score;
    }
}
/////////////////////////////////////////////////
/////////////////////////////////////////////////
