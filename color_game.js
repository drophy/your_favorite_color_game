// HTML ELEMENTS
var arrSquares = document.querySelectorAll(".square");
var info = document.querySelector("#info");
var header = document.querySelector("h1");
var reset = document.querySelector("#reset");
var bInstructions = document.querySelector("#bInstructions");
var bDone = document.querySelector("#bDone");
var link = document.querySelector("a");

// AIDING ELEMENTS
var arrHexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
var arrColors; // stores the colors that will be added to the squares
var stage; // counts which stage we're in
var starterStagesQuantity = 3; // in these colors are chosen randomly
var alterOffset = 128; // will help make the changes less drastic in latter rounds

// FLOW
stage = 1;

// Confirm connection
console.log("color_game.js connected successfully");

// Filling squares w random colors
fillRandom(9);

// Adding a listener to each in case they're clicked
for(var i = 0; i < arrSquares.length; i++)
{
   arrSquares[i].addEventListener("click", function(){
      // Save chosen color
      var chosenColor = this.style.backgroundColor;
      console.log(chosenColor + " was chosen");
      // Update banner thingy
      info.textContent = "Your favourite colour might be " + chosenColor;
      info.innerHTML = `Your favourite colour might be <span>${chosenColor}<span>`;
      info.querySelector('span').style.backgroundColor = header.style.backgroundColor = chosenColor;
      info.querySelector('span').style.color =header.style.color = contrastingColor(chosenColor);
      // Update Done! button
      link.setAttribute("href", "https://www.colorhexa.com/" + rgbToHex(chosenColor));
      // Generate new colors and update them
      nextStage(chosenColor);
   })
}

// If reset (no console.clear() tho)
reset.addEventListener("click", function(){
   stage = 1;
   alterOffset = 128;

   header.style.backgroundColor = "rgb(49, 183, 189)";
   header.style.color = "white";
   info.textContent = "";

   arrSquares.forEach(square => square.style.display = 'initial'); // unhides any previously hiden squares
   fillRandom(9);
});

// If Instructions
bInstructions.addEventListener("click", function(){
   alert("Pick one out of the 9 colours presented. After " + starterStagesQuantity + " stages, colours will start looking more and more similar to your last choice. Once you're happy with your choice, click the \"Done!\" button. It will redirect you to colorhexa.com, where you can learn more about your favourite colour!");
})


// FUNCTIONS
function genRandomColor()
{
   var r = Math.floor(Math.random() * 256);
   var g = Math.floor(Math.random() * 256);
   var b = Math.floor(Math.random() * 256);
   // e.g. rgb(255, 255, 255)
   return "rgb(" + r + ", " + g + ", " + b + ")";
}

function genArrColors(quantity)
{
   var arrColors = [];

   for(var i = 1; i <= quantity; i++)
      arrColors.push(genRandomColor());

   return arrColors;
}

function contrastingColor(txColor)
{
   // e.g. "rgb(255, 25, 2)""
   var iComa = txColor.indexOf(",");
   var r = txColor.slice(4, iComa); // iComa is not inclusive

   txColor = txColor.slice(iComa+2, txColor.length-1); // ", " and ")" are lost
   // e.g. "25, 2"
   iComa = txColor.indexOf(",");
   var g = txColor.slice(0, iComa);
   var b = txColor.slice(iComa+2, txColor.length);

   if(Number(r) + Number(g) + Number(b) > 500) return "rgb(34, 34, 34)"; // 384
   else return "white";
}

function fillRandom(quantity)
{
   arrColors = genArrColors(quantity);
   for(var i = 0; i < arrSquares.length; i++)
      arrSquares[i].style.backgroundColor = arrColors[i];
}

function overwritteAtRandom(txColor)
{
   arrSquares[Math.floor(Math.random()*9)].style.backgroundColor = txColor;
}

