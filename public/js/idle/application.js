// Idle Dungeon Application
window.requestAnimationFrame(function() {
  console.log("In request animation frame");
  var canvas = document.getElementById('idle-canvas');

  if (canvas) {
    console.log("Creating idle game");
    var level = new Idle.Level(40, 40);
    window.game = new Idle.Game(level);
    window.cgr = new Idle.CanvasGameRenderer(canvas, game);
    cgr.render();
  } else {
    console.log("No game canvas detected for the idle game. Aborting");
  }
});
