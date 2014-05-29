
// I provide a some useful collections functions.
app.service(
	"collectionsService",
	function( ) {

		// Return public API.
		return({
			shuffle: shuffle,
			swap: swap
		});


		// ---
		// PUBLIC METHODS.
		// ---


		// I shuffle the collection using the given rand-range implementation. If
		// no implementation is provided, the default implementation is used.
		// --
		// NOTE: Uses the Fisher-Yates shuffle algorithm.
		function shuffle( collection ) {

			var length = collection.length;
			var i = length;

			// Loop backwards through the list, randomly swapping indices.
			while( --i ) {

				var j = randRange( i );

				if ( i !== j ) {

					swap( collection, i, j );

				}

			}

			return( collection );

		}


		// I swap the value at the given indices in the given collection.
		function swap( collection, i, j ) {

			var tempValue = collection[ i ];

			collection[ i ] = collection[ j ];
			collection[ j ] = tempValue;

		}


		// ---
		// PRIVATE METHODS.
		// ---


		// I generate a random integer between the min and max, both of which are
		// inclusive in the range. If the "min" argument is omitted, the range is
		// assumed to be zero-to-max.
		function randRange( min, max ) {

			// If only one argument, assumed to be Max.
			if ( arguments.length === 1 ) {

				max = arguments[ 0 ];
				min = 0;

			}

			var range = ( max - min + 1 );

			var offset = Math.floor( range * Math.random() );

			return( min + offset );

		}

	}
);
