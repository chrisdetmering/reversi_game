let Piece = require("./piece");

function _makeGrid () {
  var grid = new Array(8).fill(null); 

  for (let i = 0; i < 8; i++) { 
    grid[i] = new Array(8).fill('_'); 

  }

  grid[3][4] = new Piece('black');
  grid[4][3] = new Piece('black'); 

  grid[3][3] = new Piece('white'); 
  grid[4][4] = new Piece('white'); 


  return grid; 
}

function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

Board.prototype.getPiece = function (pos) {
    if (!this.isValidPos(pos)) { 
      throw new Error("Not valid pos!"); 
    } 

    return this.grid[pos[0]][pos[1]]; 
};

Board.prototype.hasMove = function (color) {
  let validMoves = this.validMoves(color); 

  return validMoves.length > 0;
};

Board.prototype.isMine = function (pos, color) {
  return color === this.getPiece(pos).color; 
};

Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) instanceof Piece; 
};

Board.prototype.isOver = function () {
  return !(this.hasMove('white') && this.hasMove('black')); 
};

Board.prototype.isValidPos = function (pos) {
  return (Math.max(...pos) < 8 && Math.min(...pos) >= 0); 
};

function _positionsToFlip (board, pos, color, dir, piecesToFlip=[]) {
  const newPos = pos.map((num, idx) => num + dir[idx]); 

  if (!board.isValidPos(newPos)) { return null; } 
  if (piecesToFlip.length === 0 && board.isMine(newPos, color)) { return null; }
  if (!board.isOccupied(newPos)) { return null; } 

  if (!board.isMine(newPos, color)) {
    piecesToFlip.push(newPos);
    let newPiecesToFlip = piecesToFlip;                 
    return _positionsToFlip(board, newPos, color, dir, newPiecesToFlip); 
  } 

   return piecesToFlip; 
}

Board.prototype.placePiece = function (pos, color) {
  let validMoveAndPos = this.validMove(pos, color); 
  let validMove = validMoveAndPos[0]; 
  let piecesToFlip = validMoveAndPos.slice(1); 
  
  try {
      if (validMove) { 
        this.grid[pos[0]][pos[1]] = new Piece(color);  

        piecesToFlip.forEach(pos => { 
            pos.forEach(cord=>{ 
              let piece = this.getPiece(cord);
              piece.flip(); 
            })
        });

      } else { 
        throw 'This is not a valid move!'; 
      } 

    } catch(e) { 
      console.log(e);
    }

};

Board.prototype.checkEachDir = function (pos, color) { 
    let allPossFlips = []; 

  for (let i = 0; i < Board.DIRS.length; i++) { 
      let dir = Board.DIRS[i]; 

      possFlips = _positionsToFlip(this, pos, color, dir, piecesToFlip = [])
      
      if (possFlips instanceof Array ) { 
          allPossFlips.push(possFlips)
      } 
  }

   return allPossFlips   
}

Board.prototype.print = function () {
    console.log('  0 1 2 3 4 5 6 7');
  this.grid.forEach((row, i) => { 
    console.log(`${i} ${row.join(' ')}`);
  })
};

Board.prototype.validMove = function (pos, color) {
  if (!this.isOccupied(pos))  { 

    let possFlips = this.checkEachDir(pos, color); 

    if (possFlips.length > 0) { 
      return [true, ...possFlips]
    }
  }

  return [false]; 
}

Board.prototype.validMoves = function (color) {
  let validMoves = []; 
  
  for (let i = 0; i < 8; i++) { 
    for (let j = 0; j < 8; j++) { 
      let pos = [i, j]

      if (this.validMove(pos, color)[0]) { 
          validMoves.push(pos)
      }

    }
  }

  return validMoves; 
};

module.exports = Board;

