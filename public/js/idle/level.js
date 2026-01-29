// Level class
(function() {
  var WALL_CHANCE = 0.4;
  var tileMap = [];

  function generateTile() {
    if (Math.random() <= WALL_CHANCE) {
      return new Idle.Tile(Idle.Tile.TYPES.WALL);
    } else {
      return new Idle.Tile(Idle.Tile.TYPES.FLOOR);
    }
  }

  function generateColumn(height) {
    var col = [];
    for (var i = 0; i < height; i++) {
      col.push(generateTile());
    }
    return col;
  }

  function generateSeed(width, height) {
    var seed = [];
    for (var i = 0; i < width; i++) {
      seed.push(generateColumn(height));
    }
    return seed;
  }

  function generateTileMap(width, height) {
    var seed = generateSeed(width, height);
    return seed;
  }

  var Level = function(width, height) {
    this.width = width;
    this.height = height;
    tileMap = generateTileMap(width, height);
  };

  Level.prototype.getTileMap = function() {
    return tileMap;
  };

  window.Idle.Level = Level;
})();
