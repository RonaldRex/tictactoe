/**********************************************************
 * AI MANAGER
 * Calculates the computer's move for tic tac toe based on 9
 * strategies: If the opponent's first pick is a corner, edge
 * or center cell and if it is turn 1, 2, or 3 or more.
 *********************************************************/ 

var AIManager = (function () {

	var turnNumber;		//count of the computer's turns
	var initialPosition;	//the position the opponent selects at beginning of a game
	var moves = [];		//list of available moves on the board
	
	//selects which square the computer selects for 4 rounds
	var processMove = function (turn) {
		updateMoves();
		switch (turn) {
			case 1:
				evalStrategy1();
				break;
			case 2: 
				evalStrategy2();
				break;
			case 3: 
				evalStrategy3();
				break;
			case 4: 
				evalStrategy3();
				break;
		}
		
		//getMoves();
		cleanup();	
		turnNumber++;
		
	};
	
	//resets moves list
	var updateMoves = function () {
		//delete any leftover moves
		while (moves.length > 0) {
			moves.pop();
		}
		//search cell for selected squares
		for (var i = 0; i < 9; i++) {
			if (!Tictactoe.board.getCells()[i].isSelected) {
				moves.push(Tictactoe.board.getCells()[i]);
			}
		}
	};
	
	//return moves array
	var getMoves = function () {
		for (var i = 0; i < moves.length; i++) {
			console.log("id:" + moves[i].ID + " " + moves[i].position + " rank:" + moves[i].rank);
		}
		
	};
	
	//helper function for makeMove, marks the cell as selected and updates winning state score for o
	var select = function (num) {
		Tictactoe.board.getCells()[num].isSelected = true;		//mark square as taken
		Tictactoe.board.getCells()[num].addClass("oMark");
		Tictactoe.game.player.o.state += Tictactoe.board.getCells()[num].state;	//update winning state
		
	};
	
	//specifies action to take after running evaluation function
	var makeMove = function () {
		moves.sort(compareRank);	//sort ascending order
		var index = moves.length - 1;	//get the last element
		var id = moves[index].ID;	//find the cell id of this element
		select(id);		//mark the cell
		console.log("move to " + id);
		//moves.pop();	//delete the move from the list
	};
	
	//first turn strategy
	var evalStrategy1 = function () {
	/**
	 * corner:				center:				edge: place mark anywhere in an intersecting row or colomn
	 *
	 *  x  |     |			 o  |     |  		 	 o  |     |  
	 * ----|-----|----	----|-----|----		----|-----|----
	 *     |  o  |    			|  x  |    		 x	|     |      
	 * ----|-----|----	----|-----|----		----|-----|----
	 *     |     |    			|     |    				|     |       
	 *
	 */
	 
	// setInitialPosition
	for (var i = 0; i < 9; i++) {
		if (Tictactoe.board.getCells()[i].isSelected) {
			initialPosition = Tictactoe.board.getCells()[i].position
			console.log("initial position:" + initialPosition);
			break;
		}
	}
	
	 switch (initialPosition) {
		case "corner":
			select(4);		//choose center
			//moves.splice(4,1);	//delete the move from list
			break;
		case "center": case "edge":
			for (var i = 0; i < moves.length; i++) {	//corners rank highest
				if (moves[i].position == "corner") {
					moves[i].rank = 1;
				} else {
					moves[i].rank = -1;
				}
			}
			makeMove();
			
			break;
	 }//end switch
	 
	};
	
	//second turn strategy: if opponent has been making the best moves,
	//computer should block them from winning 
	var evalStrategy2 = function () {
	/**
	 * corner:				center:				edge:
	 *
	 *  x  |  o* |	x		 o  |     |  		  o |     |  
	 * ----|-----|----		----|-----|----		----|-----|----
	 *     |  o  |    		 x	|  x  |  o*		  x	|  x  |  o*    
	 * ----|-----|----		----|-----|----		----|-----|----
	 *     |     |    			|     |    			|     |       
	 *
	 */
		var position = initialPosition;
		switch (position) {
			case "corner":
				//check if any cell makes a win for opponent
				for (var i = 0; i < moves.length; i++) {
					var x = Tictactoe.player.x.state + moves[i].state;
					if (Tictactoe.isWin(x)) {
						moves[i].rank = 1;
					} else if (moves[i].position == "edge") {
						moves[i].rank = 0;
					} else {
						moves[i].rank = -1;
					}
				}
				makeMove();
				break;
			case "center": case "edge":
				//check if any cell makes a win for opponent
				for (var i = 0; i < moves.length; i++) {
					var x = Tictactoe.player.x.state + moves[i].state;
					if (Tictactoe.isWin(x)) {
						moves[i].rank = 1; 
					} else if (moves[i].position == "corner") {
						moves[i].rank = 0;
					} else {
						moves[i].rank = -1;
					}
				}
				makeMove();
				break;
		}//end switch
		
	
	};
	
	//3rd and 4th turn strategy: If opponent has been making the best moves, computer 
	//only needs to search for winning states or block the opponent from winning. 
	var evalStrategy3 = function () {
	/**
	 * corner:				center:				edge:
	 *
	 *  x  |  o  |	x		 	 o  |     |  x 		  o |     |  o* 
	 * ----|-----|----		----|-----|----		----|-----|----
	 *  o* |  o  |    		 x	|  x  |  o 		  x	|  o  |  x    
	 * ----|-----|----		----|-----|----		----|-----|----
	 *     |  x  |    		 o*	|     |  					|     |  x     
	 *
	 */
		 //look for win for o, then x
		 for (var i = 0; i < moves.length; i++) {
			var x = Tictactoe.player.x.state + moves[i].state;
			var o = Tictactoe.player.o.state + moves[i].state;
			if (Tictactoe.isWin(o)) {
				moves[i].rank = 1;
			} else if (Tictactoe.isWin(x)) {
				moves[i].rank = 0;
			} else {
				moves[i].rank = -1;
			}
		}
		
		makeMove();
	};
	
	//helper function to sort moves by rank in ascending order
	var compareRank = function (a, b) {
		return a.rank - b.rank;
	};
	
	var init = function () {
		turnNumber = 1;
		//initialize array of available moves
		//for (var i = 0; i < Tictactoe.cell.length; i++) {
			//moves.push(Tictactoe.cell[i]);
			//moves[i].rank = 0;
		//}
	};
	
	var update = function () {
		processMove(turnNumber);
		console.log("turn:" + turnNumber);
	};
	
	var draw = function () {
		//add class omark to cell
	};
	
	var cleanup = function () {
		turnNumber = 1;
		//delete leftover moves
		//while (moves.length > 0) {
			//moves.pop();
		//}
	};
	
	return {
		init: init,
		update: update,
		draw: draw,
		cleanup: cleanup,
		moves: moves,
		updateMoves: updateMoves,
		getMoves: getMoves,
		compareRank: compareRank,
		evalStrategy1: evalStrategy1
	}

})();

AIManager.init();