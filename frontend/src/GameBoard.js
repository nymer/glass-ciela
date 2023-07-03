import React, { useState, useEffect } from 'react';
import './App.css';

import BoardCell from './components/BoardCell';
import ToggleSwitchButton from './components/ToggleSwitchButton'

import RED from './images/icon_star_red.png';
import GREEN from './images/icon_star_green.png';
import YELLOW from './images/icon_star_yellow.png';
import iconQuestion from './images/question.png';
import iconRevert from './images/icon_revert.png';

// 固定値の定義
const playerX = 'X';
const playerY = 'Y';

function GameBoard() {
  const [boardState, setBoardState] = useState(Array(7).fill().map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(playerX);
  const [winner, setWinner] = useState(null);
  const [isToggle, setIsToggle] = useState(false);
  // 一手前の手を保存。row,column,user,pieceColor
  const [beforeSetPiece, setBeforeSetPiece] = useState([null, null, null, null]);
  // 戻るボタンを使用したという情報を保存
  const [revertUser, setRevertUser] = useState(null);

  // PlayerXのデータ
  const [pieceRed_X, countPieceRed_X] = useState(7);
  const [pieceGreen_X, countPieceGreen_X] = useState(5);
  const [pieceYellow_X, countPieceYellow_X] = useState(5);
  const [revertCount_X, setRevertCount_X] = useState(2);
  const [chosenPiece_X, setChosenPiece_X] = useState(null);
  // PlayerYのデータ
  const [pieceRed_Y, countPieceRed_Y] = useState(7);
  const [pieceGreen_Y, countPieceGreen_Y] = useState(5);
  const [pieceYellow_Y, countPieceYellow_Y] = useState(5);
  const [revertCount_Y, setRevertCount_Y] = useState(2);
  const [chosenPiece_Y, setChosenPiece_Y] = useState(null);

  // スタンダードモードへ変更するトグルボタンイベント
  const handleClickStd = () => {
    if ((!isToggle && pieceRed_X === 7 && pieceGreen_X === 5 && pieceYellow_X === 5 && pieceRed_Y === 7 && pieceGreen_Y === 5 && pieceYellow_Y === 5) || (isToggle && pieceRed_X === 6 && pieceGreen_X === 5 && pieceYellow_X === 5 && pieceRed_Y === 6 && pieceGreen_Y === 5 && pieceYellow_Y === 5)) {
      // トグルボタンが切り替わった後に初期値を再設定
      if (!isToggle) {
        countPieceRed_X(6);
        countPieceRed_Y(6);
        const newBoardState = boardState.map(row => [...row]);
        newBoardState[2][2] = <img src={RED} alt='set piece' className='img_piece'></img>;
        newBoardState[5][3] = <img src={RED} alt='set piece' className='img_piece'></img>;
        setBoardState(newBoardState);
      } else if (isToggle) {
        countPieceRed_X(7);
        countPieceRed_Y(7);
        const newBoardState = boardState.map(row => [...row]);
        newBoardState[2][2] = null;
        newBoardState[5][3] = null;
        setBoardState(newBoardState);
      };
      setIsToggle(!isToggle);
    } else {
      window.alert('盤面に駒がある状態では切り替えられません。');
      return;
    };
  };

  useEffect(() => {
    // 勝利条件の確認と判定
    // 3つ同じ駒が並んだ時
    const winningConditions = getWinningConditions();
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        boardState[a.row][a.col]?.props?.src &&
        boardState[a.row][a.col]?.props?.src === boardState[b.row][b.col]?.props?.src &&
        boardState[a.row][a.col]?.props?.src === boardState[c.row][c.col]?.props?.src
      ) {
        setWinner(currentPlayer === playerX ? playerY : playerX);
        return;
      }
    }
    // 双方が駒を使い切った時
    if (
      pieceRed_X === 0 &&
      pieceGreen_X === 0 &&
      pieceYellow_X === 0 &&
      pieceRed_Y === 0 &&
      pieceGreen_Y === 0 &&
      pieceYellow_Y === 0
    ) {
      setWinner(currentPlayer === playerX ? playerY : playerX);
      return;
    }

    if (isBoardFull()) {
      setWinner('draw');
    }
  }, [currentPlayer]);

  const handleCellClick = (row, col) => {
    // 角の3マスはクリック不可
    notUseCornerCells(row, col);
    // 駒がセットされていない時はクリック不可
    if (currentPlayer === playerX && chosenPiece_X === null) return;
    if (currentPlayer === playerY && chosenPiece_Y === null) return;

    // 選択している駒をセットする
    let chosenPiece = chosenPiece_X;
    if (currentPlayer !== playerX) {
      chosenPiece = chosenPiece_Y;
    }

    if (boardState[row][col] === null && !winner) {
      const newBoardState = boardState.map(row => [...row]);
      newBoardState[row][col] = <img src={chosenPiece} alt='set piece' className='img_piece'></img>;
      setBoardState(newBoardState);
      // 今回の手を保存
      setBeforeSetPiece([row, col, currentPlayer, chosenPiece]);
      // プレイヤー交代
      setCurrentPlayer(currentPlayer === playerX ? playerY : playerX);
      // 使用した駒のマイナスカウント
      if (currentPlayer === playerX) {
        if (chosenPiece_X === RED) {
          countPieceRed_X(pieceRed_X - 1);
        } else if (chosenPiece_X === GREEN) {
          countPieceGreen_X(pieceGreen_X - 1);
        } else if (chosenPiece_X === YELLOW) {
          countPieceYellow_X(pieceYellow_X - 1);
        }
      } else {
        if (chosenPiece_Y === RED) {
          countPieceRed_Y(pieceRed_Y - 1);
        } else if (chosenPiece_Y === GREEN) {
          countPieceGreen_Y(pieceGreen_Y - 1);
        } else if (chosenPiece_Y === YELLOW) {
          countPieceYellow_Y(pieceYellow_Y - 1);
        }
      }
      // 選択している駒のリセット
      setChosenPiece_X(null);
      setChosenPiece_Y(null);
      deleteClassNameToSelectedPiece();
      setRevertUser(null);
    }
  };

  // 角の3マスはクリック不可
  const notUseCornerCells = (row, col) => {
    if (row === 0 && col === 0) return;
    if (row === 0 && col === 1) return;
    if (row === 0 && col === 5) return;
    if (row === 0 && col === 6) return;
    if (row === 1 && col === 0) return;
    if (row === 1 && col === 6) return;
    if (row === 5 && col === 0) return;
    if (row === 5 && col === 6) return;
    if (row === 6 && col === 0) return;
    if (row === 6 && col === 1) return;
    if (row === 6 && col === 5) return;
    if (row === 6 && col === 6) return;
  }

  // 自分の手持ち駒をクリックした時の処理
  const onMyPieceClick = (player, pieceColor) => {
    if (player !== currentPlayer) return;
    if (player === playerX) {
      // 選択した駒の残り個数が0の時は選択できないようにする
      if (pieceColor === RED && pieceRed_X === 0) {
        return;
      } else if (pieceColor === GREEN && pieceGreen_X === 0) {
        return;
      } else if (pieceColor === YELLOW && pieceYellow_X === 0) {
        return;
      }
      // 駒を選択（セット）する
      setChosenPiece_X(pieceColor);
    } else {
      // 選択した駒の残り個数が0の時は選択できないようにする
      if (pieceColor === RED && pieceRed_Y === 0) {
        return;
      } else if (pieceColor === GREEN && pieceGreen_Y === 0) {
        return;
      } else if (pieceColor === YELLOW && pieceYellow_Y === 0) {
        return;
      }
      // 駒を選択（セット）する
      setChosenPiece_Y(pieceColor);
    }
  }

  // 駒をクリックした時にわかりやすくCSSを付与する
  const setClassNameToSelectedPiece = (event) => {
    const clickedElement = event.target;
    // クリックされた要素以外の要素からClassNameを削除
    deleteClassNameToSelectedPiece();
    // クリックされた要素にClassNameを追加
    clickedElement.classList.add('selected');
  }
  const deleteClassNameToSelectedPiece = () => {
    // クリックされた要素以外の要素からClassNameを削除
    const elements = document.getElementsByClassName('img_piece');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.remove('selected');
    }
  }

  // 勝利条件の定義（3つ同じ駒が並んだ時）
  const getWinningConditions = () => {
    const conditions = [];

    // 横方向の勝利条件
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        conditions.push([
          { row: row, col: col },
          { row: row, col: col + 1 },
          { row: row, col: col + 2 },
        ]);
      }
    }

    // 縦方向の勝利条件
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 7; col++) {
        conditions.push([
          { row: row, col: col },
          { row: row + 1, col: col },
          { row: row + 2, col: col },
        ]);
      }
    }

    // 斜め方向（左上から右下）の勝利条件
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        conditions.push([
          { row: row, col: col },
          { row: row + 1, col: col + 1 },
          { row: row + 2, col: col + 2 },
        ]);
      }
    }

    // 斜め方向（右上から左下）の勝利条件
    for (let row = 0; row < 5; row++) {
      for (let col = 2; col < 7; col++) {
        conditions.push([
          { row: row, col: col },
          { row: row + 1, col: col - 1 },
          { row: row + 2, col: col - 2 },
        ]);
      }
    }
    return conditions;
  };

  // 使い方説明用のモーダルを表示
  const [showModal, setShowModal] = useState(false);
  const handleClickQuestion = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // ゲームをリセットするボタン
  const handleClickReset = () => {
    const confirmed = window.confirm('本当にゲームをリセットしますか？');
    if (confirmed) {
      window.location.reload();
    }
  }

  // １手戻す処理
  const handleClickRevert = (player) => {
    // 盤面が初期表示の場合は戻せない
    if ((currentPlayer === playerX && !isToggle && pieceRed_Y === 7 && pieceGreen_Y === 5 && pieceYellow_Y === 5) || (currentPlayer === playerX && isToggle && pieceRed_Y === 6 && pieceGreen_Y === 5 && pieceYellow_Y === 5)) {
      return;
    }
    // 回数切れの時はクリック不可
    if (player === playerY && revertCount_Y === 0) {
      return;
    } else if (player === playerX && revertCount_X === 0) {
      return;
    }
    // 二手連続で戻すことはできない。
    if (currentPlayer === revertUser && currentPlayer === player && beforeSetPiece[0] === undefined) {
      window.alert('二手連続で戻すことはできません。');
      return;
    }
    // 相手が戻した直後は戻せない
    if (beforeSetPiece[0] === undefined) {
      return;
    }
    // 相手ターンの時は戻せない
    if (currentPlayer === player) {
      return;
    }

    const confirmed = window.confirm('一手戻しますか？');
    if (confirmed) {
      const newBoardState = boardState.map(row => [...row]);
      newBoardState[beforeSetPiece[0]][beforeSetPiece[1]] = null;
      setBoardState(newBoardState);
      if (beforeSetPiece[2] === playerX) {
        if (beforeSetPiece[3] === RED) {
          countPieceRed_X(pieceRed_X + 1);
        } else if (beforeSetPiece[3] === GREEN) {
          countPieceGreen_X(pieceGreen_X + 1);
        } else if (beforeSetPiece[3] === YELLOW) {
          countPieceYellow_X(pieceYellow_X + 1);
        }
        setRevertCount_X(revertCount_X - 1)
      } else {
        if (beforeSetPiece[3] === RED) {
          countPieceRed_Y(pieceRed_Y + 1);
        } else if (beforeSetPiece[3] === GREEN) {
          countPieceGreen_Y(pieceGreen_Y + 1);
        } else if (beforeSetPiece[3] === YELLOW) {
          countPieceYellow_Y(pieceYellow_Y + 1);
        }
        setRevertCount_Y(revertCount_Y - 1)
      }
      // 一手前の保存値をnullに変更
      setBeforeSetPiece(0, 0, null, null);
      console.log(beforeSetPiece);
      // 全ての駒の選択時CSSを削除
      deleteClassNameToSelectedPiece();
      // 戻したプレイヤーを保存
      setRevertUser(player);
      // プレイヤー交代
      setCurrentPlayer(currentPlayer === playerX ? playerY : playerX);
    }
  }

  const isBoardFull = () => {
    return boardState.every(row => row.every(cell => cell !== null));
  };

  const renderMessage = () => {
    if (winner === 'draw') {
      return <div className="message">It's a draw!</div>;
    } else if (winner) {
      return <div className="message">Player {winner} wins!</div>;
    } else {
      return <div className="message">Current Player: {currentPlayer}</div>;
    }
  };

  const renderBoard = () => {
    return boardState.map((row, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {row.map((cell, colIndex) => {
          let cellClass = "board-cell";

          // 角の3マスに新たなクラスを追加
          if ((rowIndex === 0 && colIndex === 0) || (rowIndex === 0 && colIndex === 1) || (rowIndex === 0 && colIndex === 5) || (rowIndex === 0 && colIndex === 6) || (rowIndex === 1 && colIndex === 0) || (rowIndex === 1 && colIndex === 6) || (rowIndex === 5 && colIndex === 0) || (rowIndex === 5 && colIndex === 6) || (rowIndex === 6 && colIndex === 0) || (rowIndex === 6 && colIndex === 1) || (rowIndex === 6 && colIndex === 5) || (rowIndex === 6 && colIndex === 6)) {
            cellClass += " corner-cell";
          }

          return (
            <BoardCell
              key={colIndex}
              value={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={cellClass}
            />
          );
        })}
      </div>
    ));
  };

  return (
    <div className="game-board-outer">
      <div >
        <ToggleSwitchButton className="toggle-switch-button" handleClick={handleClickStd} isToggle={isToggle} />
      </div>
      <div className='title'>Glass Ciela</div>
      <div className='center'>
        <img src={iconQuestion} alt='question' onClick={handleClickQuestion} className='img_question'></img>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <h2>ゲーム説明</h2>
                <p>2人対戦用のボードゲームです。</p>
                <p>Playerは交互に<br />赤・緑・黄のいずれかの駒を<br />選択して盤面に配置します。</p>
                <p>相手が駒を配置する前であれば<br />
                  <img src={iconRevert} alt='iconRevert' className='img_piece_description'></img>で自分の配置した駒を<br />一手戻すことができます。</p>
                <h2>勝利条件</h2>
                <p>①<br />三目並べの要領で<br />同じ色の駒の3つ目を<br />置いた方の勝利です。</p>
                <p>②<br />全ての駒を使い切った場合<br />後攻の勝利となります。</p>
                <button onClick={handleCloseModal}>閉じる</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="game-board-inner">
        <div className="game-board">
          <div className="player_name player-X">{playerX}</div>
          <div className="piece-color-count piece-color-count-left">
            <p className='piece-count'>{pieceRed_X}　</p>
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerX) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerX, RED)
            }}>
              <img src={RED} alt='RED'
                className={currentPlayer === playerX ? 'img_piece img_piece_selected' : 'img_piece'}></img>
            </button>
          </div>
          <div className="green piece-color-count piece-color-count-left">
            <p className='piece-count'>{pieceGreen_X}　</p>
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerX) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerX, GREEN)
            }}>
              <img src={GREEN} alt='GREEN'
                className={currentPlayer === playerX ? 'img_piece img_piece_selected' : 'img_piece'}></img>
            </button>
          </div>
          <div className="yellow piece-color-count piece-color-count-left">
            <p className='piece-count'>{pieceYellow_X}　</p>
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerX) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerX, YELLOW)
            }}>
              <img src={YELLOW} alt='YELLOW'
                className={currentPlayer === playerX ? 'img_piece img_piece_selected' : 'img_piece'}></img>
            </button>
          </div>
          <div className="revert piece-color-count piece-color-count-left">
            <p className='piece-count'>{revertCount_X}　</p>
            <button className='btn_piece' onClick={(event) => {handleClickRevert(playerX)}}>
              <img src={iconRevert} alt='iconRevert' className='img_piece'></img>
            </button>
          </div>        </div>
        <div className="game-board">
          {renderMessage()}
          {renderBoard()}
        </div>
        <div className="game-board">
          <div className="player_name player-Y">{playerY}</div>
          <div className="piece-color-count">
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerY) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerY, RED);
            }}><img src={RED} alt='RED'
              className={currentPlayer === playerY ? 'img_piece img_piece_selected' : 'img_piece'}></img></button>
            <p className='piece-count'>　{pieceRed_Y}</p>
          </div>
          <div className="green piece-color-count">
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerY) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerY, GREEN)
            }}>
              <img src={GREEN} alt='GREEN'
                className={currentPlayer === playerY ? 'img_piece img_piece_selected' : 'img_piece'}></img>
            </button>
            <p className='piece-count'>　{pieceGreen_Y}</p>
          </div>
          <div className="yellow piece-color-count">
            <button className='btn_piece' onClick={(event) => {
              // クリックされた要素にClassNameを追加
              if (currentPlayer === playerY) setClassNameToSelectedPiece(event);
              // 選択した駒を手元にセット
              onMyPieceClick(playerY, YELLOW)
            }}>
              <img src={YELLOW} alt='YELLOW'
                className={currentPlayer === playerY ? 'img_piece img_piece_selected' : 'img_piece'}></img>
            </button>
            <p className='piece-count'>　{pieceYellow_Y}</p>
          </div>
          <div className="revert piece-color-count">
            <button className='btn_piece' onClick={(event) => {handleClickRevert(playerY)}}>
              <img src={iconRevert} alt='iconRevert' className='img_piece'></img>
            </button>
            <p className='piece-count'>　{revertCount_Y}</p>
          </div>
        </div>
      </div>
      <button onClick={handleClickReset} className='btn_reset'>RESET</button>
    </div>
  );
};

export default GameBoard;
