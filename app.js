$(document).ready(function(){

	//variables
	var winningNumber = generateWinningNumber();
	var playersGuess;
	var isGameOver = false;
	var HintProvided = false;
	var remaining = 5;
	var previousGuess = [];


	/* **** Event Listeners/Handlers ****  */
	$("#submit").on("click", playersGuessSubmission);
	$("#refresh").on("click", playAgain);
	$("#hint").on("click", provideHint);

	//when a player ENTERs, the app recognize it as an input, 
	//and invoke the playersGuessSubmission function
	$("input[type='text'").on("keypress", function(event){
		if(event.which === 13){
			playersGuessSubmission();
		}
	});

	/* **** Guessing Game Functions **** */
	// Generate the Winning Number
	function generateWinningNumber(){
		return Math.floor(Math.random()*100+1);
	}

	// Fetch the Players Guess
	function playersGuessSubmission(){
		//retrieve Guess input from the text-box
		var inputGuess = +$('input').val();

		//validate the input number(1 - 100)
		if(inputGuess > 100 || inputGuess < 1 || isNaN(inputGuess)){
			$('.alert').remove();	
			var inputValidError = "<div class='alert alert-danger' role='alert'><h4>Invalid input! Please input numbers between 1-100</h4></div>";
			$('.status').prepend(inputValidError).show();
			$('input').val('');
		} else {
			$('input').val('');
			checkGame(inputGuess);
		}
	}

	//Check if the game is over, or the player submitted a duplicate number
	function checkGame(input){
		$('.alert').remove();
		if(isGameOver || remaining === 0){
			var alertGameOver = "<div class='alert alert-danger' role='alert'><h4>Game is already OVER!!! Please refresh the game</h4></div>";
			$('.status').prepend(alertGameOver).show();
		} else if(previousGuess.indexOf(input) !== -1){
			alert("You submitted a duplicate guess!");
		} else {
			//keep track of previously input guess numbers by putting them into an array
			previousGuess.push(input);
			$("#previousGuessArray").text(previousGuess);
			playersGuess = input;

			//as the player input a number, the remaining number of games decreases
			remaining --;
			$("#remainingGame").text(remaining);

			hintProvided = false;
			console.log('winning: '+winningNumber+' previousGuess: '+previousGuess+' remaining: '+remaining);

			checkGuess(winningNumber, playersGuess);
		}
	}

	//Check if the Player's Guess is the winning number
	function checkGuess(winNum, guessNum){
		if(winNum === guessNum){
			var playerWonMsg = "<div class='alert alert-success' role='alert'><h4>You WIN! Your guess is CORRECT!</h4></div>"
			$('.status').prepend(playerWonMsg).show();

			isGameOver = true;

		} else {
			if(remaining === 0){
				$('.alert').remove();
				var alertGameOver = "<div class='alert alert-danger' role='alert'><h4>Game is OVER!!! Please refresh the game</h4></div>";
				$('.status').prepend(alertGameOver).show();
			} else {

			//if the numbers don't match, check if the guess is higher or lower than the winning number		
			lowerOrHigher(winNum, guessNum);
			}
		}
	}

	// Determine if the next guess should be a lower or higher number
	function lowerOrHigher(winNum, guessNum){
		var diff = Math.abs(winNum - guessNum);
		var stringHTML="<div class='alert alert-danger' role='alert'><h4>You are ";

		if(winNum - guessNum > 0){
			stringHTML +='<span id="cold">COLD</span>!';
		} else {
			stringHTML +='<span id="hot">HOT</span>!';
		}

		//check if the guess is within 10, then within 20 digits from the winning number
		if (diff <= 10){  
			stringHTML +='\nYour guess is within 10 digits of the winning number</h4>';
		} else if (diff <=20) { 
			stringHTML +='\nYour guess is within 20 digits of the winning number</h4>';
		}

		stringHTML +="</div>";
		$('.status').prepend(stringHTML).show();
	}


	// Create a provide hint button that provides additional clues to the "Player"
	function provideHint(){
		$('.alert').remove();
		//by using a boolean, check if the player is already provided with a hint for this attempt
		if(hintProvided === true){
			var hintAlert = "<div class='alert alert-danger' role='alert'><h4>Hints are already provided!</h4>";
			$('.status').prepend(hintAlert).show();		
		} else if(isGameOver){
			var alertGameOver = "<div class='alert alert-danger' role='alert'><h4>Game is already OVER!!! Please refresh the game</h4></div>";
			$('.status').prepend(alertGameOver).show();
		}else {
			var hintArray = [];
			hintArray.push(winningNumber);
			while(hintArray.length < remaining *2){
				var temp = generateWinningNumber();
				if(hintArray.indexOf(temp) === -1){
					hintArray.push(temp);
				}
			}
			
			alert(remaining+" guess(es) remaining, Display "+hintArray.length+" numbers as hints (1 will be the winning number)\n"+hintArray.sort(function(a, b){
				return a>b;
			}));
			hintProvided = true;
		}
	}

	// Allow the "Player" to Play Again
	function playAgain(){
		var playAgainMsg = "<div class='alert alert-info' role='alert'><h4>Play Again!</h4></div>";
		$('.alert').remove();
		$('.status').prepend(playAgainMsg).show();

		remaining = 5;
		$("#remainingGame").text(remaining);

		previousGuess = [];
		$("#previousGuessArray").text(previousGuess);
		
		isGameOver = false;
		winningNumber = generateWinningNumber();
	}
})






