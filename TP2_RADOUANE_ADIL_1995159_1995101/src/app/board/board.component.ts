import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  PLAYER_COMPUTER = { name: 'Ordinateur', symbol: 'O' };
  PLAYER_HUMAN = { name: 'Vous', symbol: 'X' };
  DRAW = { name: 'Match Null' };

  board: any[];
  currentPlayer = this.PLAYER_HUMAN;
  lastWinner: any;
  gameOver: boolean;
  boardLocked: boolean;
  scoreHuman = 0;
  scoreComp = 0;
  scoreDraw = 0;

  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  square_click(square) {
    if (square.value === '' && !this.gameOver) {
      square.value = this.PLAYER_HUMAN.symbol;
      this.completeMove(this.PLAYER_HUMAN);
    }
  }

  computerMove(firstMove: boolean = false) {
    this.boardLocked = true;

    setTimeout(() => {
      let square = firstMove ? this.board[4] : this.getRandomAvailableSquare();
      square.value = this.PLAYER_COMPUTER.symbol;
      this.completeMove(this.PLAYER_COMPUTER);
      this.boardLocked = false;
    }, 600);
  }

  completeMove(player) {
    if (this.isWinner(player.symbol)) {
      this.showGameOver(player);
    }
    else if (!this.availableSquaresExist()) {
      this.showGameOver(this.DRAW);
      this.scoreDraw++;
    }
    else {
      this.currentPlayer = (this.currentPlayer == this.PLAYER_COMPUTER ? this.PLAYER_HUMAN : this.PLAYER_COMPUTER);
      if (this.currentPlayer == this.PLAYER_COMPUTER) {
        this.computerMove();
      }
    }
  }

  availableSquaresExist(): boolean {
    return this.board.filter(s => s.value == '').length > 0;
  }

  getRandomAvailableSquare(): any {
    let availableSquares = this.board.filter(s => s.value === '');
    var squareIndex = this.getRndInteger(0, availableSquares.length - 1);

    return availableSquares[squareIndex];
  }

  showGameOver(winner) {
    this.gameOver = true;
    this.lastWinner = winner;

    if (winner !== this.DRAW)
      this.currentPlayer = winner;

    if (winner == this.PLAYER_HUMAN)
      this.scoreHuman++;
    else if (winner == this.PLAYER_COMPUTER)
      this.scoreComp++;
  }

  get winningIndexes(): any[] {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  }

  isWinner(symbol): boolean {
    for (let pattern of this.winningIndexes) {
      const foundWinner = this.board[pattern[0]].value == symbol
        && this.board[pattern[1]].value == symbol
        && this.board[pattern[2]].value == symbol;

      if (foundWinner) {
        for (let index of pattern) {
          this.board[index].winner = true;
        }

        return true;
      }
    }

    return false;
  }

  newGame() {
    this.board = [
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' },
      { value: '' }, { value: '' }, { value: '' }
    ];

    this.gameOver = false;
    this.boardLocked = false;

    if (this.currentPlayer == this.PLAYER_COMPUTER) {
      this.boardLocked = true;
      this.computerMove(true);
    }
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
