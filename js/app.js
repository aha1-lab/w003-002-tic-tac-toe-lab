
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

// for(let i = 0; i< winningBoard.length; i++){
//     console.log(winningBoard[i])
// }

let playerTurn = "X"
let winner = false
let tie = false
let counter = 0

const squareElements = document.querySelectorAll(".sqr")
const resetButtonElement = document.querySelector(".reset")
const messageElement = document.querySelector("#message")



function updateMessage(){
    messageElement.textContent = `Player ${playerTurn} turn`
}

updateMessage()

function checkWining(){
    for(let i = 0; i< winningBoard.length; i++){
        let a = winningBoard[i][0]
        let b = winningBoard[i][1]
        let c = winningBoard[i][2]
        if(board[a] === playerTurn && board[b] === playerTurn && board[c] === playerTurn){
            squareElements[a].style.color = "red"
            squareElements[b].style.color = "red"
            squareElements[c].style.color = "red"
            winner = playerTurn
        }else if(counter >=8){
            tie = true
        }
    }
}

const isGameOver = ()=>{
    if(winner){
        messageElement.textContent =`Player ${winner} is the winner`
    }else if(tie){
        messageElement.textContent =`Game is tie`
    }
}

function play(squareTemp, index, playerTurnTemp){
    squareTemp.textContent = playerTurn
    board[index] = playerTurn
    checkWining()
    playerTurn = playerTurnTemp
}
squareElements.forEach((square)=>{
    square.addEventListener('click',()=>{
        let boardIndex = event.target.id
        if(board[boardIndex] === "" && winner === false){
            if(playerTurn === "X"){
                play(square, boardIndex, "O")
            }else{
                play(square, boardIndex, "X")
            }
            updateMessage()
            isGameOver()
            counter +=1
            console.log(board)
        }
    })
})


// Reset the game
resetButtonElement.addEventListener('click',()=>{
    board = ["","","",
        "","","",
        "","",""]
    playerTurn = "X"
    winner = false
    tie = false
    counter = 0
    updateMessage()
    squareElements.forEach((square)=>{
        square.textContent = ""
    })
})

