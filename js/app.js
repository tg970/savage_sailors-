//console.log($);

// === GLOBAL VARIABLES ===
let userBoats = [];
let enemyBoats = [];
let size = 4;
let availBoats = [['Cat',3],['Fishing',2],['Tender', 1]];
let availEnemy = [['Trawler', 3],['Ol Busted Pontoon', 2],['Skiff', 1]];

// === BOARD RENDER ===
const buildBoards = (size) => {
   // Build User Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('heroRow')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('heroSq').attr('id',`${j}`)
         $sq.addClass(`${i}`)
         $sq.on('click',boatPlacement)
         $container.append($sq)
      };
   $('.hero').append($container)
   }
   //Build Enemy Board
   for (let i = 0; i < size; i++) {
      const $container = $('<div>').addClass('enemyRow')
      for (let j = 0; j < size; j++) {
         let $sq = $('<div>').addClass('enemySq').attr('id',`${j}`)
         $sq.addClass(`${i}`)
         //$sq.on('click',userShot)
         $container.append($sq)
      };
   $('.enemy').append($container)
   }
}

// === CLICK HANDERLERS ===

const userShot = (event) => {
   console.log('click enemy square');
}

const boatPlacement = (event) => {
   let row = Number($(event.currentTarget).attr('class').split(' ')[1]);
   let col = Number($(event.currentTarget).attr('id'));
   if (checkConflicts(row, col, `.heroSq`, availBoats) && (col <= size - availBoats[0][1])) {
      userBoats.unshift(new HeroBoat (availBoats[0][0],availBoats[0][1]));
      availBoats.shift();
      userBoats[0].posBuild(row, col);
      //console.log('boat built');
      console.log(userBoats);
      userBoats[0].colorIn($(event.currentTarget), row, col)
   } else {
      console.log('click again');
   }
   if (availBoats.length == 0) {
      killBoatPlaceClicks();
      //placeEnemyBoats();
      gamePlay();
   }
}

// === LOGIC LAYER ===

class Boat {
   constructor(name, length) {
      this.name = name,
      this.length = length,
      this.position = [],
      this.hit = []
   }
   posBuild(row, col) {
      for (let i = 0; i < this.length; i++) {
         this.position[i] = [row, col + i]
         this.hit.push(false)
      }
   }
}

class HeroBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(event, row, col) {
      $(event).addClass('bb')
      $(event).off()
      let $div = $(event).siblings()
      let cnt = this.length-1
      for (let i = 0; i < $div.length; i++) {

         let id = $($div[i]).attr('id')
         //console.log(id);
         if ( id > col && cnt > 0 ) {
            $($div[i]).addClass('bb').off()
            cnt--
         }
      }
   }
}

class EnemyBoat extends Boat {
   constructor(name, length) {
      super(name, length)
   }
   colorIn(row, col) {
      let $enemySq = $(`.enemySq`)
      //console.log($enemySq);
      let cnt = this.length
      for (let i = 0; i < $enemySq.length; i++) {
         let tmpCol = $($enemySq[i]).attr('id')
         let tmpRow = $($enemySq[i]).attr('class').split(' ')[1]
         //console.log($enemySq, 'cnt', cnt, 'tmpcol', tmpCol, classes);
         if ( cnt > 0 && tmpCol >= col && tmpRow == row) {
            //console.log('yep');
            $($enemySq[i]).addClass('bb')
            cnt--
         }
      }
   }
}

const placeEnemyBoats = () => {
   while (availEnemy.length) {
      let row = Math.floor(Math.random()*size)
      let col = Math.floor(Math.random()*((size-availEnemy[0][1])+1))
      //console.log('new go', row, col);
      if (checkConflicts(row, col, `.enemySq`, availEnemy)) {
         enemyBoats.unshift(new EnemyBoat (availEnemy[0][0],availEnemy[0][1]));
         //console.log(enemyBoats[0].name);
         availEnemy.shift();
         enemyBoats[0].posBuild(row, col);
         enemyBoats[0].colorIn(row, col)
      }
      if (!availEnemy.length) {
         let $enemySq = $(`.enemySq`)
         //console.log($enemySq);
         for (let i = 0; i < $enemySq.length; i++) {
            //console.log($($enemySq[i]));
            $($enemySq[i]).on('click', userShot)
         }
      }
   }
   console.log(enemyBoats);
}

const checkConflicts = (row, col, board, boatsLeft) => {
   let $row = $(board).filter(`.${row}`)
   let testCnt = boatsLeft[0][1]
   //console.log($enemyRow);
   for (let i = 0; i < $row.length; i++) {
      let tmpCol = $($row[i]).attr('id')
      let tmpRow = $($row[i]).attr('class').split(' ')[1]
      //console.log($enemyRow, 'cnt', testCnt, 'tmpcol', tmpCol);
      if ( testCnt > 0 && tmpCol >= col) {
         if ($($row[i]).hasClass('bb')) {
            //console.log('break');
            return false
         } else {
            testCnt--
         }
         if (testCnt == 0) {
            return true
         }
      }
   }
}

const killBoatPlaceClicks = () => {
   let $heroSqEmpty = $(`.heroSq`).not(`.bb`)
   for (let i = 0; i < $heroSqEmpty.length; i++) {
      $($heroSqEmpty).eq(i).off();
   }
}

const gamePlay = () => {
   console.log('Game Play');
}

const startGame = () => {
   $('.message').text("Place your Boats!")
   buildBoards(size);
   placeEnemyBoats();
   //possPostHero = buildPossiblePositions();
   //alert('Click the square where you want to place your boat');
}

// === WINDOW ON LOAD/PAGE READY ===
$(() => {

startGame();

})
