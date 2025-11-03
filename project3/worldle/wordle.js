let height = 6;
let width = 5;
let row = 0;
let col = 0;
let gameOver = false;
let words = [
"ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN","AGENT","AGREE","AHEAD","ALARM",
"ALBUM","ALERT","ALIEN","ALLOW","ALONE","ALONG","ALTER","AMBER","AMEND","ANGLE","ANGRY","APART","APPLE","APPLY",
"ARENA","ARGUE","ARISE","ARRAY","ASIDE","ASSET","AUDIO","AWARE","BADGE","BASIC","BEACH","BEGAN","BEGIN","BEING",
"BELOW","BENCH","BILLY","BLACK","BLADE","BLAME","BLANK","BLOCK","BIRTH","BLOOD","BOARD","BOOST","BOUND","BRAIN","BRAND",
"BREAD","BREAK","BRICK","BRIDE","BRING","BROAD","BROKE","BROWN","BUILD","BUILT","BUYER","CABLE","CARRY","CAUSE",
"CHAIN","CHAIR","CHART","CHASE","CHEAP","CHECK","CHEST","CHIEF","CHILD","CHOIR","CIVIL","CLAIM","CLASS","CLEAN",
"CLEAR","CLICK","CLOCK","CLOSE","COACH","COAST","COULD","COUNT","COURT","COVER","CRACK","CRAFT","CRASH","CRIME",
"CROSS","CROWD","CROWN","CURVE","CYCLE","DAILY","DANCE","DEATH","DEBUT","DELAY","DEPTH","DOUBT","DOZEN","DRAFT",
"DRAIN","DRAMA","DRAWN","DREAM","DRESS","DRINK","DRIVE","DROVE","EARLY","EARTH","EIGHT","ELDER","ELECT","EMPTY",
"ENEMY","ENJOY","ENTER","ENTRY","EQUAL","ERROR","EVENT","EVERY","EXACT","EXIST","EXTRA","FAINT","FAITH","FALSE",
"FAULT","FAVOR","FEAST","FEELT","FIELD","FINAL","FIRST","FLAME","FLASH","FLEET","FLOOD","FLOOR","FOCUS","FORCE",
"FORTH","FOUND","FRAME","FRESH","FRIEND","FRONT","FRUIT","FULLY","FUNNY","GHOST","GIANT","GLASS","GRACE","GRADE",
"GRAIN","GRAND","GRANT","GRASS","GREEN","GROUP","GUARD","GUESS","GUEST","GUIDE","HAPPY","HARDY","HEART","HEAVY",
"HONEY","HORSE","HOUSE","HUMAN","HURRY","IDEAL","IMAGE","INDEX","INNER","INPUT","ISSUE","JELLY","JOINT","JUDGE",
"JUICE","KNIFE","LARGE","LASER","LAUGH","LAYER","LEARN","LEAST","LEAVE","LEVEL","LIGHT","LIMIT","LOCAL","LOGIC",
"LOOSE","LOVER","LOWER","LUCKY","LUNCH","MAGIC","MAJOR","MAKER","MARCH","MATCH","MAYBE","METAL","MIGHT","MINOR",
"MODEL","MONEY","MONTH","MORAL","MOTOR","MOUNT","MOUSE","MOUTH","MUSIC","MERIT","NAKED","NERVE","NEVER","NIGHT","NOISE",
"NORTH","NOVEL","NURSE","OFFER","OFTEN","ORDER","OTHER","OUTER","OWNER","PAINT","PAPER","PARTY","PEACE","PHASE",
"PHONE","PHOTO","PIANO","PIECE","PILOT","PLAIN","PLANT","PLATE","POINT","POWER","PRESS","PRICE","PRIDE","PRIME",
"PRINT","PRIZE","PROOF","PROUD","QUEEN","QUICK","QUIET","RADIO","RAISE","RANGE","RAPID","RATIO","READY","RELAX",
"REPLY","RIGHT","RIVER","ROBOT","ROUGH","ROUND","ROYAL","RURAL","SAINT","SALAD","SCALE","SCENE","SCOPE","SCORE",
"SHAPE","SHARE","SHEEP","SHEET","SHELF","SHIFT","SHINE","SHIRT","SHOCK","SHOOT","SHORT","SHOUT","SHOWN","SIGHT",
"SKILL","SLEEP","SLIDE","SMILE","SMOKE","SNAKE","SOLID","SOLVE","SORRY","SOUND","SPACE","SPEED","SPEND","SPINE",
"SPLIT","SPORT","STAFF","STAGE","STAND","START","STATE","STEEL","STICK","STILL","STOCK","STONE","STORE","STORM",
"STORY","STRIP","STUDY","STYLE","SUGAR","TABLE","TASTE","TEACH","THEFT","THEIR","THING","THINK","THIRD","THREE",
"THROW","TIGHT","TITLE","TODAY","TOKEN","TOUCH","TOUGH","TOWER","TRACE","TRACK","TRADE","TRAIL","TRAIN","TREAT",
"TREND","TRIAL","TRICK","TROOP","TRUCK","TRUTH","TWICE","UNDER","UNION","UNITY","UNTIL","UPPER","USUAL","VALUE",
"VIDEO","VISIT","VOICE","VOTER","WASTE","WATCH","WATER","WHEEL","WHERE","WHILE","WHITE","WHOLE","WOMAN","WORRY",
"WORLD","WORTH","WOULD","WRITE","WRONG","YIELD","YOUNG"
];
let word = words[Math.floor(Math.random() * words.length)];
let validWords = words.concat([
    "ABBEY", "BLOOM", "CANDY", "CHESS", "FROST", "GLORY", "HUMOR", "PIZZA", "QUILT", "ROUTE",
    "SPARK", "TANGO", "VENOM", "WITCH", "ZEBRA"
]);

