//Game constant values and structures

const gameConstants = (function () {
  let board = new Array(9).fill(null);
  let turn = null;
  let win = false;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin(player) {
//move matching spaces into array
    let matches = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === player.symbol) {
            matches.push(i);
        };
        matches.sort();
    }
//compare player matches to winning combinations
    for (let i = 0; i < winningCombos.length; i++) {
        if (win === true) {return};
        let a = winningCombos[i][0];
        let b = winningCombos[i][1];
        let c = winningCombos[i][2];
        if (matches.includes(a) && matches.includes(b) && matches.includes(c)) {
            console.log('WIN');
            win = true;
            break;
        }
    }
    //determine round status, apply score
    if (win === true) {
      player.score++;
      win = false;
      resetBoard(board);
    } else {console.log('Next Turn')}
  };

  function resetBoard(arr) {
      arr.fill(null, 0, (arr.length));
  };

  function Player(symbol, turnMarker) {
    this.symbol = symbol;
    this.placeSymbol = function (index) {
      if (board[index] === null) {
        board[index] = this.symbol;
      } else {
        console.log('INVALID')
      };
    this.marks[index] = this.symbol;
    };
    this.marks = new Array(9).fill(null);
    this.score = 0;
    this.turnMarker = turnMarker;
  }

  let player1 = new Player("X", 0);
  let player2 = new Player("O", 1);

  return { board, player1, player2, checkWin, turn, win };
})();

//DOM Manipulation and round play

const gameDisplay = (function () {
    const title = document.querySelector('.title');
    const spaces = document.querySelectorAll('.space');
    const player1Symbol = `<h1>${gameConstants.player1.symbol}</h1>`;
    const player2Symbol = `<h1>${gameConstants.player2.symbol}</h1>`;
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', () => {
        spaces.forEach(space => space.innerHTML = '');
        //Random player starts
        let coinFlip = Math.floor((Math.random()) * 2);
        if (coinFlip === 0) {gameConstants.turn = 0} else if (coinFlip === 1) {gameConstants.turn = 1};
    })

    spaces.forEach((space) => {
        space.addEventListener('click', () => {
          let spaceID = space.dataset.spaceid;

          if (gameConstants.turn === null) {
            console.log('Press Start');
            return;
          } else if (gameConstants.turn === 0) {
            gameConstants.player1.placeSymbol(spaceID);
            space.innerHTML = player1Symbol;
            gameConstants.checkWin(gameConstants.player1);
            gameConstants.turn = 1;
          } else if (gameConstants.turn === 1) {
            gameConstants.player2.placeSymbol(spaceID);
            space.innerHTML = player2Symbol;
            gameConstants.checkWin(gameConstants.player2);
            gameConstants.turn = 0;
          }
        })
    });

    return {title, startButton};
})();