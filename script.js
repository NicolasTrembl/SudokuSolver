var numbersCount        = [9, 9, 9, 9, 9, 9, 9, 9, 9];
var historyList         = [];
var currentMode         = "WRITE";
var KNtoggled           = false;
var currentSelectedSq   = null;


/* PHONE PANEL DISPLAY */

var csoNumb = document.getElementById("cso-numb");
var csoSolv = document.getElementById("cso-solv");

var numpadDisplay = document.getElementById("numpad-panel");
var solveDisplay = document.getElementById("solve-p");


function selectedCommand(selectedBtn, selectedDisplay) {
    csoNumb.classList.remove("selected");
    csoSolv.classList.remove("selected");

    selectedBtn.classList.add("selected");

    numpadDisplay.classList.add("hidden");
    solveDisplay.classList.add("hidden");

    selectedDisplay.classList.remove("hidden");
}

csoNumb.addEventListener("click",() => selectedCommand(csoNumb, numpadDisplay));
csoSolv.addEventListener("click",() => selectedCommand(csoSolv, solveDisplay));


/* MODE SELECTION */

var knBtn       = document.getElementById("toggleKN");
var writeBtn    = document.getElementById("write");
var noteBtn     = document.getElementById("note");


function setKNON() {
    KNtoggled = true;
    if (currentMode == "NOTE") {
        writeBtn.checked = true;
        currentMode = "WRITE";
    }
}

knBtn.addEventListener("change", (_) => setKNON());

knBtn.checked       = false;
writeBtn.checked    = true;

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

/* SQUARE SELECTION */

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

/* NUMPAD */

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

/* KEY EVENT */

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
        case "k":
            knBtn.checked = !knBtn.checked;
            if (knBtn.checked) setKNON();
            break;
        case "n":
            resetAll();
            break;
        case "r":
            restart();
            break;
        case " ":
            solve();
            break;
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

/* ERASE SELECTION */

document.getElementById("eraseBtn").addEventListener('click', function (){
    if (currentSelectedSq != null) {
        updateSquare(currentSelectedSq[0], currentSelectedSq[1], 0);
    }
});


/* VICTORY CHECK */

function checkForVictory() {
    // Square Check
    let squares = document.querySelectorAll(".sudoku-big-square");
    squares.forEach(square => {
        let txt = square.innerText.replaceAll("\n", "");
        for (let i = 1; i <= 9; i++) {
            if (!txt.includes(`${i}`)) {
                // console.log("square check sq", square);
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
                // console.log("H check at", y);
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
                // console.log("V check at", x);
                return false;
            }
        }  
    } 

    return true;
}

/* UPDATE NUMPAD NUMBER COUNT */

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
        if (checkForVictory()) document.body.style.backgroundColor = "green";
    }

}

/* UPDATE SQUARE FROM USER INPUT */

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

/* RESET & RESTART */

function resetAll() {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            sq.classList.remove("known-number");
            sq.innerHTML = "";
        }
    }
    document.body.style.backgroundColor = "slategrey";
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
    document.body.style.backgroundColor = "slategrey";
    updateNumberCount();
}


document.getElementById("resetBtn").addEventListener("click", resetAll);
document.getElementById("restartBtn").addEventListener("click", restart);

/* AUTO SOLVE */

function removeNoteFromSquare(square, value) {
    let notes = getNotesFromSquare(square);
    notes = notes.filter(n => n !== value);
    setNotesToSquare(square, notes);
}

function getNotesFromSquare(square) {
    if (!square.classList.contains("note-holder")) {
        return [];
    }
    let pTags = square.querySelectorAll('p');
    let notes = [];
    pTags.forEach(p => {
        let text = p.textContent.trim();
        if (text !== '') {
            notes.push(text);
        }
    });
    return notes;
}

function setNotesToSquare(square, notes) {
    if (notes.length === 0) {
        // Error : Empty square
        square.innerHTML = '<p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p><p> </p>';
        square.style.backgroundColor = '#ffcccc';
        return;
    }
    
    square.style.backgroundColor = '';
    
    let html = '';
    for (let i = 1; i <= 9; i++) {
        if (notes.includes(String(i))) {
            html += `<p>${i}</p>`;
        } else {
            html += '<p> </p>';
        }
    }
    square.innerHTML = html;
}

