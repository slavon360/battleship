var view={
    displayMessage:function(msg){
        var messageArea=document.getElementById('messageArea');
        messageArea.innerHTML=msg;
    },
    displayHit:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss:function(location){
        var cell=document.getElementById(location);
        cell.setAttribute('class', 'miss');
    }
};
var model={
    boardSize:7,
    shipLength:3,
    numShips:3,
    ShipsSunk:0,
    ships:[{locations:[0,0,0], hits:['','','']},{locations:[0,0,0], hits:['','','']},
           {locations:[0,0,0], hits:['','','']}],
    fire: function(guess){
        for(var i=0;i<this.numShips;i++){
            var ship=this.ships[i];
            var index=ship.locations.indexOf(guess);
            if (index>=0) {
                ship.hits[index]="hit";
                view.displayHit(guess);
                view.displayMessage("Hit!");
                if (this.isSunk(ship)) {
                    this.ShipsSunk++;
                    view.displayMessage('You sunk my ship!');
                }
            return true;    
            }
            
        }
        view.displayMiss(guess);
        view.displayMessage('MISS!')
        return false;
    },
    isSunk: function(ship){
        for(var i=0; i<this.shipLength; i++){
            if (ship.hits[i]!=='hit') {
               return false;
            }
        }
        return true;
    },
    generateShip:function(){
        var direction=Math.floor(Math.random()*2);
        var row,col;
        if (direction===1) {
             row=Math.floor(Math.random()*this.boardSize);
             col=Math.floor(Math.random()*(this.boardSize-this.shipLength));
        }else{
             col=Math.floor(Math.random()*this.boardSize);
             row=Math.floor(Math.random()*(this.boardSize-this.shipLength));
        };
        var locationarray=[];
        for(var i=0;i<this.shipLength;i++){
            if (direction===1) {
                locationarray.push(row+''+(col+i));
            }else{
                locationarray.push((row+i)+''+col);
            }
        }
        return locationarray;
    },
    generateShipLocation:function(){
        var location;
        for (var i=0; i<this.numShips;i++){
            do{
                location=this.generateShip();
            }
            while(this.collision(location));
            this.ships[i].locations=location;
        }
    },
    collision: function(location) {
for (var i = 0; i < this.numShips; i++) {
var ship = this.ships[i];
for (var j = 0; j < location.length; j++) {
if (ship.locations.indexOf(location[j]) >= 0) {
return true;
}
}
}
return false;
}
};
var controller={
    guesses:0,
    processGuess:function(guess){
        var location=parseGuess(guess);
        if (location) {
           this.guesses++;
            hitoc=model.fire(location);
           if (hitoc&& model.ShipsSunk === model.numShips) {
         view.displayMessage("You sank all my battleships, in " +
         this.guesses + " guesses");
}
        }
    }
};
function parseGuess(guess){
    var alphabet=['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess===null || guess.length!==2) {
        alert('Please enter a letter and a number from the board')
    }
    else{
        firstChar=guess.charAt(0);
        var row=alphabet.indexOf(firstChar);
        var column=guess.charAt(1);
        if (isNaN(row)||isNaN(column)) {
            alert('coordination off the board');
        }
        else if (row<0||row>=model.boardSize||column<0||column>=model.boardSize) {
            alert('that`s off the board');
        }
        else {
            return row+column;
        }
    }
    return null;
};
function init(){
    var fireButton=document.getElementById('fireButton');
    fireButton.onclick=handleFireButton;
    var guessInput=document.getElementById('guessInput');
    guessInput.onkeypress=handleKeyPress;
    model.generateShipLocation();
};
function handleFireButton(){
    var guessInput=document.getElementById('guessInput');
    var guess=guessInput.value;
    controller.processGuess(guess);
    guessInput.value='';
};
function handleKeyPress(e){
    var fireButton=document.getElementById('fireButton');
    if (e.keyCode===13) {
        fireButton.click();
        return false;
    }
}

window.onload=init;

