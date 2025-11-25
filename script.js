var numbersCount = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var currentMode = "WRITE";
var currentSelectedNB = -1;
var KNtoggled = false;
var currentSelectedSq = null;


var knBtn = document.getElementById("toggleKN");
var writeBtn = document.getElementById("write");
var noteBtn = document.getElementById("note");
knBtn.addEventListener("change", function (ev){
    KNtoggled = ev.currentTarget.checked;
    if (currentMode == "NOTE") {
        writeBtn.checked = true;
        currentMode = "WRITE";
    }
});
knBtn.checked = false;
writeBtn.checked = true;
writeBtn.addEventListener("click", function() {
    currentMode = "WRITE";
});
noteBtn.addEventListener("click", function() {
    currentMode = "NOTE";
    if (KNtoggled) {
        knBtn.checked = false;
        KNtoggled = false;
    }
});

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


function checkForVictory() {
    // Square Check
    let squares = document.querySelectorAll(".sudoku-big-square");
    squares.forEach(square => {
        let txt = square.innerText.replaceAll("\n", "");
        for (let i = 1; i <= 9; i++) {
            if (!txt.includes(`${i}`)) {
                console.log("square check sq", square);
                return false;
            }
        }
    });

    // H check 
    for (let y = 0; y < 9; y++) {
        let line = "";
        for (let x = 0; x < 9; x++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            line += sq.innerText;
        }
        for (let i = 1; i <= 9; i++) {
            if (!line.includes(`${i}`)) {
                console.log("H check at", y);
                return false;
            }
        }  
    } 
    
    // V check 
    for (let x = 0; x < 9; x++) {
        let line = "";
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            line += sq.innerText;
        }
        for (let i = 1; i <= 9; i++) {
            if (!line.includes(`${i}`)) {
                console.log("V check at", x);
                return false;
            }
        }  
    } 

    return true;
}

function updateNumberCount() {
    numbersCount.fill(9, 0, 9);
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let square = document.getElementById(`sq${x}x${y}`);
            if (square.innerHTML.length == 1) {
                numbersCount[parseInt(square.innerHTML)-1]--;
            }
        }
    }

    let checkSolved = true;

    for (let index = 0; index < 9; index++) {
        const element = numbersCount[index];
        let indicator = document.getElementById(`count_nb_${index+1}`);
        indicator.innerText = element;
        if (numbersCount[index] != 0) checkSolved = false;
    }


    if (checkSolved) {
        if (checkForVictory()) alert("YOU WON!!!!!");
    }

}

function updateSquare(x, y, value) {
    // find actual Square
    let sq = document.getElementById(`sq${x}x${y}`);

    switch (currentMode) {
        case "WRITE":
            if (sq.classList.contains("known-number") && !KNtoggled) break;

            if (value == 0) {
                sq.innerHTML = '';
                sq.classList.remove("known-number");
            } else {
                sq.innerHTML = value;
                if (KNtoggled) {
                    sq.classList.add("known-number");
                }
            }
            sq.classList.remove("note-holder");
            
            updateNumberCount();
            break;
        case "NOTE":
            if (sq.classList.contains("known-number") && !KNtoggled) break;

            if (value == 0 || !sq.innerHTML.includes("<p>")) {
                sq.classList.add("note-holder");
                sq.innerHTML = "<p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p>"
            }

            if (KNtoggled) break;

            if (value) {
                if (sq.innerHTML[3+(value-1)*8] !== `${value}`) {
                    sq.innerHTML = sq.innerHTML.slice(0, 3+(value-1)*8) + `${value}`
                        + sq.innerHTML.slice(4+(value-1)*8, sq.innerHTML.length) ;
                } else {
                    sq.innerHTML = sq.innerHTML.slice(0, 3+(value-1)*8) + " "
                        + sq.innerHTML.slice(4+(value-1)*8, sq.innerHTML.length) ;
                }
            }
            

            break;
        default:
            break;
    }
}

function resetAll() {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            sq.classList.remove("known-number");
            sq.innerHTML = "";
        }
    }
    updateNumberCount();
}

function restart() {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("known-number")) continue;
            sq.innerHTML = "";
        }
    }
    updateNumberCount();
}


document.getElementById("resetBtn").addEventListener("click", resetAll);
document.getElementById("restartBtn").addEventListener("click", restart);

