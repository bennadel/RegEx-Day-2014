
// I provide a factory for parts of regular expression patterns.
app.service(
	"patternService",
	function( collectionsService ) {

		// I maintain the collection of distributed patterns. This is the collection that the
		// buffer will be based on.
		var patterns = [];

		// I contain a randomly-ordered version of the patterns.
		var buffer = [];

		// I keep track of how much each pattern is worth. 
		var points = {};

		// Scrabble distribution for single letters.
		definePattern( "a", 1, 9 );
		definePattern( "b", 3, 2 );
		definePattern( "c", 3, 2 );
		definePattern( "d", 2, 4 );
		definePattern( "e", 1, 12 );
		definePattern( "f", 4, 2 );
		definePattern( "g", 2, 3 );
		definePattern( "h", 4, 2 );
		definePattern( "i", 1, 9 );
		definePattern( "j", 8, 1 );
		definePattern( "k", 5, 1 );
		definePattern( "l", 1, 4 );
		definePattern( "m", 3, 2 );
		definePattern( "n", 1, 6 );
		definePattern( "o", 1, 8 );
		definePattern( "p", 3, 2 );
		definePattern( "r", 1, 6 );
		definePattern( "s", 1, 4 );
		definePattern( "t", 1, 6 );
		definePattern( "u", 1, 4 );
		definePattern( "v", 4, 2 );
		definePattern( "w", 1, 2 );
		definePattern( "x", 8, 1 );
		definePattern( "y", 1, 2 );
		definePattern( "z", 10, 1 );

		// Pattern distributions.
		definePattern( ".", 1, 10 );
		definePattern( "[a-z]", 1, 2 );
		definePattern( "[aeiou]", 1, 15 );
		definePattern( "[^aeio]", 1, 10 );
		definePattern( "[a-m]", 1, 10 );
		definePattern( "[n-z]", 1, 10 );
		definePattern( "ing", 10, 5 );
		definePattern( "ion", 10, 3 );
		definePattern( "o+", 1, 2 );
		definePattern( "e+", 1, 2 );
		definePattern( "t+", 8, 2 );
		definePattern( "^s", 5, 5 );
		definePattern( "s$", 5, 5 );
		definePattern( "^t", 5, 5 );
		definePattern( "\\1", 30, 5 );
		definePattern( "\\2", 40, 5 );
		definePattern( "\\3", 50, 5 );

		// Two letter cominbations.
		definePattern( "qu?", 1, 2 );
		definePattern( "he", 1, 2 );
		definePattern( "re", 1, 2 );
		definePattern( "an", 1, 2 );
		definePattern( "(s|t)h", 1, 3 );
		definePattern( "e(r|s)", 1, 3 );
		definePattern( "in", 1, 2 );
		definePattern( "ly?", 1, 2 );
		definePattern( "t[eh]", 1, 2 );
		definePattern( "[ai]n", 1, 2 );
		definePattern( "[oea]r", 1, 2 );

		// Return public API.
		return({
			nextPattern: nextPattern,
			scorePattern: scorePattern,
			scorePatterns: scorePatterns
		});


		// ---
		// PUBLIC METHODS.
		// ---


		// I prepare the given pattern for scoring and distribution.
		function definePattern( pattern, value, distribution ) {

			points[ pattern ] = value;

			patterns = patterns.concat( times( pattern, distribution ) );

		}


		// I get the next available pattern.
		function nextPattern() {

			if ( ! buffer.length ) {

				fillBuffer();

			}

			return( buffer.shift() );

		}


		// I return the point score for the given pattern.
		function scorePattern( pattern ) {

			return( points[ pattern ] );

		}


		// I return the aggregate point score for the collection of patterns.
		function scorePatterns( patterns ) {

			var total = 0;

			for ( var i = 0, length = patterns.length ; i < length ; i++ ) {

				total += scorePattern( patterns[ i ] );

			}

			return( total );

		}


		// ---
		// PRIVATE METHODS.
		// ---


		// I fill the patterns buffer in a random order.
		function fillBuffer() {

			buffer = patterns.slice();

			collectionsService.shuffle( buffer );

		}


		// I return an array that is populated with the given value.
		function times( value, count ) {

			var values = Array( count );

			for ( var i = 0 ; i < count ; i++ ) {

				values[ i ] = value;

			}

			return( values );

		}

	}
);