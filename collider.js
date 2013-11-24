//collider.js
var enemies = [];
var board = d3.select("svg");
var el = d3.select('ellipse');
var enem, highScore=0, currentScore=0, enemyCount=1;
var playerData = {
  x: Math.random()*800 + 10,
  y: Math.random()*600 + 10,
  r: 13
};


makeEnemies = function(count){
  enemies = d3.range(0,count).map(function(i)
    {
      var result = {
        id : i,
        x: Math.random()*800 + 10,
        y: Math.random()*600 + 10,
        rgb: [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)],
        r: Math.ceil(Math.random()*5)+10
      };
      return result;
    });
};

var drawEnemies = function(){
  enem = board.selectAll('circle').data(enemies);
  enem.enter()
    .append('circle')
      .attr('class', 'enemy')
      .attr('cx', function (enemy) {return enemy.x;})
      .attr('cy', function (enemy) {return enemy.y;})
      .attr('style', function(enemy){return "fill:rgb(" + enemy.rgb.join(",") + ")"})
      .attr('r', function (enemy) {return enemy.r;});
  enem.exit().remove();

};

// $(document).ready(function(){
//   $("#enemyCount").keyup(function(){
//     makeEnemies($(this).val());
//     drawEnemies();
//   });
// });

makeEnemies(1);
drawEnemies();


var dragMove = function (){
  movePlayer(el,d3.event.dx, d3.event.dy);
};

var movePlayer = function(player,x,y){
  playerData.x += x;
  playerData.y += y;
  player.data([playerData])
    .attr('cx', function (d) {return d.x;})
    .attr('cy', function (d) {return d.y;});
};

var drag = d3.behavior.drag().on('drag', dragMove);

movePlayer(el,0,0);
el.call(drag);
var updateEnemies = function(enemies){
  enemies.map(function(enemy){
    enemy.x = Math.random()*800 + 10;
    enemy.y = Math.random()*600 + 10;
    enemy.rgb = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
  });
};

var moveEnemies = function (){
  updateEnemies(enemies);
  enem
    .attr('style', function(enemy){return "fill:rgb(" + enemy.rgb.join(",") + ")"})
    .transition()
    .duration(500)
    .attr('cx', function(d,i) {return Math.random()*800 + 10})
    .attr('cy', function(d,i) {return Math.random()*600 + 10});
};

var detectCollision = function(enemy){
  var xdif,ydif,sep,radiusSum;
  xdif = parseFloat(enemy.attr('cx')) - playerData.x;
  //console.log(enemy.r);
  ydif = parseFloat(enemy.attr('cy')) - playerData.y;
  sep = Math.sqrt(xdif * xdif + ydif * ydif);
  radiusSum = parseInt(enemy.attr('r')) + playerData.r;
  if (sep < radiusSum){
    killAllHumans();
  }
};

var killAllHumans = function(){
  changeScores(0,highScore,1);
  enemyCount = 1;
  makeEnemies(enemyCount);
  drawEnemies();
};

var changeScores = function(c, h, ec){
  currentScore = c;
  highScore = h;
  d3.select('#current-score span').text(c);
  d3.select('#high-score span').text(h);
  d3.select('.level span').text(ec);
};

setInterval(function(){
  currentScore += 50;
  if (currentScore >= highScore){
    highScore = currentScore;
  }
  changeScores(currentScore,highScore,enemyCount);
  moveEnemies();
}, 1000);

setInterval(function(){
  enemyCount++;
  makeEnemies(enemyCount);
  drawEnemies();
}, 5000);

d3.timer(function(){
  enem.each(function(enemy){
    enemy = d3.select(this);
    detectCollision(enemy);
  });
});


