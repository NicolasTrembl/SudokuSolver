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
        if (checkForVictory()) document.body.style.backgroundColor = "lightgreen";
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
    document.body.style.backgroundColor = "slategrey";

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

const langMap = {
    "title": {"FR": "Solveur de Sudoku", "EN": "Sudoku Solver"},
    "h1": {"FR": "WFC Solveur de Sudoku", "EN": "WFC Sudoku Solver"},
    "number": {"FR": "Nombre", "EN": "Number"},
    "solver": {"FR": "Solveur", "EN": "Solver"},
    "mode": {"FR": "Mode", "EN": "Mode"},
    "write": {"FR": "Écrire", "EN": "Write"},
    "note": {"FR": "Note", "EN": "Note"},
    "knnumber": {"FR": "Chiffre Connu", "EN": "Known Number"},
    "knnumber": {"FR": "Chiffre Connu", "EN": "Known Number"},
    "erase-btn": {"FR": "Éffacer", "EN": "Erase"},
    "control": {"FR": "Controles :", "EN": "Controls:"},
    "restart-btn": {"FR": "Recommencer", "EN": "Restart"},
    "reset-btn": {"FR": "Réinitialiser", "EN": "Reset"},
    "solve": {"FR": "Résoudre :", "EN": "Solve:"},
    "solve-btn": {"FR": "Résoudre", "EN": "Solve"},
    "ocrtitle": {"FR": "Scanner :", "EN": "Scan:"},
    "ocr-upload": {"FR": "Charger un sudoku", "EN": "Upload a sudoku"},
    "loading": {"FR": "Chargement...", "EN": "Loading..."},
    "how2use": {"FR": "Comment utiliser cet outil :", "EN": "How to use this tool:"},
    "explanation": {"FR": "Utiliser les 'chiffres connus' pour définir les cases de départ du sudoku et résolvez-le vous même ou avec le solveur.", "EN": "Use the 'Known Word' to create the sudoku starting cell and solve it yourself or with the solver."},
    "ok-btn": {"FR": "Ok", "EN": "Ok"},
}

function updateText(lang) {
    document.documentElement.lang = lang.toLowerCase();
    let langText = document.querySelectorAll("[data-txt-key]");
    langText.forEach(function (e) {
        if (e.getAttribute("data-txt-key").split("-").length > 1) {
            // btn
            e.value = langMap[e.getAttribute("data-txt-key")][lang];
        } else {
            e.innerText = langMap[e.getAttribute("data-txt-key")][lang];
        }
    });
}

function detectLang() {
    let lang = localStorage.getItem("lang");
    if (lang != null) {
        return lang;
    } 
    if (Intl.DateTimeFormat().resolvedOptions().timeZone == "Europe/Paris") {
        return "FR";
    } 
    return "EN";
}

document.getElementById("langFr").addEventListener("click", function() {
    localStorage.setItem("lang", "FR");
    updateText("FR");
});

document.getElementById("langEn").addEventListener("click", function() {
    localStorage.setItem("lang", "EN");
    updateText("EN");
});


// OCR IMPLEMENTATION FROM CLAUDE & GEMINI

let opencvReady = false;
if (typeof cv !== 'undefined') {
    opencvReady = true;
} else {
    console.log("No opencv");
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.onload = () => { opencvReady = true; };
    document.head.appendChild(script);
}

function findSudokuGrid(imageElement) {
    if (!opencvReady || typeof cv === 'undefined') {
        console.warn('OpenCV pas disponible, utilisation de la méthode simple');
        return null;
    }

    try {
        let src = cv.imread(imageElement);
        let gray = new cv.Mat();
        let blur = new cv.Mat();
        let thresh = new cv.Mat();
        
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
        cv.adaptiveThreshold(
            blur, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv.THRESH_BINARY_INV, 11, 2
        );
        
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        
        let maxArea = 0;
        let maxContourIndex = -1;
        
        for (let i = 0; i < contours.size(); i++) {
            let contour = contours.get(i);
            let area = cv.contourArea(contour);
            if (area > maxArea) {
                maxArea = area;
                maxContourIndex = i;
            }
        }
        
        if (maxContourIndex === -1) {
            throw new Error('Aucune grille trouvée');
        }
        
        let maxContour = contours.get(maxContourIndex);
        let peri = cv.arcLength(maxContour, true);
        let approx = new cv.Mat();
        cv.approxPolyDP(maxContour, approx, 0.02 * peri, true);
        
        let corners = [];
        for (let i = 0; i < approx.rows; i++) {
            corners.push({
                x: approx.data32S[i * 2],
                y: approx.data32S[i * 2 + 1]
            });
        }
        
        src.delete(); gray.delete(); blur.delete(); thresh.delete();
        contours.delete(); hierarchy.delete(); maxContour.delete(); approx.delete();
        
        if (corners.length === 4) {
            return sortCorners(corners);
        }
        
        return null;
    } catch (error) {
        console.error('Erreur détection grille:', error);
        return null;
    }
}

function sortCorners(corners) {
    let centerX = corners.reduce((sum, c) => sum + c.x, 0) / corners.length;
    let centerY = corners.reduce((sum, c) => sum + c.y, 0) / corners.length;
    
    corners.sort((a, b) => {
        let angleA = Math.atan2(a.y - centerY, a.x - centerX);
        let angleB = Math.atan2(b.y - centerY, b.x - centerX);
        return angleA - angleB;
    });
    
    let topLeftIndex = 0;
    let minDist = Infinity;
    for (let i = 0; i < corners.length; i++) {
        let dist = corners[i].x + corners[i].y;
        if (dist < minDist) {
            minDist = dist;
            topLeftIndex = i;
        }
    }
    
    return [...corners.slice(topLeftIndex), ...corners.slice(0, topLeftIndex)];
}

