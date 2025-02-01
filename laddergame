/*************************************************************
 * ladderGame.js
 * 
 * This JS file sets up the "Game 2 / Ladder Game" only.
 * Make sure you include <script src="https://cdn.jsdelivr.net/npm/sat@0.5.0/build/sat.min.js"></script>
 * in your Qualtrics HTML before referencing this file.
 ************************************************************/

/** Constants for the "ladder game" only **/
const CONSTANTS = {
  GAME2_PLAYER_TOP_LEFT_POINT_X: 145,
  GAME2_PLAYER_TOP_LEFT_POINT_Y: 90,
  GAME2_PLAYER_WIDTH: 10,
  GAME2_PLAYER_HEIGHT: 20,
  GAME2_PLAYER_MIN_Y: 50,
  GAME2_PLAYER_MAX_Y: 130,
  GAME2_PLAYER_STEP: 20,
  GAME2_PLAYER_FILL: 'blue',
  GAME2_PLAYER_STROKE: 'black',
  GAME2_PLAYER_STROKE_WIDTH: 2,

  GAME2_RP_OBSTACLE_START_POINT_A_X: -20,
  GAME2_RP_OBSTACLE_START_POINT_A_Y: 50,
  GAME2_RP_OBSTACLE_START_POINT_B_X: -20,
  GAME2_RP_OBSTACLE_START_POINT_B_Y: 60,
  GAME2_RP_OBSTACLE_START_POINT_C_X: -5,
  GAME2_RP_OBSTACLE_START_POINT_C_Y: 55,
  GAME2_OBSTACLES_STEP: 2,

  GAME2_LP_OBSTACLE_START_POINT_A_X: 320,
  GAME2_LP_OBSTACLE_START_POINT_A_Y: 90,
  GAME2_LP_OBSTACLE_START_POINT_B_X: 320,
  GAME2_LP_OBSTACLE_START_POINT_B_Y: 100,
  GAME2_LP_OBSTACLE_START_POINT_C_X: 305,
  GAME2_LP_OBSTACLE_START_POINT_C_Y: 95,

  GAME2_POINT_TO_RESET_RP_OBSTACLE_X: 200,
  GAME2_POINT_TO_RESET_LP_OBSTACLE_X: 120,

  GAME2_BACKGROUND_TOP_LEFT_X: 145,
  GAME2_BACKGROUND_TOP_LEFT_Y: 50,
  GAME2_BACKGROUND_RECTS_WIDTH: 10,
  GAME2_BACKGROUND_RECTS_HEIGHT: 20,
  GAME2_BACKGROUND_RECTS_COUNT: 5,
  GAME2_BACKGROUND_RECTS_FILL: 'none',
  GAME2_BACKGROUND_RECTS_STROKE: 'black',
  GAME2_BACKGROUND_RECTS_STROKE_WIDTH: 2
};

/** Basic helpers **/
function isRealNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); }
function validateIfRealNumber(value,name){
  if(!isRealNumber(value)) throw new Error((name||'value')+' must be a real number');
}
function validateIfString(value,name){
  if(typeof value!=='string') throw new Error((name||'value')+' must be a string');
}

/** Base object for game shapes **/
const GameObject = {
  init(x,y,collisionProfile,fill,stroke,strokeWidth){
    this.xCoordinate = x;
    this.yCoordinate = y;
    this.collisionProfile = collisionProfile;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    return this;
  },
  getCoordinatesAsArray(){
    return [this.xCoordinate, this.yCoordinate];
  }
};

/** Triangle shape (for obstacles) **/
const Triangle = Object.create(GameObject);
Object.defineProperty(Triangle,'init',{
  value:function(xA,yA,xB,yB,xC,yC,collisionProfile,fill,stroke,strokeWidth){
    GameObject.init.call(this,xA,yA,collisionProfile,fill,stroke,strokeWidth);
    this.xCoordinateB = xB;
    this.yCoordinateB = yB;
    this.xCoordinateC = xC;
    this.yCoordinateC = yC;
    return this;
  }
});
Object.defineProperty(Triangle,'getCoordinatesAsArray',{
  value:function(){
    const base = GameObject.getCoordinatesAsArray.call(this);
    base.push(this.xCoordinateB,this.yCoordinateB,this.xCoordinateC,this.yCoordinateC);
    return base;
  }
});

