
// I represent the board of regular expression pattern parts.
app.factory(
	"Board",
	function( patternService ) {

		function Board( columns, rows ) {

			var round = 1;

			// I represent the data on the board. The Parts is a linear version of the board, which
			// makes iteration a bit easier.
			var grid = buildGrid();
			var parts = buildList();

			// Return the public API.
			return({
				applyInput: applyInput,
				applySelection: applySelection,
				asList: asList
			});


			// ---
			// PUBLIC METHODS.
			// ---


			// I apply the given user input to the board, selecting all matching patterns.
			function applyInput( input ) {

				resetBoard();

				if ( ! input ) {

					return;

				}


				var paths = [];

				// Set up the initial path selection - this gives us something to start branching on
				// as we start to walk the various path opportunities. 
				angular.forEach(
					parts,
					function( part ) {

						// Skip over self-referencing match - causes really odd matches.
						if ( part.value === "\\1" ) {

							return;

						}

						var pattern = ( "^(" + part.value + ")" );
						var regex = new RegExp( pattern, "i" );

						if ( regex.test( input ) ) {

							paths.push({
								pattern: pattern,
								parts: [ part ]
							});

						}

					}
				);

				// If no paths could be found on the inital pass, there's nothing more we can do.
				if ( ! paths.length ) {

					return;

				}

				// Now that we've gotten the initial selection, branch out from there to find longer 
				// matches. Starting with the last item in the previous iteration, try to branch out
				// in all directions. Keep doing this until no more matches can be found.
				do {

					// I determine if a new branch was found in a known path.
					var newBranchFound = false;

					// I hold the new collection of path calculated during this iteration.
					var newPaths = [];

					// Loop over each current path 
					angular.forEach(
						paths,
						function( path ) {

							// If the current path matches the input in its entirety, then don't 
							// bother branching out - doing so would only break the match.
							if ( ( new RegExp( ( "^" + path.pattern + "$" ), "i" ) ).test( input ) ) {

								return( newPaths.push( path ) );

							}

							var part = last( path.parts );

							// Branching out from the last known location of the current path, see if
							// any of the surrouding board loacations further the match of the input.
							// --
							// NOTE: As we branch out, we do NOT add the current path back into the list;
							// rather, we only add the augmented paths into the new list. In this way,
							// we do not continue to grow the list size with each iteration.
							angular.forEach(
								getRelatedCoordinates( part.x, part.y ),
								function( coordinates ) {

									var nextPart = grid[ coordinates.x ][ coordinates.y ];

									// Skip any self-referencing group - causes really odd matches.
									if ( nextPart.value === ( "\\" + ( path.parts.length + 1 ) ) ) {

										return;

									}

									var pattern = ( path.pattern + "(" + nextPart.value + ")" );
									var regex = new RegExp( pattern, "i" );

									// Make sure that we're not back-tracking.
									if ( doesNotContain( path.parts, nextPart ) && regex.test( input ) ) {

										newPaths.push({
											pattern: pattern,
											parts: path.parts.concat( nextPart )
										});

										newBranchFound = true;

									}

								}
							);

						}
					);
					
					paths = newPaths;

				} while ( newBranchFound );


				// For each path found during the gird walk, select the individual parts.
				angular.forEach(
					paths,
					function( path ) {

						angular.forEach(
							path.parts,
							function( part ) {

								part.isSelected = true;

							}
						);

					}
				);
				
			}


			// I remove the selected items and return the patterns that were removed.
			function applySelection() {

				// Each new part will be marked with a new round indicator; however, we don't want
				// to change the actual round value until we know that we've removed at least one
				// pattern. This way, the rounds don't change on empty selections.
				var nextRound = ( round + 1 );

				var removedPatterns = [];

				for ( var i = 0, length = parts.length ; i < length ; i++ ) {

					var part = parts[ i ];

					if ( part.isSelected ) {

						removedPatterns.push( part.value );

						grid[ part.x ][ part.y ] = {
							x: part.x,
							y: part.y,
							value: patternService.nextPattern(),
							isSelected: false,
							round: nextRound
						};

					}

				}

				// Only update the internal round and list IF at least one pattern was used.
				if ( removedPatterns.length ) {

					round = nextRound;

					// Now that the board has changed, we need to rebuild the list.
					parts = buildList();

				}

				return( removedPatterns );

			}


			// I return the board as a list of parts.
			function asList() {

				return( parts );

			}


			// ---
			// PRIVATE METHODS.
			// ---


			// I build the grid with the given dimensions an populate it.
			function buildGrid() {

				var grid = [];

				// Build across.
				for ( var x = 0 ; x < columns ; x++ ) {

					grid[ x ] = [];

					// Build down.
					for ( var y = 0 ; y < rows ; y++ ) {

						grid[ x ][ y ] = {
							x: x,
							y: y,
							value: patternService.nextPattern(),
							isSelected: false,
							round: round
						};

					}

				}

				return( grid );

			}


			// I build the list version of the grid.
			function buildList() {

				var parts = [];

				for ( var x = 0 ; x < columns ; x++ ) {

					for ( var y = 0 ; y < rows ; y++ ) {

						parts.push( grid[ x ][ y ] );

					}

				}

				return( parts );

			}


			// I return true if the given collection contains at least one instance of the given value.
			function contains( collection, value ) {

				var length = collection.length;

				for ( var i = 0, length = collection.length ; i < length ; i++ ) {

					if ( collection[ i ] === value ) {

						return( true );

					}

				}

				return( false );

			}


			// I return true if the given collection does not contain the given value.
			function doesNotContain( collection, value ) {

				return( ! contains( collection, value ) );

			}


			// I get the directional coordinates (north, south, east, west) around the given position
			// on the gird. All returns parts are in-bounds.
			function getRelatedCoordinates( x, y ) {

				var coordinates = [];

				// West.
				if ( isInBounds( ( x - 1 ), y ) ) {

					coordinates.push({
						x: ( x - 1 ),
						y: y
					});

				}

				// East.
				if ( isInBounds( ( x + 1 ), y ) ) {

					coordinates.push({
						x: ( x + 1 ),
						y: y
					});

				}

				// North.
				if ( isInBounds( x, ( y - 1 ) ) ) {

					coordinates.push({
						x: x,
						y: ( y - 1 )
					});

				}

				// South.
				if ( isInBounds( x, ( y + 1 ) ) ) {

					coordinates.push({
						x: x,
							y: ( y + 1 )
					});

				}

				return( coordinates );

			}


			// I determine if the given coordinates are in-bounds considering the current board dimensions.
			function isInBounds( x, y ) {

				return( ! isOutOfBounds( x, y ) );

			}


			// I determine if the given coordinates are out-of-bounds on the current board dimensions.
			function isOutOfBounds( x, y ) {

				return( 
					( x < 0 ) ||
					( y < 0 ) ||
					( x >= columns ) ||
					( y >= rows )
				);

			}


			// I return the last item in the array.
			function last( collection ) {

				return( collection[ collection.length - 1 ] );

			}


			// I reset the selection of the board parts.
			function resetBoard() {

				for ( var i = 0 ; i < parts.length ; i++ ) {

					parts[ i ].isSelected = false;

				}

			}

		}

		return( Board );

	}
);
