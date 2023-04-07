let inputDirection = {x:0 , y:0}; //Direction in which snake is going
const foodSound = new Audio('food.mp3');
const moveSound = new Audio('move.mp3');
const endSound = new Audio('gameover.mp3');
const bgMusic = new Audio('music.mp3');
let board = document.getElementById('Board');
let speed = 4;
let LastPaintedTime = 0; //Initial painted time(refresh time)
let snakeArr = [  //whole snake body
    {x: 5, y: 7}
];
let food = {x: 15, y: 13};
let index = 0;
let scoreCard = document.getElementById('score');
let score = 0;

//Game Functions

function main(ctime)
{
    window.requestAnimationFrame(main); //Looping of the main function so it acts like a game loop.
    // console.log(ctime);
    if((ctime - LastPaintedTime)/1000 < 1/speed)
    {
        return;
    }

    LastPaintedTime = ctime;

    GameEngine();
}

function isCollide(snakeArr)
{
    for(let i=1; i<snakeArr.length; i++)
    {
        //Snake colliding with itself:
        //Head and body's x and y coordinate will become equal then collide
        if((snakeArr[0].x === snakeArr[i].x)  &&  (snakeArr[0].y === snakeArr[i].y))
        {
            return true;
        }
    }
    
    //Colliding with the walls:
    if((snakeArr[0].x >=20 || snakeArr[0].x <=0) || (snakeArr[0].y >=20 || snakeArr[0].y <=0))
    {
        return true;
    }
}

function GameEngine()
{
//Part 1: Updating the snake array
    if(isCollide(snakeArr))
    {
        endSound.play();
        bgMusic.pause();
        inputDirection = {x: 0, y: 0};
        alert("Game Over! , Press OK to play again");
        snakeArr = [{x: 15, y: 13}];
        bgMusic.play();
        score = 0;
        scoreCard.innerHTML = "Total Score: " + score;
    }

    //if food is eaten, increament score and regenerate the food:
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y)
    {
        foodSound.play();
        score += 1;
        scoreCard.innerHTML = "Total Score: " + score;
        if(score>HiScore)
        {
            HiScore = score;
            localStorage.setItem('HScore', JSON.stringify(HiScore));
            Highscore.innerHTML = "Higest Score: " + HiScore;
        }
        snakeArr.unshift({x: snakeArr[0].x + inputDirection.x, y: snakeArr[0].y + inputDirection.y});
        let a = 2;
        let b = 20;
        food = {x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())}    // unshift inserts a new element at the start of the array and returns the new length of the array.
    }

    //Moving the snake:
    for(let i=snakeArr.length -2; i>=0; i--)
    {
        snakeArr[i+1] = {...snakeArr[i]}; //you cant destructure an object.When you are doing without ... then you are pointing to a same object,  so you are solving referencing problem here( creating a new object here).
    }
    snakeArr[0].x += inputDirection.x;
    snakeArr[0].y += inputDirection.y;


//Part 2: Display the snake and food:

    board.innerHTML = "";

    //Snake Creation (Head also here):
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index == 0)
        {
            snakeElement.classList.add('snakehead');
        }
        
        else
        {
            snakeElement.classList.add('snakeBody');
        }
        board.appendChild(snakeElement);
    });

    //Snake Food Creation:
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//Main Logic
//window.request.... is better than setTimeinterval as it gives highest fps according to your hardware

window.requestAnimationFrame(main);//Tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. It takes a callback as an argument to be invoked.

window.addEventListener("keydown" , e => {//keydown means when you takes down the key on the keyborad. It is not same as keypress.
    //inputDirection = {x: 0, y: 1}; Starts the game
    moveSound.play();
    bgMusic.play();

    switch(e.key)
    {
        //ArrowUp , ArryDown and rest two are references of these on the keyboard.
        case "ArrowUp":
            console.log("ArrowUp");
            inputDirection.x = 0;
            inputDirection.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDirection.x = 0;
            inputDirection.y = 1;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDirection.x = 1;
            inputDirection.y = 0;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDirection.x = -1;
            inputDirection.y = 0;
            break;
    }
});

//Highest Score storing in the local Storage: You can see local storage in Applications sections (Chrome Dev Tools)
let HScore = localStorage.getItem("HScore");//The argument in the localstorage return the current value of that argument or NULL if the current value of that argument does not exist.

if(HScore === null) //Pehle set nahi tha to null aayegi
{
    let HiScore = 0
    localStorage.setItem("HScore", JSON.stringify(HiScore)); //Sets High score value in the local storage and it remains even if you refreshes the page. You can clear it by going into Applications section.
    //Run localStorage.clear() in console to clear localStorage.
}

else
{
    HiScore = JSON.parse(HScore);
    Highscore.innerHTML = "Higest Score: " + HiScore;
}