/** Rectangle shape (for player) **/
const Rectangle = Object.create(GameObject);
Object.defineProperty(Rectangle,'init',{
  value:function(x,y,w,h,collisionProfile,fill,stroke,strokeWidth){
    GameObject.init.call(this,x,y,collisionProfile,fill,stroke,strokeWidth);
    this.width=w;
    this.height=h;
    return this;
  }
});
Object.defineProperty(Rectangle,'getCoordinatesAsArray',{
  value:function(){
    const arr=GameObject.getCoordinatesAsArray.call(this);
    // top-left -> top-right -> bottom-right -> bottom-left
    let bx=this.xCoordinate+this.width, by=this.yCoordinate;
    let cx=this.xCoordinate+this.width, cy=this.yCoordinate+this.height;
    let dx=this.xCoordinate,        dy=this.yCoordinate+this.height;
    arr.push(bx,by,cx,cy,dx,dy);
    return arr;
  }
});

/** Factory for building shapes w/ SAT.js collision profiles **/
function getTriangle(xA,yA,xB,yB,xC,yC,fill,stroke,strokeWidth){
  // Using window.SAT library
  const SATv = window.SAT.Vector;
  const SATp = window.SAT.Polygon;
  const aAbs=new SATv(xA,yA);
  const aRelA=new SATv(0,0);
  const bRelA=new SATv(xB-xA,yB-yA);
  const cRelA=new SATv(xC-xA,yC-yA);
  const poly=new SATp(aAbs,[aRelA,bRelA,cRelA]);
  return Object.create(Triangle).init(xA,yA,xB,yB,xC,yC,poly,fill,stroke,strokeWidth);
}
function getRectangle(x,y,w,h,fill,stroke,strokeWidth){
  const box = new window.SAT.Box(new window.SAT.Vector(x,y),w,h).toPolygon();
  return Object.create(Rectangle).init(x,y,w,h,box,fill,stroke,strokeWidth);
}

/** Player object **/
const Player = {
  init(shape,direction){
    this.shape=shape; // e.g. Rectangle
    this.direction=direction; 
    return this;
  }
};

/** Abstract renderer + "Game2" renderer **/
const Renderer = {
  clearStage(){throw new Error('Renderer must implement clearStage()');},
  render(gObj){throw new Error('Renderer must implement render()');}
};

const Game2Renderer = Object.create(Renderer);
(function(){
  let backgroundDrawn=false, isPlayerDrawn=false;
  const svgNs='http://www.w3.org/2000/svg';
  const svgContainer=document.getElementById('the-svg');

  let firstObstacle=document.createElementNS(svgNs,'path');
  let secondObstacle=document.createElementNS(svgNs,'path');
  let obstaclesCount=0;
  let playerRect=document.createElementNS(svgNs,'rect');

  function drawBackground(){
    svgContainer.style.display='inline-block';
    for(let i=0;i<CONSTANTS.GAME2_BACKGROUND_RECTS_COUNT;i++){
      let r=document.createElementNS(svgNs,'rect');
      r.setAttribute('x',CONSTANTS.GAME2_BACKGROUND_TOP_LEFT_X);
      r.setAttribute('y',CONSTANTS.GAME2_BACKGROUND_TOP_LEFT_Y + i*CONSTANTS.GAME2_BACKGROUND_RECTS_HEIGHT);
      r.setAttribute('width',CONSTANTS.GAME2_BACKGROUND_RECTS_WIDTH);
      r.setAttribute('height',CONSTANTS.GAME2_BACKGROUND_RECTS_HEIGHT);
      r.setAttribute('fill',CONSTANTS.GAME2_BACKGROUND_RECTS_FILL);
      r.setAttribute('stroke',CONSTANTS.GAME2_BACKGROUND_RECTS_STROKE);
      r.setAttribute('stroke-width',CONSTANTS.GAME2_BACKGROUND_RECTS_STROKE_WIDTH);
      svgContainer.appendChild(r);
    }
  }

  Object.defineProperty(Game2Renderer,'clearStage',{
    value:function(){
      // The original game2 code doesn't actually clear or remove children.
      // We'll do nothing to match its logic.
    }
  });

  Object.defineProperty(Game2Renderer,'render',{
    value:function(gObj){
      // draw background 1x
      if(!backgroundDrawn){
        backgroundDrawn=true;
        drawBackground();
      }
      // Is it a triangle => obstacles
      if(Triangle.isPrototypeOf(gObj)){
        if(obstaclesCount<2){
          obstaclesCount++;
          if(obstaclesCount===1){
            updateObstacle(firstObstacle,gObj); 
            svgContainer.appendChild(firstObstacle);
          } else {
            updateObstacle(secondObstacle,gObj);
            svgContainer.appendChild(secondObstacle);
          }
        } else {
          // update whichever obstacle matches .id
          if(gObj.id===1) updateObstacle(firstObstacle,gObj);
          else updateObstacle(secondObstacle,gObj);
        }
      } else {
        // it's the player rect
        playerRect.setAttribute('x',gObj.xCoordinate);
        playerRect.setAttribute('y',gObj.yCoordinate);
        playerRect.setAttribute('width',gObj.width);
        playerRect.setAttribute('height',gObj.height);
        playerRect.setAttribute('fill',gObj.fill);
        playerRect.setAttribute('stroke',gObj.stroke);
        playerRect.setAttribute('stroke-width',gObj.strokeWidth);
        if(!isPlayerDrawn){
          isPlayerDrawn=true;
          svgContainer.appendChild(playerRect);
        }
      }
    }
  });

  function updateObstacle(pathElem, tri){
    pathElem.setAttribute('fill','black');
    let d= `M ${tri.xCoordinate} ${tri.yCoordinate}`+
           ` L ${tri.xCoordinateB} ${tri.yCoordinateB}`+
           ` L ${tri.xCoordinateC} ${tri.yCoordinateC} z`;
    pathElem.setAttribute('d',d);
  }
})();