function updateSquaresSolve(knlist) {
    knlist.forEach(sq => {
        let pos = sq.id.slice(2).split("x").map(p => parseInt(p));
        let valueToRemove = sq.innerText.trim();
        
        if (!valueToRemove) return; // Skip if empty
        
        let blockX = Math.floor(pos[0] / 3) * 3;
        let blockY = Math.floor(pos[1] / 3) * 3;
        
        for (let x_ = blockX; x_ < blockX + 3; x_++) {
            for (let y_ = blockY; y_ < blockY + 3; y_++) {
                if (x_ == pos[0] && y_ == pos[1]) continue;
                let square = document.getElementById(`sq${x_}x${y_}`);
                if (square.classList.contains("note-holder")) {
                    removeNoteFromSquare(square, valueToRemove);
                }
            }
        }

        // Update H line
        for (let x = 0; x < 9; x++) {
            if (x == pos[0]) continue;
            let square = document.getElementById(`sq${x}x${pos[1]}`);
            if (square.classList.contains("note-holder")) {
                removeNoteFromSquare(square, valueToRemove);
            }
        }
        
        // Update V line
        for (let y = 0; y < 9; y++) {
            if (y == pos[1]) continue;
            let square = document.getElementById(`sq${pos[0]}x${y}`);
            if (square.classList.contains("note-holder")) {
                removeNoteFromSquare(square, valueToRemove);
            }
        }
    });
    
    // Check for squares with only one option left
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("known-number")) {
                continue;
            }
            if (sq.classList.contains("note-holder")) {
                let notes = getNotesFromSquare(sq);
                if (notes.length == 1) {
                    historyList.push({"square": sq.id, "set": notes[0]});
                    sq.innerHTML = notes[0];
                    sq.classList.remove("note-holder");
                    sq.style.backgroundColor = '';
                } else if (notes.length === 0) {
                    // Empty square
                    sq.style.backgroundColor = '#ffcccc';
                }
            }
        }
    }
}


function searchForOnlyOptionSolve() {
    // Squares (3x3 blocks)
    for (let x = 0; x < 9; x += 3) {
        for (let y = 0; y < 9; y += 3) {
            let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            let foundSq = [null, null, null, null, null, null, null, null, null];
            for (let x_ = x; x_ < x + 3; x_++) {
                for (let y_ = y; y_ < y + 3; y_++) {
                    let sq = document.getElementById(`sq${x_}x${y_}`);
                    if (sq.classList.contains("note-holder")) {
                        let numbs = getNotesFromSquare(sq).map(n => parseInt(n));
                        numbs.forEach(function (n) {
                            nmbCount[n-1]++;
                            foundSq[n-1] = sq;
                        });
                    } else if (sq.innerText.trim() !== '') {
                        nmbCount[parseInt(sq.innerText.trim()) - 1]++;
                    }
                }
            }

            for (let i = 0; i < 9; i++) {
                if (nmbCount[i] == 1 && foundSq[i] != null) {
                    foundSq[i].innerHTML = i+1;
                    historyList.push({"square": foundSq[i].id, "set": i+1});
                    foundSq[i].classList.remove("note-holder");
                }
            }
        }
    }

    // Horizontal lines
    for (let y = 0; y < 9; y += 1) {
        let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let foundSq = [null, null, null, null, null, null, null, null, null];
        for (let x = 0; x < 9; x += 1) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("note-holder")) {
                let numbs = getNotesFromSquare(sq).map(n => parseInt(n));
                numbs.forEach(function (n) {
                    nmbCount[n-1]++;
                    foundSq[n-1] = sq;
                });
            } else if (sq.innerText.trim() !== '') {
                nmbCount[parseInt(sq.innerText.trim()) - 1]++;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (nmbCount[i] == 1 && foundSq[i] != null) {
                foundSq[i].innerHTML = i+1;
                historyList.push({"square": foundSq[i].id, "set": i+1});
                foundSq[i].classList.remove("note-holder");
            }
        }
    }

    // Vertical lines
    for (let x = 0; x < 9; x += 1) {
        let nmbCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let foundSq = [null, null, null, null, null, null, null, null, null];
        for (let y = 0; y < 9; y += 1) {
            let sq = document.getElementById(`sq${x}x${y}`);
            if (sq.classList.contains("note-holder")) {
                let numbs = getNotesFromSquare(sq).map(n => parseInt(n));
                numbs.forEach(function (n) {
                    nmbCount[n-1]++;
                    foundSq[n-1] = sq;
                });
            } else if (sq.innerText.trim() !== '') {
                nmbCount[parseInt(sq.innerText.trim()) - 1]++;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (nmbCount[i] == 1 && foundSq[i] != null) {
                foundSq[i].innerHTML = i+1;
                historyList.push({"square": foundSq[i].id, "set": i+1});
                foundSq[i].classList.remove("note-holder");
            }
        }
    }
}