window.onload = function() {
    initialize();
}

function initialize() {
// create game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }
//create keyboard
   let keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
];
   let keyboardContainer = document.getElementById("keyboard");
   for(let i = 0 ;i<keyboardLayout.length; i++){
       let currRow=keyboardLayout[i];
       let keyboardRow = document.createElement("div");
       keyboardRow.classList.add("keyboard-row");
       for(let j=0; j< currRow.length; j++){
           let keytile=document.createElement("div");
           let key= currRow[j];
           keytile.innerText = key;
           if(key == "Enter"){
               keytile.id="Enter";
           }
           else if(key == "⌫"){
               keytile.id="Backspace";
           }
           else if ("A" <= key && key <= "Z"){
               keytile.id="Key" + key; //"Key" + A 
           }
           keytile.addEventListener("click",processKey);
           if (key == "Enter"){
               keytile.classList.add("enter-key-tile");
           }else{
               keytile.classList.add("key-tile");
           }
           keyboardRow.appendChild(keytile);
       }
       keyboardContainer.appendChild(keyboardRow);
   }



// Key press
    document.addEventListener("keyup", (e) => {
processInput(e);
    })

}
function processKey(){
    let e = {"code" : this.id};
    processInput(e);
}

function processInput(e){
if (gameOver) return;

    // e.code gives us the key X in the form "KeyX"
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currtile = document.getElementById(row.toString() + "-" + col.toString());
            if (currtile && currtile.innerText === "") {
                currtile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code === "Backspace") {
        if (col > 0 && col <= width) {
            col -= 1;
            let currtile = document.getElementById(row.toString() + "-" + col.toString());
            currtile.innerText = "";
        }
    }
 else if (e.code === "Enter") {
    if (col === width) { 
        // get the word typed 
        let guess = "";
        for (let c = 0; c < width; c++) {
            let tile = document.getElementById(row.toString() + "-" + c.toString());
            guess += tile.innerText.toUpperCase();
        }
        // check if it's a valid word
        if (!validWords.includes(guess)) {
            showInvalidWordMessage();
            return; // don’t call update()
        }
        update();
        row += 1;
        col = 0;
    }
}

if (!gameOver && row == height){
    gameOver=true;
    showModal(false);

}
}


function update() {
    let correct = 0;
    let letterCount = {}; //KENNY -> {K:1, E:1, N:2, Y:1}
    for(let i=0; i < word.length; i++){
        letter=word[i];
        if(letterCount[letter]){
            letterCount[letter]+=1;
        }
        else{
            letterCount[letter]=1;
        }
    }
//first iteration check all correct ones
    for (let c = 0; c < width; c++) {
        let currtile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currtile.innerText;

        if (word[c] === letter) {
            currtile.classList.add("correct");
            let keytile= document.getElementById("Key" + letter);
            keytile.classList.remove("present");
            keytile.classList.add("correct");
            correct += 1;
            letterCount[letter] -=1;
        }
    if (correct === width) {
        gameOver = true;
        showModal(true);
        return;
    }
    }
//go again and mark present ones but wrong position 
   for (let c = 0; c < width; c++) {
        let currtile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currtile.innerText.toUpperCase();
    if(!currtile.classList.contains("correct")){
        if (word.includes(letter) && letterCount[letter] > 0) {
            currtile.classList.add("present");
            let keytile= document.getElementById("Key" + letter);
            if (!keytile.classList.contains("correct")){
                keytile.classList.add("present");
            }
            letterCount[letter]-=1;
        }
        else {
            currtile.classList.add("absent");
            let keytile = document.getElementById("Key" + letter);
            if (keytile && !keytile.classList.contains("correct") && !keytile.classList.contains("present")) {
                keytile.classList.add("absent");
            }
        }
    }
    }    
}

function showModal(isWin) {
    let modal = document.getElementById("result-modal");
    let modalText = document.getElementById("modal-text");
    let modalWord = document.getElementById("modal-word");

    modalText.innerText = isWin ? "You guessed it!" : "Game Over!";
    modalWord.innerText = `The word was: ${word}`;
    modal.style.display = "flex";
}

function playAgain() {
    location.reload(); //  refreshes page and restarts
}

function showInvalidWordMessage() {
    let msg = document.getElementById("invalid-msg");
    msg.style.display = "block";
    msg.classList.add("fade");
    setTimeout(() => {
        msg.style.display = "none";
        msg.classList.remove("fade");
    }, 1000);
}
