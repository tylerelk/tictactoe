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
        if (!board.includes(null)) {
          gameDisplay.message.textContent = 'Tie';
          resetBoard(board);
          gameDisplay.spaces.forEach(space => space.innerHTML = '');
          turn = null;
        };
        let a = winningCombos[i][0];
        let b = winningCombos[i][1];
        let c = winningCombos[i][2];
        if (matches.includes(a) && matches.includes(b) && matches.includes(c)) {
            win = true;
            break;
        }
    }

    //determine round status, apply score
    if (win === true) {
      if (player.turnMarker === 0) {turn = 1};
      if (player.turnMarker === 1) {turn = 0};
      player.score++;
      gameDisplay.message.innerHTML = `${player.symbol} wins - <br>Other player turn`;
      gameDisplay.updateScoreDisplay();
      win = false;
      resetBoard(board);
      gameDisplay.spaces.forEach(space => space.innerHTML = '');
    };
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

  return { board, player1, player2, checkWin, turn, win, resetBoard };
})();

//DOM Manipulation and round play

const gameDisplay = (function () {
    //Getters
    const title = document.querySelector('.title');
    const spaces = document.querySelectorAll('.space');
    const player1Symbol = `<h1>${gameConstants.player1.symbol}</h1>`;
    const player2Symbol = `<h1>${gameConstants.player2.symbol}</h1>`;
    const startButton = document.querySelector('.start');
    const resetbutton = document.querySelector('.reset');
    const gameControls = document.querySelector('.controls-and-score')
    const p1scoreDisplay = document.querySelector('.p1score');
    const p2scoreDisplay = document.querySelector('.p2score');
    const messageArea = document.querySelector('.messages');
    const message = document.querySelector('.messages>h3');

    //Intro effects

    window.addEventListener('load', () => {
      title.style.transform = 'translateY(0px)';
      gameControls.style.opacity = '100%';
      messageArea.style.opacity = '100%';
    });
    //Reset game with button
    resetbutton.addEventListener('click', () => {
      gameConstants.resetBoard(gameConstants.board);
      gameConstants.player1.score = 0;
      gameConstants.player2.score = 0;
      updateScoreDisplay();
      spaces.forEach(space => space.innerHTML = '');
      message.textContent = 'Game Cleared'
    });
    //Update Score after each round

    function updateScoreDisplay() {
      p1scoreDisplay.textContent = gameConstants.player1.score;
      p2scoreDisplay.textContent = gameConstants.player2.score;
    }
    //Initialize board on start
    startButton.addEventListener('click', () => {
        spaces.forEach(space => space.innerHTML = '');
        gameConstants.win = false;
        gameConstants.resetBoard(gameConstants.board);
        //Random player starts
        let coinFlip = Math.floor((Math.random()) * 2);
        if (coinFlip === 0) {
          gameConstants.turn = 0;
          message.textContent = 'Turn: X';
        } else if (coinFlip === 1) {
          gameConstants.turn = 1;
          message.textContent = 'Turn: O';
        };
        startButton.style.opacity = '0%'
    });

    spaces.forEach((space) => {
        space.addEventListener('click', () => {
          let spaceID = space.dataset.spaceid;
          if (gameConstants.turn === null) {
            message.style.color = 'var(--pink)';
            message.style.transform = 'scale(1.5)'
            return;
          } else if (gameConstants.turn === 0 && space.textContent != 'X' && space.textContent != 'O') {
            message.style.color = 'white';
            message.style.transform = 'scale(1)'
            gameConstants.turn = 1;
            message.textContent = 'Turn: O';
            gameConstants.player1.placeSymbol(spaceID);
            space.innerHTML = player1Symbol;
            gameConstants.checkWin(gameConstants.player1);
            return;
          } else if (gameConstants.turn === 1 && space.textContent != 'O' && space.textContent != 'X') {
            message.style.color = 'white';
            message.style.transform = 'scale(1)'
            gameConstants.turn = 0;
            message.textContent = 'Turn: X';
            gameConstants.player2.placeSymbol(spaceID);
            space.innerHTML = player2Symbol;
            gameConstants.checkWin(gameConstants.player2);
            return;
          }
        })
    });

    return {title, startButton, updateScoreDisplay, messageArea, message, spaces};
})();