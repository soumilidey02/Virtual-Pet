//Create variables here
var dog, happyDog;
var dogImg, happyDogImg;
var milk, milkImg;
var database;
var foodS, foodStock;
var fedTime, lastFed;
var food;
var changeGameState, readGameState;
var gamestate;
var bedroomImg, gardenImg, washroomImg;

function preload() {
	//load images here
    dogImg = loadImage("Dog.png");
    happyDogImg = loadImage("happydog.png");
    milkImg = loadImage("milk.png");
    bedroomImg = loadImage("Room.png");
    gardenImg = loadImage("Garden.png");
    washroomImg = loadImage("Wash Room.png");
}

function setup() {
    createCanvas(600, 600);

    dog = createSprite(300, 485, 20, 20);
    dog.addImage(dogImg);
    dog.scale = 0.25;

    database = firebase.database();
    foodStock = database.ref('food');
    foodStock.on("value", readStock);

    feed = createButton("ADD FOOD");
    feed.position(600, 165);
    feed.mousePressed(feedDog);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
        lastFed = data.val();
    })
}


function draw() {
    background("cyan");

    readGameState = database.ref('gameState');
    readGameState.on("value", function (data) {
        gamestate = data.val();
    })

    displayFood();

    if (keyWentDown(UP_ARROW)) {
        writeStock(foodS);
        dog.addImage(happyDogImg);
    }

    drawSprites();

    textSize(20);
    fill("blue");
    text("Click the button to add the food", 150, 70);
    text("Press the up arrow to feed the dog",150, 90 );

    if (lastFed >= 12) {
        text("Last fed: " + lastFed % 12 + "PM", 200, 30);
        update("sleeping");
        bedroom();
    } else if (lastFed === 0) {
        text("Last fed: 12 AM", 200, 30);
        update("playing");
        garden();
    } else {
        text("Last fed: " + lastFed + " AM", 200, 30);
        update("hungry");
        background("cyan");
           }
}

function readStock(data) {
    foodS = data.val();
}

function writeStock(x) {
    if (x < 0) {
        x = 0;
    } else {
        x = x - 1;
    }
    database.ref('/').update({
        food: x
    })
}

function feedDog() {
    foodS++;
    database.ref('/').update({
        food: foodS
    })
}

function update(state) {
    database.ref('/').update({
        gameState: state
    })
}

function bedroom() {
    dog.addImage(bedroomImg);
}

function garden() {
    dog.addImage(gardenImg);
}

function washroom() {
    dog.addImage(washroomImg);
}

function displayFood() {
    var x = 100;
    var y = 100;
    if (foodS !== 0) {
        for (var i = 0; i < foodS; i++) {
            if (i % 10 === 0) {
                x = 80;
                y = y + 50;
            }
            image(milkImg, x, y, 50, 50);
            x = x + 30;
        }
    }
}