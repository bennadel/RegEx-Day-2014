
// I control the main application.
app.controller(
	"AppController",
	function( $scope, Board, dictionaryService, patternService ) {

		// I contain form data (for use with ng-model).
		$scope.form = {
			input: ""
		};

		// I am the user's current scope.
		$scope.score = 0;

		// I am the number of turns the user has left.
		$scope.turnsRemaining = 10;

		// I hold the pattern matrix.		
		$scope.board = new Board( 11, 11 );

		// I hold the collection of words used by the user.
		$scope.usedWords = [];

		// When the user finishes the game, we need to give them the chance to tweet the game
		// for a chance to win (and to spread the word).
		$scope.tweetText = null;

		// As the user enters words, we want to display matches on the board.
		$scope.$watch( "form.input", handleInputChange );


		// ---
		// PUBLIC METHODS.
		// ---


		// I apply the current input to the board, executing a single turn.
		$scope.processInput = function() {

			if ( ! $scope.turnsRemaining ) {

				return( alert( "Thanks for playing! You rock the party that rocks the body!" ) );
			}

			var word = String( $scope.form.input ).toLowerCase();

			// Ignore any partial submits (based on the list of English words we have).
			if ( ! dictionaryService.isWord( word ) ) {

				return( alert( "Sorry, I don't understand that world." ) );

			}

			if ( isAlreadyUsed( word ) ) {

				return( alert( "Shame, shame - You already used this word!" ) );

			}

			// Keep track of the word so that the user cannot use the same word more than once.
			$scope.usedWords.unshift( word );

			var usedPatterns = $scope.board.applySelection();

			// Only score the user if some patterns were matched in the turn.
			if ( usedPatterns.length ) {

				$scope.score += scoreTurn( word, usedPatterns );
				
				$scope.turnsRemaining--;

			}

			// If the user is out of turns, then we need to prepare the tweet - the game is over.
			if ( ! $scope.turnsRemaining ) {

				$scope.tweetText = getTweetText();

			}

			$scope.form.input = "";

		};


		// ---
		// PRIVATE METHODS.
		// ---


		// I return the tweet text for the current game.
		function getTweetText() {

			// TODO: Fix this link once blog post is written.
			var text = ( "Rock on with my bad self! I just scored " + $scope.score + " points on #RegExDay 2014! Play for a chance to win an iPad! http://bjam.in/regex-day-2014" );

			return( encodeURIComponent( text ) );

		}


		// I apply the user's input to the board so as to reveal partial matches.
		function handleInputChange( newValue, oldValue ) {

			// Ignore watch configuration.
			if ( newValue === oldValue ) {

				return;

			}

			$scope.board.applyInput( newValue );

		}


		// I determine if the given word has already been used.
		function isAlreadyUsed( word ) {

			for ( var i = 0, length = $scope.usedWords.length ; i < length ; i++ ) {

				if ( $scope.usedWords[ i ] === word ) {

					return( true );

				}

			}

			return( false );

		}


		// I return a score based on the word given and the patterns matched.
		function scoreTurn( word, patterns ) {

			if ( word.length === 1 ) {

				return( 1 );
					
			} else if ( word.length === 2 ) {

				return( 2 );

			} else {

			 	return( patternService.scorePatterns( patterns ) + ( word.length * 2 ) );
				
			}

		}
		
	}
);
