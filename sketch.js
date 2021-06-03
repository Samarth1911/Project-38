//Create variables here
var dog,sadDog,happyDog, database;
var readState,updateState
var currentTime
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var bedroomImg,washroomImg,gardenImg

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
bedroomImg = loadImage("images/Bed Room.png")
washroomImg=  loadImage("images/Wash Room.png")
gardenImg = loadImage("images/Garden.png")
milkBottle2 = loadImage("images/milk.png")
livingRoomImg = loadImage("images/Living Room.png")

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  readState = database.ref('gameState')
  readState.on("value",function(data){
    gameState = data.val()
  });



  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  writeStock(foodS);


  if(foodS == 0){
    dog.addImage(happyDog)
    milkBottle2.visible = false

  }else{
    dog.addImage(sadDog)
    milkBottle2.visible = true
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  currentTime = hour();

  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden()
  }else if(currentTime ==(lastFed+2) ){
    update("Sleeping")
    foodObj.bedRoom()
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing")
    foodobj.washRoom()
  }else{
    update("Hungry")
    foodObj.display()
  }

 

  //gameState = 1
  if(gameState === 1){
    dog.addImage(happyDog)
    dog.scale = 0.175
    dog.y = 250
  }
  //gameState = 2
  if(gameState === 2){
    dog.addImage(sadDog)
    dog.scale = 0.175
    milkBottle2.visible = false
  }
  //gameState = 3
  var Bath = createButton("I want to take bath")
  Bath.position(580,125)
  if(Bath.mousePressed(function(){
    gameState = 3
    database.ref('/').update({'gameState' : gameState})
  }));
  if(gameState === 3){
    dog.addImage(washroomImg)
    dog.scale = 1
    milkBottle2.visible = false
  };
  //gameState = 4
  var Sleep = createButton("I am very Sleepy")
  Sleep.position(710,125)
  if(Sleep.mousePressed(function(){
    gameState = 4
    database.ref('/').update({'gameState' : gameState})
  }));
  if(gameState === 4){
    dog.addImage(bedroomImg)
    dog.scale = 1
    milkBottle2.visible = false
  };
  //gameState = 5
  var Play = createButton("Lets Play!")
  Play.position(500,160)
  if(Play.mousePressed(function(){
    gameState = 5
    database.ref('/').update({'gameState' : gameState})
  }));
  if(gameState === 5){
    dog.addImage(livingRoomImg)
    dog.scale = 1
    milkBottle2.visible = false
  };
  //gameState = 6
  var PlayInGarden = createButton("Lets Play in Graden!")
  PlayInGarden.position(585,160)
  if(PlayInGarden.mousePressed(function(){
    gameState = 6
    database.ref('/').update({'gameState' : gameState})
  }));
  if(gameState === 6){
    dog.addImage(gardenImg)
    dog.scale = 1
    milkBottle2.visible = false
  };
  //add food
  




  

  
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
function readStock(data){
  foodS = data.val();

}
function writeStock(x){
  database.ref('/').update({
  food: x
  })
};

