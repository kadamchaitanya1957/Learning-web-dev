let level = 0;
let gameSeq = [];
let userSeq = [];
let highscore =[0];

let beg = document.querySelector(".main");
beg.addEventListener("click", start);
document.body.addEventListener("keypress", start);
let score = document.createElement("h2");
score.innerText = "Your highscore:";
document.body.appendChild(score);



function start() {
  beg.remove();
  document.body.style.backgroundColor = "white";
  level = 0;
  gameSeq = [];
  nextLevel();
  
  
}

function nextLevel() {
  userSeq = [];
  level++;
  document.querySelector("h2").innerText = `Level ${level}`;

  let random = Math.floor(Math.random() * 4);
  let colors = ["red", "blue", "green", "yellow"];
  let chosenColor = colors[random];
  gameSeq.push(chosenColor);

  flashButton(chosenColor);
}

function flashButton(color) {
  let btn = document.querySelector("." + color);
  btn.style.opacity = 1;
  setTimeout(() => {
    btn.style.opacity = 0.6;
  }, 500);
}

document.querySelectorAll(".button").forEach(button => {
  button.addEventListener("click", function (event) {
    let chosenColor = event.target.classList[0];
    userSeq.push(chosenColor);
    flashButton(chosenColor);
    checkAnswer(userSeq.length - 1);
  });
});

function checkAnswer(currentIndex) {
  if (userSeq[currentIndex] !== gameSeq[currentIndex]) {
    setTimeout(() => {
        document.body.style.backgroundColor = "darkred";
    },500);
    document.querySelector("h2").innerHTML= `Game Over! <br> Your score was <b> ${level} </b> <br>Press any key to restart`;
    highscore.push(level);
    score.innerHTML = `Your highscore: <b>${max(highscore)}</b>`;
    return;
  }

  if (userSeq.length === gameSeq.length) {
    setTimeout(nextLevel, 1000);
  }
}
function max(highscore){
    let maximum = highscore[0];
    for(el of highscore){
        if(el > maximum){
         maximum = el;
    }
   }
  return maximum;
}