function updateSquaresSolve(knlist) {
    knlist.forEach(sq => {
        let pos = sq.id.slice(2).split("x");
        // Update square
        for (let x = 0; x < 9; x += 3) {
            for (let y = 0; y < 9; y += 3) {
                if (x <= pos[0] && pos[0] <= x + 2 && y <= pos[1] && pos[1] <= y + 2) {
                    for (let x_ = x; x_ <= x + 2; x_++) {
                        for (let y_ = y; y_ <= y + 2; y_++) {
                            if (x_ == pos[0] && y_ == pos[1]) continue;
                            let square = document.getElementById(`sq${x_}x${y_}`);
                            square.innerHTML = square.innerHTML.replaceAll(sq.innerText, ' ');
                        }
                    }
                }

            }
        }

        // Update H line
        for (let x = 0; x < 9; x++) {
            if (x == pos[0]) continue;
            let square = document.getElementById(`sq${x}x${pos[1]}`);
            square.innerHTML = square.innerHTML.replaceAll(sq.innerText, ' ');
        }
        
        // Update V line
        for (let y = 0; y < 9; y++) {
            if (y == pos[1]) continue;
            let square = document.getElementById(`sq${pos[0]}x${y}`);
            square.innerHTML = square.innerHTML.replaceAll(sq.innerText, ' ');
        }
    });
    
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("known-number")) {
                continue;
            }
            if (sq.innerText.length == 1) {
                sq.innerHTML = sq.innerText;
                sq.classList.remove("note-holder");
            }
        }
    }
}

function searchForOnlyOptionSolve() {
    // Squares
    for (let x = 0; x < 9; x += 3) {
        for (let y = 0; y < 9; y += 3) {
            let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            let foundSq = [null, null, null, null, null, null, null, null, null];
            for (let x_ = x; x_ < x + 3; x_++) {
                for (let y_ = y; y_ < y + 3; y_++) {
                    let sq = document.getElementById(`sq${x_}x${y_}`);
                    if (sq.classList.contains("note-holder")) {
                        let numbs = sq.innerText.split("").map((e) => parseInt(e));
                        numbs.forEach(function (n) {
                            nmbCount[n-1]++;
                            foundSq[n-1] = sq;
                        });
                    } else {
                        nmbCount[parseInt(sq.innerText) - 1]++;
                    }
                }
            }

            for (let i = 0; i < 9; i++) {
                if (nmbCount[i] == 1) {
                    if (foundSq[i] == null) continue;
                    foundSq[i].innerHTML = i+1;
                    foundSq[i].classList.remove("note-holder");
                }
            }
            
        }
    }

    for (let x = 0; x < 9; x += 1) {
        let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let foundSq = [null, null, null, null, null, null, null, null, null];
        for (let y = 0; y < 9; y += 1) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("note-holder")) {
                let numbs = sq.innerText.split("").map((e) => parseInt(e));
                numbs.forEach(function (n) {
                    nmbCount[n-1]++;
                    foundSq[n-1] = sq;
                });
            } else {
                nmbCount[parseInt(sq.innerText) - 1]++;
            }

        }
        for (let i = 0; i < 9; i++) {
            if (nmbCount[i] == 1) { 
                if (foundSq[i] == null) continue;
                foundSq[i].innerHTML = i+1;
                foundSq[i].classList.remove("note-holder");
            }
        }
    }

    
    for (let y = 0; y < 9; y += 1) {
        let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let foundSq = [null, null, null, null, null, null, null, null, null];
        for (let x = 0; x < 9; x += 1) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("note-holder")) {
                let numbs = sq.innerText.split("").map((e) => parseInt(e));
                numbs.forEach(function (n) {
                    nmbCount[n-1]++;
                    foundSq[n-1] = sq;
                });
            } else {
                nmbCount[parseInt(sq.innerText) - 1]++;
            }

        }
        for (let i = 0; i < 9; i++) {
            if (nmbCount[i] == 1) {
                if (foundSq[i] == null) continue;
                foundSq[i].innerHTML = i+1;
                foundSq[i].classList.remove("note-holder");
            }
        }
    }
    

}

function solve() {
    let knlist = [];

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("known-number")) {
                knlist.push(sq);
                continue;
            }
            sq.classList.add("note-holder")
            sq.innerHTML = "<p>1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6</p><p>7</p><p>8</p><p>9</p>"
        }
    }

    while (knlist.length != 9*9) {
        let prevlength = knlist.length; 
        updateSquaresSolve(knlist);
        
        // if only one option in square or v/h line select it
        searchForOnlyOptionSolve()
    
        knlist = [];
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                let sq = document.getElementById(`sq${x}x${y}`);
                if (!sq.classList.contains("note-holder")) knlist.push(sq);
            }
        }
        
        if (prevlength == knlist.length) {
            // No Sure Number Guess
            // Search for lowest entropy
            let min = 10; let minSq;
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    let sq = document.getElementById(`sq${x}x${y}`);
                    if (!sq.classList.contains("note-holder")) continue;
                    if (sq.innerText.length < min) {
                        min = sq.innerText.length;
                        minSq = sq;
                    }
                }
            }
            if (!minSq != null) {
                console.table(knlist);
                console.log(min);
                alert("Error");
                return;
            }
            console.log(minSq);
            minSq.innerHTML = minSq.innerText.split("")[Math.floor(Math.random() * min)];
            minSq.classList.remove("note-holder");
        }

        
        updateNumberCount();
        
    }

}





document.getElementById("solveBtn").addEventListener("click", solve);


resetAll();

