
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


let gameHistory = []
let redoGameHistory = []
let computerPlayer =  prompt("Please type pc to play with computer or player to play with your friend", "player")

if(computerPlayer === "pc"){
    console.log(computerPlayer)
}
let playerTurn = "X"
let winner = false
let tie = false
let playesScore = [0,0]

const boardElement = document.querySelector(".board")
const squareElements = document.querySelectorAll(".sqr")
const resetButtonElement = document.querySelector("#reset")
const undoButtonElement = document.querySelector("#undo")
const redoButtonElement = document.querySelector("#redo")
const messageElement = document.querySelector("#message")
const resultsDisplayElements = document.querySelectorAll(".results-display")

resetButtonElement.style.visibility = "hidden";

const displayResults = ()=>{
    resultsDisplayElements[0].textContent = playesScore[0]
    resultsDisplayElements[1].textContent = playesScore[1]
}

function updateMessage(){
    messageElement.textContent = `Player ${playerTurn} turn`
}

updateMessage()

function checkWiningCompareBoard(boardTemp){
    winningBoard.forEach((line)=>{
        let a = line[0]
        let b = line[1]
        let c = line[2]
        if(boardTemp[a] === boardTemp[b] && boardTemp[b] === boardTemp[c] && boardTemp[a] !== ""){
            winner = boardTemp[a]
            return true
        }
    })
    let emptyTiles = getEmptyTileIndex(board)
    if(!winner && emptyTiles.length === 0){
        tie = true
        return true
    }
    return false
}

function checkWining(boardTemp){
    winningBoard.forEach((line)=>{
        let a = line[0]
        let b = line[1]
        let c = line[2]
        if(boardTemp[a] === playerTurn && boardTemp[b] === playerTurn && boardTemp[c] === playerTurn){
            // squareElements[a].style.color = "red"
            // squareElements[b].style.color = "red"
            // squareElements[c].style.color = "red"
            winner = playerTurn
            return true
        }
    })
    let emptyTiles = getEmptyTileIndex(board)
    if(!winner && emptyTiles.length === 0){
        tie = true
        return true
    }
    return false
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


// This function use to display the player simpoles and update the 
// board and the history
function play(index, nextPlayerTurn){
    squareElements[index].textContent = playerTurn
    board[index] = playerTurn
    checkWiningCompareBoard(board)
    gameHistory.push(index)
    playerTurn = nextPlayerTurn
    redoGameHistory = []
}


function getEmptyTileIndex(boardTemp){
    let emptyTile = []
    for (let i = 0; i < boardTemp.length; i++) {
        if(boardTemp[i] === ""){
            emptyTile.push(i)
        }
    }

    return emptyTile
}

function computerPlay() {
    if (computerPlayer === "pc" && !winner && !tie) {
        let emptyTiles = getEmptyTileIndex(board);
        if (emptyTiles.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyTiles.length)
            let emptyIndex = emptyTiles[randomIndex];
            play(emptyIndex, "X");
        }
    }
}

// For loop to wait buttons event
squareElements.forEach((square)=>{
    square.addEventListener('click',()=>{
        let boardIndex = event.target.id
        if(board[boardIndex] === "" && winner === false){
            if(playerTurn === "X"){
                play(boardIndex, "O")
                computerPlay()
            }else if (computerPlayer !== "pc"){
                play(boardIndex, "X")
            }
            updateMessage()
            isGameOver()
            displayResults()
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
