


//Create variables here
var dog;
var dog1;
var happyDog;
var database;
var foodS;
var fedTime, lastFed, currentTime;
var feed, addFood;
var foodStock;
var foodObj;
var gameState, readState;
var bedroom, garden,washroom;

function preload()
{
	dog1 = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png")
  garden=loadImage("Images/Garden.png");
  washroom=loadImage("Images/Wash Room.png");

}

function setup() {
  database = firebase.database();
	createCanvas(1000, 400);
  foodObj = new food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock)

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  dog = createSprite(800, 210, 20, 20);
  dog.addImage(dog1);
  dog.scale = 0.16;

  feed = createButton("Feed Drago Milk");
  feed.position(1050, 85)
  feed.mousePressed(feedDog);


  addFood = createButton("Add Milk")
  addFood.position(980, 85)
  addFood.mousePressed(addFoods);

  
  
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

/*function writeStock(x){
  if(x<=0){
    x = 0;
  }
  else{
    x=x-1;
  }

  database.ref('/').update({


    Food:x
  })
}*/


function draw() {  
  background(46, 139, 87)
  
  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   
  }
  

  fill(255, 255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed: "+lastFed%12+ "PM", 350, 50);
    }else if(lastFed == 0){
      text("Last Feed: 12 AM", 350, 50)
    }else{
      text("Last Feed: "+ lastFed + "AM", 350, 50)
    }
 

  drawSprites();
  

}




function feedDog(){
  dog.addImage(happyDog);

  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }

  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}


function update(state){
  database.ref('/').update({
    gameState:state
  })
}
