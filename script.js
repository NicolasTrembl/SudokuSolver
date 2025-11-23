var numbersCount = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var currentMode = "WRITE";
var currentSelectedNB = -1;
var KNtoggled = false;
var currentSelectedSq = null;


var squares = document.getElementsByClassName("sudoku-small-square");
for (let index = 0; index < squares.length; index++) {
    const square = squares[index];
    square.addEventListener('click', function() {
        if (
            currentSelectedSq == null || 
            square.id != `sq${currentSelectedSq[0]}x${currentSelectedSq[1]}`
        ) {
            if (currentSelectedSq != null) {
                document.getElementById(
                    `sq${currentSelectedSq[0]}x${currentSelectedSq[1]}`
                ).classList.remove("selected-square");
            }

            currentSelectedSq = square.id.slice(2).split('x').map(
                (nb) => parseInt(nb)
            );
            square.classList.add("selected-square");
        }
    });
}

var numbers = document.getElementsByClassName("number-display");
for (let index = 0; index < numbers.length; index++) {
    const number = numbers[index];
    number.addEventListener('click', function() {
        if (currentSelectedSq == null) return;
        let value = number.id.slice(2);
        updateSquare(
            currentSelectedSq[0], currentSelectedSq[1], value
        );
    });
}

function moveSelectedSq() {
    document.getElementsByClassName("selected-square")[0].classList
        .remove("selected-square");
    
    document.getElementById(
        `sq${currentSelectedSq[0]}x${currentSelectedSq[1]}`
    ).classList.add("selected-square");
}

document.addEventListener('keydown', function (ev){
    if (currentSelectedSq == null) return;
    switch (ev.key) {
        case "ArrowUp":
            if (currentSelectedSq[1] > 0) {
                currentSelectedSq[1]--;
                moveSelectedSq();
            }
            break;
        case "ArrowDown":
            if (currentSelectedSq[1] < 8) {
                currentSelectedSq[1]++;
                moveSelectedSq();
            }
            break;
        case "ArrowLeft":
            if (currentSelectedSq[0] > 0) {
                currentSelectedSq[0]--;
                moveSelectedSq();
            }
            break;
        case "ArrowRight":
            if (currentSelectedSq[0] < 8) {
                currentSelectedSq[0]++;
                moveSelectedSq();
            }
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            updateSquare(
                currentSelectedSq[0], currentSelectedSq[1], parseInt(ev.key)
            );
            break;
        case "Backspace": 
            updateSquare(
                currentSelectedSq[0], currentSelectedSq[1], 0
            );
        default:
            break;
    }
});

document.getElementById("eraseBtn").addEventListener('click', function (){
    if (currentSelectedSq != null) {
        updateSquare(currentSelectedSq[0], currentSelectedSq[1], 0);
    }
});


function updateNumberCount() {
    numbersCount.fill(9, 0, 9);
    for (let x = 0; x < 9; x++) {
        for (let y = 1; y < 9; y++) {
            let square = document.getElementById(`sq${x}x${y}`);
            if (square.innerHTML.length == 1) {
                numbersCount[parseInt(square.innerHTML)-1]--;
            }
        }
    }

    for (let index = 0; index < 9; index++) {
        const element = numbersCount[index];
        let indicator = document.getElementById(`count_nb_${index+1}`);
        indicator.innerText = element;
    }
}

function updateSquare(x, y, value) {
    // find actual Square
    let sq = document.getElementById(`sq${x}x${y}`);

    switch (currentMode) {
        case "WRITE":
            if (value == 0) {
                sq.innerHTML = '';
            } else {
                sq.innerHTML = value;
            }
            updateNumberCount();
            break;
        default:
            break;
    }
}

function resetAll() {
    numbersCount.fill(9, 9);
}




resetAll();

