//collider.js
var enemies = d3.range(0,100).map(function(i)
    {
      var result = {
        id : i,
        x: Math.random()*800 + 10,
        y: Math.random()*600 + 10,
        rgb: [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
      };
      return result;
    });
console.log(enemies);
var board = d3.select("svg");
enemiesDrawn= board.selectAll('circle').data(enemies).enter()
    .append('circle')
      .attr('class', 'enemy')
      .attr('cx', function (enemy) {return enemy.x;})
      .attr('cy', function (enemy) {return enemy.y;})
      .attr('style', function(enemy){return "fill:rgb(" + enemy.rgb.join(",") + ")"})
      .attr('r', 10);

var updateEnemies = function(enemies){
  enemies.map(function(enemy){
    enemy.x = Math.random()*800 + 10;
    enemy.y = Math.random()*600 + 10;
    enemy.rgb = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
  });
};


var moveEnemies = function (){
  updateEnemies(enemies);
  d3.selectAll('circle').data(enemies)
//    .attr('style', function(enemy){return "fill:rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"})
    .attr('style', function(enemy){return "fill:rgb(" + enemy.rgb.join(",") + ")"})
    .transition()
    .duration(500)
    .attr('cx', function(d,i) {return Math.random()*800 + 10})
    .attr('cy', function(d,i) {return Math.random()*600 + 10});
};

setInterval(moveEnemies, 1000);