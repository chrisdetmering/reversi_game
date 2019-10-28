
function Piece (color) {
  this.color = color
}

Piece.prototype.oppColor = function () {
  return this.color === 'white' ? 'black' : 'white'; 
};


Piece.prototype.flip = function () {
  this.color = this.oppColor(); 

  return true; 
};

Piece.prototype.toString = function () {
  return this.color === 'white' ? 'w' : 'b'
};

module.exports = Piece;