/** Game2ObjectsManager: moves obstacles, player, etc. **/
const GameObjectManager = {
  move(gObj,dx,dy){
    validateIfRealNumber(dx,'dx');
    validateIfRealNumber(dy,'dy');
    gObj.xCoordinate+=dx; 
    gObj.yCoordinate+=dy;
    gObj.collisionProfile.pos.x+=dx;
    gObj.collisionProfile.pos.y+=dy;
    if(Triangle.isPrototypeOf(gObj)){
      gObj.xCoordinateB+=dx; gObj.yCoordinateB+=dy;
      gObj.xCoordinateC+=dx; gObj.yCoordinateC+=dy;
    }
  }
};

const Game2ObjectsManager = Object.create(GameObjectManager);
(function(){
  let isUp=false, isDown=false;
  let possibleY=[55,75,95,115,135];
  let len=possibleY.length;

  function moveObstacles(obstacles){
    let rightObs=obstacles[0], leftObs=obstacles[1];
    // Move them left & right
    GameObjectManager.move(rightObs, CONSTANTS.GAME2_OBSTACLES_STEP, 0);
    GameObjectManager.move(leftObs, -CONSTANTS.GAME2_OBSTACLES_STEP, 0);
  }
  function resetObstacleIfNeeded(obstacles){
    // if right obstacle goes beyond X => reset
    if(obstacles[0].xCoordinateA >= CONSTANTS.GAME2_POINT_TO_RESET_RP_OBSTACLE_X){
      let dx=-205;
      let randY=possibleY[Math.floor(Math.random()*len)];
      let dy=-(obstacles[0].yCoordinateA - randY);
      GameObjectManager.move(obstacles[0],dx,dy);
    }
    // if left obstacle goes beyond X => reset
    if(obstacles[1].xCoordinateA <= CONSTANTS.GAME2_POINT_TO_RESET_LP_OBSTACLE_X){
      let dx=200;
      let randY=possibleY[Math.floor(Math.random()*len)];
      let dy=-(obstacles[1].yCoordinateA - randY);
      GameObjectManager.move(obstacles[1],dx,dy);
    }
  }

  Object.defineProperty(Game2ObjectsManager,'manageObstacles',{
    value:function(obstacles){
      moveObstacles(obstacles);
      resetObstacleIfNeeded(obstacles);
    }
  });

  Object.defineProperty(Game2ObjectsManager,'startChangeDirectionListener',{
    value:function(){
      document.addEventListener('keydown',function kd(e){
        if(e.keyCode===38){ isUp=true; document.removeEventListener('keydown',kd);}
        if(e.keyCode===40){ isDown=true; document.removeEventListener('keydown',kd);}
      });
      document.addEventListener('keyup',function ku(e){
        if(e.keyCode===38){ isUp=false; document.removeEventListener('keyup',ku);}
        if(e.keyCode===40){ isDown=false; document.removeEventListener('keyup',ku);}
      });
    }
  });

  Object.defineProperty(Game2ObjectsManager,'movePlayer',{
    value:function(player){
      let p=player.shape;
      if(p.yCoordinate<=CONSTANTS.GAME2_PLAYER_MIN_Y){
        // top limit
        if(isDown){ isDown=false; this.move(p,0,CONSTANTS.GAME2_PLAYER_STEP); }
        return;
      }
      if(p.yCoordinate>=CONSTANTS.GAME2_PLAYER_MAX_Y){
        // bottom limit
        if(isUp){ isUp=false; this.move(p,0,-CONSTANTS.GAME2_PLAYER_STEP); }
        return;
      }
      if(isUp && isDown){ isUp=false; isDown=false; return; }
      if(isUp){ isUp=false; this.move(p,0,-CONSTANTS.GAME2_PLAYER_STEP); }
      if(isDown){ isDown=false; this.move(p,0,CONSTANTS.GAME2_PLAYER_STEP); }
    }
  });

  Object.defineProperty(Game2ObjectsManager,'manageState',{
    value:function(game,player,obstacles){
      let collided=obstacles.some(obs=>{
        return window.SAT.testPolygonPolygon(obs.collisionProfile, player.shape.collisionProfile);
      });
      if(collided){
        game.over=true;
      }
    }
  });
})();

