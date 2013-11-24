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
      .style('fill', function(enemy){return "rgb(" + enemy.rgb.join(",") + ")";})
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
    .transition()
    .duration(1000)
    .attr('cx', function(d,i) {return Math.random()*800 + 10})
    .style('fill', function(enemy){return "rgb(" + enemy.rgb.join(",") + ")";})
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
  var temp = addEnemies;
  addEnemies = function(){};
  makeEnemies(0);
  drawEnemies();
  d3.select('ellipse').transition().duration(2000)
  .attr('rx',800)
  .attr('ry',800);
  d3.select('image').transition().duration(2000)
  .attr('height',1600)
  .attr('width',1600).each("end",function(){
  d3.select('image').transition().duration(400)
  .attr('xlink:href',"fredLoss.png");});
  setTimeout(function(){
  d3.select('ellipse').transition().duration(100)
  .attr('rx',22)
  .attr('ry',22);
  d3.select('image').transition().duration(100)
  .attr('height',50)
  .attr('width',50)
  .attr('xlink:href',"fred.png");
    makeEnemies(enemyCount);
    drawEnemies();
    addEnemies = temp;
  },3000);

};

var changeScores = function(c, h, ec){
  currentScore = c;
  highScore = h;
  d3.select('#current-score span').text(c);
  d3.select('#high-score span').text(h);
  d3.select('.level span').text(ec);
};


var addEnemies = function(){
  currentScore += 500;
  if (currentScore >= highScore){
    highScore = currentScore;
  }
  changeScores(currentScore,highScore,enemyCount);
  moveEnemies();
};

setInterval(function(){
  addEnemies();
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