function extractAndWarpGrid(imageElement, corners) {
    if (!corners || !opencvReady || typeof cv === 'undefined') {
        return imageElement;
    }

    try {
        let src = cv.imread(imageElement);
        let size = 450;
        
        let srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            corners[0].x, corners[0].y,
            corners[1].x, corners[1].y,
            corners[2].x, corners[2].y,
            corners[3].x, corners[3].y
        ]);
        
        let dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
            0, 0,
            size, 0,
            size, size,
            0, size
        ]);
        
        let M = cv.getPerspectiveTransform(srcPoints, dstPoints);
        let warped = new cv.Mat();
        cv.warpPerspective(src, warped, M, new cv.Size(size, size));
        
        let canvas = document.createElement('canvas');
        cv.imshow(canvas, warped);
        
        src.delete(); srcPoints.delete(); dstPoints.delete(); M.delete(); warped.delete();
        
        return canvas;
    } catch (error) {
        console.error('Erreur redressement:', error);
        return imageElement;
    }
}

function extractCells(gridCanvas) {
    const cellSize = gridCanvas.width / 9;
    const cells = [];
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellCanvas = document.createElement('canvas');
            const margin = cellSize * 0.15;
            const innerSize = cellSize - (2 * margin);
            
            cellCanvas.width = innerSize;
            cellCanvas.height = innerSize;
            
            const ctx = cellCanvas.getContext('2d');
            
            ctx.drawImage(
                gridCanvas,
                col * cellSize + margin, row * cellSize + margin,
                innerSize, innerSize,
                0, 0,
                innerSize, innerSize
            );
            
            const imageData = ctx.getImageData(0, 0, innerSize, innerSize);
            const data = imageData.data;
            
            let pixelCount = 0;
            let darkPixels = 0;
            
            for (let i = 0; i < data.length; i += 4) {
                const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                const threshold = gray < 128 ? 0 : 255;
                data[i] = data[i + 1] = data[i + 2] = threshold;
                
                pixelCount++;
                if (threshold === 0) darkPixels++;
            }
            
            ctx.putImageData(imageData, 0, 0);
            
            const darkRatio = darkPixels / pixelCount;
            const isEmpty = darkRatio < 0.05;
            
            cells.push({
                canvas: cellCanvas,
                row: row,
                col: col,
                isEmpty: isEmpty
            });
        }
    }
    
    return cells;
}

async function recognizeCell(cellCanvas) {    
    try {
        const blob = await new Promise(resolve => cellCanvas.toBlob(resolve));
        
        const worker = await Tesseract.createWorker('eng');
        
        await worker.setParameters({
            tessedit_char_whitelist: '123456789',
            tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
        });
        
        const { data: { text, confidence } } = await worker.recognize(blob);
        await worker.terminate();
        const digit = text.trim();
        if (confidence < 50 || !digit || !/[1-9]/.test(digit)) {
            return '0';
        }
        
        return digit[0];
    } catch (error) {
        console.error('Erreur reconnaissance cellule:', error);
        return '0';
    }
}

async function extractSudokuFromImage(imageFile) {
    try {
        const img = await loadImageFromFile(imageFile);
        const corners = findSudokuGrid(img);        
        const gridCanvas = corners ? extractAndWarpGrid(img, corners) : await imageToCanvas(img);        
        const cells = extractCells(gridCanvas);
        
        
        const grid = [];
        
        const recognitionPromises = cells.map(cell => {
            if (cell.isEmpty) {
                return Promise.resolve('0');
            } else {
                return recognizeCell(cell.canvas, false).then(digit => {
                    console.log(`Cell (${cell.col}, ${cell.row}) found: ${digit}`);
                    return digit;
                });
            }
        });

        const digits = await Promise.all(recognitionPromises);
        
        grid.push(...digits);
        
        
        return grid;
        
    } catch (error) {
        console.error('ERROR:', error);
        throw error;
    }
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
}

async function imageToCanvas(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas;
}

function loadSudokuToGrid(grid) {
    if (grid.length !== 81) {
        return false;
    }

    resetAll();

    KNtoggled = true;
    knBtn.checked = true;

    let index = 0;
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let value = parseInt(grid[index]);
            if (value >= 1 && value <= 9) {
                updateSquare(x, y, value);
            }
            index++;
        }
    }

    KNtoggled = false;
    knBtn.checked = false;

    return true;
}

document.getElementById('ocrUpload')?.addEventListener('click', function() {
    document.getElementById('ocrInput').click();
});

document.getElementById('ocrInput')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    console.log(document.documentElement.lang.toUpperCase());

    document.getElementById('ocrUpload').value = langMap["loading"][document.documentElement.lang.toUpperCase()];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    try {
        const grid = await extractSudokuFromImage(file);
        console.log(grid);
        loadSudokuToGrid(grid);
    } catch (error) {
        console.error('Erreur:', error);
    }    
    document.getElementById('ocrUpload').value = langMap["ocr-upload"][document.documentElement.lang.toUpperCase()];

    e.target.value = '';
});


function displayHelp(){
    document.querySelector("main").classList.add("blur");
    document.getElementById("help-modal").classList.remove("fhidden");
}

document.getElementById("help").addEventListener("click", displayHelp);
document.getElementById("ok").addEventListener("click", function (){
    document.querySelector("main").classList.remove("blur");
    document.getElementById("help-modal").classList.add("fhidden");
    localStorage.setItem("helpMessageSeen", true);
});

resetAll();
updateText(detectLang());

let helpSeen = localStorage.getItem("helpMessageSeen");

if (helpSeen) {
    console.log("Seen");
} else {
    displayHelp();
}