function fillAlters(chosenColor)
{
   // Original color stays in the middle
   arrColors[4] = chosenColor;

   // Alter colors are calculated
   let [r, g, b] = chosenColor.slice(4, chosenColor.length-1).split(',').map(n => Number(n)); // slice removes 'rgb(' and ')'

   var alterValueR; // squares 0 an 2 change R value
   var alterValueG; // squares 3 an 5 change G value
   var alterValueB; // squares 6 an 8 change B value
   // squares 1 an 7 are darker and lighter respectively

   r - alterOffset < 0? alterValueR = 0: alterValueR = r - alterOffset;
   g - alterOffset < 0? alterValueG = 0: alterValueG = g - alterOffset;
   b - alterOffset < 0? alterValueB = 0: alterValueB = b - alterOffset;

   arrColors[0] = "rgb(" + alterValueR + ", " + g + ", " + b + ")";
   arrColors[3] = "rgb(" + r + ", " + alterValueG + ", " + b + ")";
   arrColors[6] = "rgb(" + r + ", " + g + ", " + alterValueB + ")";
   arrColors[1] = "rgb(" + alterValueR + ", " + alterValueG + ", " + alterValueB + ")";

   r + alterOffset > 255? alterValueR = 255: alterValueR = r + alterOffset;
   g + alterOffset > 255? alterValueG = 255: alterValueG = g + alterOffset;
   b + alterOffset > 255? alterValueB = 255: alterValueB = b + alterOffset;

   arrColors[2] = "rgb(" + alterValueR + ", " + g + ", " + b + ")";
   arrColors[5] = "rgb(" + r + ", " + alterValueG + ", " + b + ")";
   arrColors[8] = "rgb(" + r + ", " + g + ", " + alterValueB + ")";
   arrColors[7] = "rgb(" + alterValueR + ", " + alterValueG + ", " + alterValueB + ")";

   // We check if there are any repeated colors
   let setColors = new Set();
   arrColors = arrColors.map(color => {
      if(setColors.has(color)) return null; // if one is found, it's replaced for 'null'
      else {
         setColors.add(color);
         return color;
      }
   });

   // Squares are filled unless we saw they had a repeated color
   arrSquares.forEach(square => square.style.display = 'initial'); // unhides any previously hiden squares

   for(let i = 0; i < arrSquares.length; i++) {
      if(arrColors[i] === null) arrSquares[i].style.display = 'none'; // to have an element take up the space that it would normally take, but without actually rendering anything, use the visibility property instead.
      else arrSquares[i].style.backgroundColor = arrColors[i];
   }
}

function nextStage(chosenColor)
{
   stage++;

   if(stage <= starterStagesQuantity)
   {
      // Filling with random colors
      fillRandom(9);

      // Overwritting chosen color
      overwritteAtRandom(chosenColor);
   }
   else
   {
      if(alterOffset === 2)
      {
         alert ("From now on, colours will just change 1 unit. The difference is virtually none. Click on \"New colours\" to start over or in \"Done!\" to learn more about the last color you chose and explore more similar and complementary colours.");
         info.innerHTML = `Your favourite colour is <span>${chosenColor}<span>`;
         info.querySelector('span').style.backgroundColor = header.style.backgroundColor = chosenColor;
         info.querySelector('span').style.color =header.style.color = contrastingColor(chosenColor);
      }

      fillAlters(chosenColor);
      if(alterOffset > 1) alterOffset = alterOffset/2;
   }
}

function hex(n)
{
   var D1 = 0, D0 = 0;

   for(var i = 1; i <= n; i++)
   {
      D0++; // catches up to i

      if(D0 === 16)
      {
         D0 = 0;
         D1++;
      }
   }

   return arrHexDigits[D1] + arrHexDigits[D0]; // returns a string
}

function rgbToHex(chosenColor)
{
   var iComa = chosenColor.indexOf(",");
   var r = Number(chosenColor.slice(4, iComa));

   chosenColor = chosenColor.slice(iComa+2, chosenColor.length-1); // first ", " and ")" are lost

   iComa = chosenColor.indexOf(",");
   var g = Number(chosenColor.slice(0, iComa));
   var b = Number(chosenColor.slice(iComa+2, chosenColor.length));

   return hex(r) + hex(g) + hex(b); // hex returns a string, don't worry; it's not a sum
}
