// CanvasGameRenderer class
(function() {
  var TILE_COLOR_MAP = {};
  TILE_COLOR_MAP[Idle.Tile.TYPES.FLOOR] = '#ccc';
  TILE_COLOR_MAP[Idle.Tile.TYPES.WALL] = '#000';

  var CanvasGameRenderer = function(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.tileWidth = this.canvasWidth / game.level.width;
    this.tileHeight = this.canvasHeight / game.level.height;
    this.context = canvas.getContext('2d');
    this.context.font = 'bold 12px sans-serif';
    this.context.textBaseline = 'top';
  };

  CanvasGameRenderer.prototype.render = function() {
    this.renderLevel();
  };

  CanvasGameRenderer.prototype.renderLevel = function() {
    var tileMap = this.game.level.getTileMap();
    for (var x = 0; x < tileMap.length; x++) {
      var col = tileMap[x];
      for (var y = 0; y < col.length; y++) {
        this.renderTile(col[y], x, y);
      }
    }
  };

  CanvasGameRenderer.prototype.renderTile = function(tile, x, y) {
    var pixels = this.coordToPixels(x, y);
    this.context.fillStyle = TILE_COLOR_MAP[tile.type];
    this.context.fillRect(pixels.x, pixels.y, this.tileWidth, this.tileHeight);
  };

  CanvasGameRenderer.prototype.coordToPixels = function(x, y) {
    var xPixels = x * this.tileWidth;
    var yPixels = y * this.tileHeight;
    return { x: xPixels, y: yPixels };
  };

  window.Idle.CanvasGameRenderer = CanvasGameRenderer;
})();