const delay = ms => new Promise(res => setTimeout(res, ms));

function saveSudokuState() {
    let state = [];
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            let sq = document.getElementById(`sq${x}x${y}`);
            state.push({
                id: sq.id,
                innerHTML: sq.innerHTML,
                isNoteHolder: sq.classList.contains("note-holder"),
                isKnownNumber: sq.classList.contains("known-number")
            });
        }
    }
    return state;
}

function restoreSudokuState(state) {
    state.forEach(sqState => {
        let sq = document.getElementById(sqState.id);
        sq.innerHTML = sqState.innerHTML;
        
        // Reset classes
        sq.classList.remove("note-holder");
        sq.classList.remove("known-number");
        sq.style.backgroundColor = '';
        
        // Restore classes
        if (sqState.isNoteHolder) {
            sq.classList.add("note-holder");
        }
        if (sqState.isKnownNumber) {
            sq.classList.add("known-number");
        }
    });
}


async function solve() {
    historyList = [];
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
            sq.style.backgroundColor = '';
        }
    }

    while (knlist.length != 9*9) {
        await delay(1);

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
            // No Sure Number - Need to Guess
            // Search for minimum options
            let min = 10; 
            let minSq = null;
            
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    let sq = document.getElementById(`sq${x}x${y}`);
                    if (!sq.classList.contains("note-holder")) continue;
                    let options = getNotesFromSquare(sq);
                    if (options.length > 0 && options.length < min) {
                        min = options.length;
                        minSq = sq;
                    }
                }
            }
            
            if (minSq == null) {
                // No valid square : need to rollback
                console.log("Rollback needed - no valid options");
                let rb_successful = false;
                
                while (historyList.length > 0) {
                    let element = historyList.pop();
                    
                    if (element["set"] == "Random") {
                        // Found last random selection
                        // Try other possibilities
                        let options = element["from"].filter(opt => opt !== element["to"]);
                        
                        if (options.length > 0) {
                            // Restore the saved state
                            restoreSudokuState(element["savedState"]);
                            
                            // Try next option
                            let sq = document.getElementById(element["square"]);
                            let chosen = options[Math.floor(Math.random() * options.length)];
                            sq.innerHTML = chosen;
                            sq.classList.remove("note-holder");
                            
                            // Save new state and push to history
                            historyList.push({
                                "square": sq.id, 
                                "set": "Random", 
                                "from": options, 
                                "to": chosen,
                                "savedState": saveSudokuState()
                            });
                            
                            rb_successful = true;
                            console.log(`Rollback: trying ${chosen} at ${sq.id} (remaining options: ${options.length})`);
                            break;
                        }
                        // No more options for this random choice, continue rolling back
                        console.log(`No more options for ${element["square"]}, continuing rollback`);
                    }
                }
                
                if (!rb_successful) {
                    console.error("Rollback failed - sudoku might be unsolvable");
                    alert("Impossible de résoudre ce sudoku. Vérifiez qu'il n'y a pas d'erreur dans les chiffres de départ.");
                    return;
                }
                
                // rebuild the known list
                knlist = [];
                for (let x = 0; x < 9; x++) {
                    for (let y = 0; y < 9; y++) {
                        let sq = document.getElementById(`sq${x}x${y}`);
                        if (!sq.classList.contains("note-holder")) {
                            knlist.push(sq);
                        }
                    }
                }
            } else {
                // Guess
                let options = getNotesFromSquare(minSq);
                
                if (options.length === 0) {
                    console.error("minSq has no options!");
                    continue;
                }
                
                let chosen = options[Math.floor(Math.random() * options.length)];
                minSq.innerHTML = chosen;
                console.log(`Guessing ${chosen} at ${minSq.id} (${options.length} options)`);
                
                // Save current state before making the guess
                historyList.push({
                    "square": minSq.id, 
                    "set": "Random", 
                    "from": options, 
                    "to": chosen,
                    "savedState": saveSudokuState()
                });
                minSq.classList.remove("note-holder");
            }
        }

        
        updateNumberCount();
        
    }

}

document.getElementById("solveBtn").addEventListener("click", solve);



resetAll();

