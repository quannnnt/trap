'use client'

import { useState } from "react";
import { PiPokerChipFill } from "react-icons/pi";

export default function Home() {

  // ----------- state variables ----------- //
  //balance
  const [bPlayer, setBPlayer] = useState(1350)
  const [bBet, setBBet] = useState(10000)

  //deposit
  const [depositPlayer, setDepositPlayer] = useState(0)
  const [depositBet, setDepositBet] = useState(0)

  //value of winnings and history of wins
  const [winPlayer, setWinPlayer] = useState(0)
  const [winBet, setWinBet] = useState(0)
  const [winHistoryPlayer, setWinHistoryPlayer] = useState([])
  const [winHistoryBet, setWinHistoryBet] = useState([])

  //value of losses and history of loss
  const [lossPlayer, setLossPlayer] = useState(0)
  const [lossBet, setLossBet] = useState(0)
  const [lossHistoryPlayer, setLossHistoryPlayer] = useState([])
  const [lossHistoryBet, setLossHistoryBet] = useState([])

  //value bet
  const [bet, setBet] = useState(0)
  const [chip, setChip] = useState(1)

  //arrays
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
  const firstBlock = Array.from({ length: 12 }, (_, index) => index + 1)
  const secondBlock = Array.from({ length: 12 }, (_, index) => index + 13)
  const thirdBlock = Array.from({ length: 12 }, (_, index) => index + 25)
  const rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
  const [valuesBet, setValuesBet] = useState(Array.from({ length: 37 }, () => 0))
  const [valuesBlends, setValuesBlends] = useState({})
  /*
  {
    'st': 0,
    'scd': 0,
    'trd': 0
  }
  */
  const [valuesColor, setValuesColor] = useState({})
  /*
  {
    'even': 0,
    'odd': 0
  } 
  */

  // -------------------- dynamic funcs
  function addBalancePlayer() {
    if (!isNaN(depositPlayer))
      setBPlayer(depositPlayer);
  }
  function addBalanceBet() {
    if (!isNaN(depositBet))
      setBBet(depositBet);
  }

  function putBet(selectedNumber: number) {
    setBet(bet => bet + chip)
    let oldValue = valuesBet[selectedNumber]
    setValuesBet(unstArray => [
      ...unstArray.slice(0, selectedNumber),
      oldValue + chip,
      ...unstArray.slice(selectedNumber + 1)
    ])
  }

  function getRandomInt(min: number, max: number) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0] / (2 ** 32 - 1);
    return Math.floor(randomValue * (max - min + 1)) + min;
  }

  function checkWinners(spinNumber: number) {
    let betWins = 0, playerWins = 0
    valuesBet.map((value, number) => {
      //win
      if (value != 0 && number == spinNumber) {
        //+ for player
        playerWins += value
      }
      //loss
      if (value != 0 && number != spinNumber) {
        //+ for bet
        betWins += value
      }
    })
    return { 'bet': betWins, 'player': playerWins };
  }

  function spin() {
    if (bet != 0) {
      //take out bet
      setBPlayer(oldBalance => oldBalance - bet)

      //check winners
      const spinNumber = getRandomInt(0, 36);
      console.log(spinNumber);
      let winsObj = checkWinners(spinNumber)

      //payment
      console.log(winsObj.bet, winsObj.player)
      setBBet(oldBalance => oldBalance + winsObj.bet)
      setBPlayer(oldBalance => oldBalance + winsObj.player)

      //reset bets
      setBet(0)
      setValuesBet(oldArray => Array.from(oldArray, () => 0))
      setValuesBlends({})
      setValuesColor({})
    }
  }

  // -------------------- appearance funcs
  function defineTokenColor(number: number) {
    let amountOfToken = valuesBet[number]
    if (amountOfToken < 5)
      return 'zinc-400';
    if (amountOfToken < 10)
      return 'cyan-500';
    if (amountOfToken < 25)
      return 'orange-500';
    if (amountOfToken < 50)
      return 'red-600';
    if (amountOfToken < 100)
      return 'green-600';
    return 'violet-600';
  }
  function defineNumberColor(number: number) {
    if (redNumbers.includes(number))
      return 'bg-red-600';
    if (blackNumbers.includes(number))
      return 'bg-stone-900';
  }

  return (
    <main className="w-screen h-screen bg-zinc-800 text-zinc-50">
      <section className="w-full h-1/6 flex justify-center items-center ">
        <div>
          <h1 className="text-2xl font-bold">Roulette</h1>
        </div>
      </section>
      <section className="w-full h-5/6 flex justify-between items-center py-5 px-10 gap-3">
        <div className="w-3/5 h-full flex justify-center items-start gap-8">
          <div className="flex flex-col gap-4">
            <div className="w-40 h-40 bg-orange-500 rounded-full" />
            <div className="w-40 h-10 bg-cyan-500" />
          </div>


          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center bg-white gap-[1px] p-[1px]">
              <div className="w-10 h-[120px]">
                <button key={0} className={`w-full h-full flex justify-center items-center bg-green-500 hover:brightness-90`} onClick={
                  () => {
                    if (bPlayer >= bet + chip) {
                      putBet(0)
                    }
                  }}>
                  {valuesBet[0] !== 0 && (
                    <>
                      <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(0)} absolute z-10`} />
                      <p className="text-xs font-medium text-black absolute z-20">{valuesBet[0]}</p>
                    </>
                  )}
                  0
                </button>
              </div>
              {/*first*/}
              <div className="w-[163px] h-[122px] flex justify-center flex-col-reverse flex-wrap gap-[1px]">
                {
                  firstBlock.map((number) => {
                    let numberColor = defineNumberColor(number)
                    return (
                      <button key={number} className={`w-[calc(25%-1px)] h-[calc(33%-1px)] flex justify-center items-center ${numberColor} hover:brightness-90`} onClick={
                        () => {
                          if (bPlayer >= bet + chip) {
                            putBet(number)
                          }
                        }}>
                        {valuesBet[number] !== 0 && (
                          <>
                            <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(number)} absolute z-10`} />
                            <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                          </>
                        )}
                        {number}
                      </button>
                    )
                  })
                }
              </div>
              {/*second*/}
              <div className="w-[163px] h-[122px] flex justify-center flex-col-reverse flex-wrap gap-[1px]">
                {
                  secondBlock.map((number) => {
                    let numberColor = defineNumberColor(number)
                    return (
                      <button key={number} className={`w-[calc(25%-1px)] h-[calc(33%-1px)] flex justify-center items-center ${numberColor} hover:brightness-90`} onClick={
                        () => {
                          if (bPlayer >= bet + chip) {
                            putBet(number)
                          }
                        }}>
                        {valuesBet[number] !== 0 && (
                          <>
                            <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(number)} absolute z-10`} />
                            <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                          </>
                        )}
                        {number}
                      </button>
                    )
                  })
                }
              </div>
              {/*third*/}
              <div className="w-[163px] h-[122px] flex justify-center flex-col-reverse flex-wrap gap-[1px]">
                {
                  thirdBlock.map((number) => {
                    let numberColor = defineNumberColor(number)
                    return (
                      <button key={number} className={`w-[calc(25%-1px)] h-[calc(33%-1px)] flex justify-center items-center ${numberColor} hover:brightness-90`} onClick={
                        () => {
                          if (bPlayer >= bet + chip) {
                            putBet(number)
                          }
                        }}>
                        {valuesBet[number] !== 0 && (
                          <>
                            <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(number)} absolute z-10`} />
                            <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                          </>
                        )}
                        {number}
                      </button>
                    )
                  })
                }
              </div>
            </div>
            <div className="flex justify-between items-center bg-opacity-25 bg-gray-400 rounded-full gap-2 p-2">
              <button onClick={() => setChip(1)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-zinc-400" />
                <p className="text-sm font-medium text-black absolute">1</p>
              </button>
              <button onClick={() => setChip(5)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-cyan-500" />
                <p className="text-sm font-medium text-black absolute">5</p>
              </button>
              <button onClick={() => setChip(10)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-orange-500" />
                <p className="text-sm font-medium text-black absolute">10</p>
              </button>
              <button onClick={() => setChip(25)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-red-600" />
                <p className="text-sm font-medium text-black absolute">25</p>
              </button>
              <button onClick={() => setChip(50)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-green-600" />
                <p className="text-sm font-medium text-black absolute">50</p>
              </button>
              <button onClick={() => setChip(100)} className="flex justify-center items-center rounded-full hover:brightness-90">
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-violet-600" />
                <p className="text-xs font-medium text-black absolute">100</p>
              </button>
            </div>
            <div className="w-full flex justify-center gap-4">
              <p>Balance: {bPlayer}</p>
              <p>Total Bet: {bet}</p>
            </div>
            <div className="flex gap-2">
              <button className="py-1 px-4 rounded bg-green-500" onClick={spin}>Play</button>
              <button className="py-1 px-4 rounded bg-indigo-500" onClick={
                () => {
                  setValuesBet(oldArray => Array.from(oldArray, () => 0))
                  setBet(0)
                }}>Reset</button>
            </div>
          </div>
        </div>


        <div className="w-1/5 h-full flex flex-col justify-start gap-8">
          <div className="w-full flex flex-col gap-2">
            <h1 className="font-semibold">Bet</h1>
            <div className="w-full flex flex-col gap-1 items-start">
              <p>Balance: {bBet}</p>
              <p>Winnings: {winBet}</p>
              <p>Losses: {lossBet}</p>
            </div>
            <div className="flex gap-1 text-black text-sm">
              <input type="text" name="depositBet" id="depositBet" className="px-1" onKeyDown={
                (event) => {
                  let key = event.key
                  if (key == '0' || key == '1' || key == '2' || key == '3' || key == '4' || key == '5' || key == '6' || key == '7' || key == '8' || key == '9' || key == 'Backspace' || key == '.' || key == 'ArrowLeft' || key == 'ArrowRight')
                    return true;
                  return event.preventDefault()
                }
              }
                onChange={
                  (event) => setDepositBet(parseFloat(event.target.value))
                }
              />
              <button id="addSaleBet" className="px-2 py-1 bg-green-500 text-white rounded" onClick={addBalanceBet}>Deposit</button>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h1 className="font-semibold">Player</h1>
            <div className="w-full flex flex-col gap-1 items-start">
              <p>Balance: {bPlayer}</p>
              <p>Winnings: {winPlayer}</p>
              <p>Losses: {lossPlayer}</p>
            </div>
            <div className="flex gap-1 text-black text-sm">
              <input type="text" name="depositPlayer" id="depositPlayer" className="px-1" onKeyDown={
                (event) => {
                  let key = event.key
                  if (key == '0' || key == '1' || key == '2' || key == '3' || key == '4' || key == '5' || key == '6' || key == '7' || key == '8' || key == '9' || key == 'Backspace' || key == '.' || key == 'ArrowLeft' || key == 'ArrowRight')
                    return true;
                  return event.preventDefault()
                }
              }
                onChange={
                  (event) => setDepositPlayer(parseFloat(event.target.value))
                }
              />
              <button id="addSalePlayer" className="px-2 py-1 bg-green-500 text-white rounded" onClick={addBalancePlayer}>Deposit</button>
            </div>
          </div>
        </div>


        <div className="w-1/5 h-full flex flex-col justify-start"></div>
      </section>
    </main>
  );
}
