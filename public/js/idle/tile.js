// Tile class
(function() {
  var Tile = function(type) {
    this.type = type;
  };

  Tile.TYPES = {
    FLOOR: 0,
    WALL: 1
  };

  window.Idle.Tile = Tile;
})();
