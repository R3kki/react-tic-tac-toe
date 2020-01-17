import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
    <button className="square" onClick={props.onClick}>
        {props.value}
    </button>
    );
  }
  
  class Board extends React.Component {   
    renderSquare(i) {
      return(
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          key={i+'_squareID'}
        />
      );
    }
  
    render() {
      const cells = [];
      cells.push(<div className="board-header-top" key={'C'}>{'C'}</div>)
      cells.push(<div className="board-header-top" key={'B'}>{'B'}</div>)
      cells.push(<div className="board-header-top" key={'A'}>{'A'}</div>)
      for (let row = 0; row < 3; row++){
        let rows = [];
        rows.push(<div className="board-header-side" key={row+'_hSideID'}>{row+1}</div>)
        for (let col = 0; col < 3; col++){
          rows.push(this.renderSquare(3*row + col));
        }
        cells.push(<div className="board-row" key={row + '_cellID'}>{rows}</div>);
      }
      return (
        <div>
          {cells}
        </div>
      );
    }    
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
              location: '',
          }],
          stepNumber: 0,
          xIsNext: true,
      };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const square_clicked = current.squares.slice();
        if (calculateWinner(square_clicked || square_clicked[i])) {
            return;
        }
        square_clicked[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: square_clicked,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' @ ' + calculateLocation(history[move].location):
          'Go to game start';
        return (
          <li key={move}>
            <button 
              className={move === history.length-1 ? "current-move": "old-move" } 
              onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  function calculateLocation(square_number) {
    var location = '';
    if (square_number <= 2){
        location = '1';
    } else if (square_number >=3 && square_number <= 5){
        location = '2';
    } else {
        location = '3';
    }

    if (square_number % 3 === 0){
        location = 'A' + location
    } else if (square_number % 3 === 1) {
    location = 'B' + location
    } else {
    location = 'C' + location
    }
    return location
  }