/** Base "Game" object plus specialized "Game2" object **/
const BaseGame = {
  init(renderer,player,objs,manager){
    this.renderer=renderer;
    this.player=player;
    this.gameObjects=objs||[];
    this.gameObjectsManager=manager;
    this.over=false;
    return this;
  },
  update(){
    this.renderer.clearStage();
    this.renderer.render(this.player.shape);
    this.gameObjects.forEach(o=>this.renderer.render(o));
  }
};

const Game2 = Object.create(BaseGame);
Object.defineProperty(Game2,'update',{
  value:function(){
    BaseGame.update.call(this);
    this.gameObjectsManager.manageObstacles(this.gameObjects);
    this.gameObjectsManager.startChangeDirectionListener();
    this.gameObjectsManager.movePlayer(this.player);
    this.gameObjectsManager.manageState(this,this.player,this.gameObjects);
  }
});

/** A simple engine to run a single game in a loop. */
const gameEngine = {
  runGame(game){
    let score=0;
    let scoreInterval=setInterval(()=>{score++;},1000);
    const scoreBtn=document.getElementById('score-button');
    const svg=document.getElementById('the-svg');

    function loop(){
      game.update();
      if(game.over){
        endGame();
      } else {
        requestAnimationFrame(loop);
      }
    }
    function endGame(){
      clearInterval(scoreInterval);
      svg.style.display='none';
      scoreBtn.style.display='inline-block';
      scoreBtn.textContent='Game Over! Score: '+score;
      scoreBtn.onclick=()=>location.reload();
    }
    loop();
  }
};

/** A function to initialize the ladder game */
function initLadderGame(){
  // Player rectangle
  const playerShape = getRectangle(
    CONSTANTS.GAME2_PLAYER_TOP_LEFT_POINT_X,
    CONSTANTS.GAME2_PLAYER_TOP_LEFT_POINT_Y,
    CONSTANTS.GAME2_PLAYER_WIDTH,
    CONSTANTS.GAME2_PLAYER_HEIGHT,
    CONSTANTS.GAME2_PLAYER_FILL,
    CONSTANTS.GAME2_PLAYER_STROKE,
    CONSTANTS.GAME2_PLAYER_STROKE_WIDTH
  );
  const player = Object.create(Player).init(playerShape,'none');

  // Two obstacles
  const obs1 = getTriangle(
    CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_A_X, CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_A_Y,
    CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_B_X, CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_B_Y,
    CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_C_X, CONSTANTS.GAME2_RP_OBSTACLE_START_POINT_C_Y,
    'black','none',1
  );
  obs1.id=1;

  const obs2 = getTriangle(
    CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_A_X, CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_A_Y,
    CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_B_X, CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_B_Y,
    CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_C_X, CONSTANTS.GAME2_LP_OBSTACLE_START_POINT_C_Y,
    'black','none',1
  );
  obs2.id=2;

  const renderer=Game2Renderer;
  const manager=Game2ObjectsManager;
  const gameObjs=[obs1,obs2];

  let myGame=Object.create(Game2).init(renderer,player,gameObjs,manager);
  return myGame;
}

/** Attach a global function so your HTML can call it easily. */
window.startLadderGame = function(){
  const button = document.getElementById('play-button');
  if(button) button.style.display='none';
  const svg = document.getElementById('the-svg');
  if(svg) svg.style.display='inline-block';

  let ladderGame = initLadderGame();
  gameEngine.runGame(ladderGame);
};
