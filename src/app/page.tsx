'use client'

import { useState } from "react";
import { PiPokerChipFill } from "react-icons/pi";
import { GiSkullCrossedBones } from "react-icons/gi";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

export default function Home() {

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  // ----------- state variables ----------- //
  //balance
  const [bPlayer, setBPlayer] = useState(1350)
  const [bBet, setBBet] = useState(10000)

  //deposit
  const [depositPlayer, setDepositPlayer] = useState(0)
  const [depositBet, setDepositBet] = useState(0)

  //history of raffled numbers
  const [numberHistory, setNumberHistory] = useState<number[]>([])

  //value of winnings and history of wins
  const [winPlayer, setWinPlayer] = useState(0)
  const [winBet, setWinBet] = useState(0)
  const [winHistoryPlayer, setWinHistoryPlayer] = useState<number[]>([])
  const [winHistoryBet, setWinHistoryBet] = useState<number[]>([])

  //value bet
  const [bet, setBet] = useState(0)
  const [chip, setChip] = useState(1)

  //angleBall
  const [angleBall, setAngleBall] = useState(0)

  // ----------- arrays ----------- //
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
  const firstBlock = Array.from({ length: 12 }, (_, index) => index + 1)
  const secondBlock = Array.from({ length: 12 }, (_, index) => index + 13)
  const thirdBlock = Array.from({ length: 12 }, (_, index) => index + 25)
  const leftNumbers = Array.from({ length: 18 }, (_, index) => index + 1)
  const rightNumbers = Array.from({ length: 18 }, (_, index) => index + 18)
  const evenNumbers = Array.from({ length: 18 }, (_, index) => (index + 1) * 2)
  const oddNumbers = Array.from({ length: 18 }, (_, index) => index * 2 + 1)
  const col1Numbers: number[] = []
  let incrementc1 = 0
  for (let i = 0; i < 12; i++) {
    let number = i + 1 + incrementc1
    incrementc1 += 2
    col1Numbers.push(number)
  }
  const col2Numbers: number[] = []
  let incrementc2 = 0
  for (let i = 0; i < 12; i++) {
    let number = i + 2 + incrementc2
    incrementc2 += 2
    col2Numbers.push(number)
  }
  const col3Numbers: number[] = []
  let incrementc3 = 0
  for (let i = 0; i < 12; i++) {
    let number = i + 3 + incrementc3
    incrementc3 += 2
    col3Numbers.push(number)
  }
  const rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
  const [valuesBet, setValuesBet] = useState(Array.from({ length: 37 }, () => 0))
  const rouletteAnim = [4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19]

  interface blendsObj {
    first: number,
    second: number,
    third: number,
    leftN: number,
    rightN: number,
    col1: number,
    col2: number,
    col3: number,
    even: number,
    odd: number,
    red: number,
    black: number
  }
  const [valuesBlends, setValuesBlends] = useState<blendsObj>({
    first: 0,
    second: 0,
    third: 0,
    leftN: 0,
    rightN: 0,
    col1: 0,
    col2: 0,
    col3: 0,
    even: 0,
    odd: 0,
    red: 0,
    black: 0
  })

  // -------------------- dynamic funcs
  function addBalancePlayer() {
    if (!isNaN(depositPlayer)) {
      setBPlayer(value => value + depositPlayer)
      setDepositPlayer(0)
    }
  }
  function addBalanceBet() {
    if (!isNaN(depositBet)) {
      setBBet(value => value + depositBet)
      setDepositBet(0)
    }
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

    //numbers
    valuesBet.map((value, number) => {
      if (value != 0) {
        //win
        if (number == spinNumber) {
          //+ for player
          playerWins += value * 36
          betWins -= value * 35
        }//loss
        else {
          //+ for bet
          betWins += value
        }
      }
    })

    //blends
    Object.entries(valuesBlends).map(([key, value]) => {
      if (value != 0) {

        //win 1stBlock ------------------------------------------------------
        if (key == 'first') {
          if (firstBlock.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }

        //win 2ndBlock ------------------------------------------------------
        if (key == 'second') {
          if (secondBlock.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }

        //win 3rdBlock ------------------------------------------------------
        if (key == 'third') {
          if (thirdBlock.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }

        //win 1to18 ------------------------------------------------------
        if (key == 'leftN') {
          if (leftNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win 19to36 ------------------------------------------------------
        if (key == 'rightN') {
          if (rightNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win even ------------------------------------------------------
        if (key == 'even') {
          if (evenNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win odd ------------------------------------------------------
        if (key == 'odd') {
          if (oddNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win red ------------------------------------------------------
        if (key == 'red') {
          if (redNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win black ------------------------------------------------------
        if (key == 'black') {
          if (blackNumbers.includes(spinNumber)) {
            playerWins += value * 2
            betWins -= value
          }//loss
          else {
            betWins += value
          }
        }

        //win col1 ------------------------------------------------------
        if (key == 'col1') {
          if (col1Numbers.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }

        //win col2 ------------------------------------------------------
        if (key == 'col2') {
          if (col2Numbers.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }

        //win col3 ------------------------------------------------------
        if (key == 'col3') {
          if (col3Numbers.includes(spinNumber)) {
            playerWins += value * 3
            betWins -= value * 2
          }//loss
          else {
            betWins += value
          }
        }
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
      console.log('number: ', spinNumber);
      let winsObj = checkWinners(spinNumber)

      //rollBall animation
      let indexNumber = rouletteAnim.indexOf(spinNumber)
      rollBall(indexNumber)

      setTimeout(() => {
        //log number
        setNumberHistory(oldArray => [...oldArray, spinNumber])

        //payment
        console.log('bet: ', winsObj.bet, ' player: ', winsObj.player)
        setBBet(oldBalance => oldBalance + winsObj.bet)
        setWinBet(oldWin => oldWin + winsObj.bet)
        setWinHistoryBet(oldArray => [...oldArray, winBet + winsObj.bet])

        setBPlayer(oldBalance => oldBalance + winsObj.player)
        setWinPlayer(oldWin => oldWin + winsObj.player - bet)
        setWinHistoryPlayer(oldArray => [...oldArray, winPlayer + winsObj.player - bet])

        //reset bets
        setBet(0)
        setValuesBet(oldArray => Array.from(oldArray, () => 0))
        let newObjBlends = Object.keys(valuesBlends).reduce((obj, key) => {
          obj[key as keyof blendsObj] = 0
          return obj
        }, {} as blendsObj)
        setValuesBlends(newObjBlends)
      }, 2000)
    }
  }

  // -------------------- appearance funcs
  function defineTokenColor(value: number) {
    if (value < 5)
      return 'zinc-400';
    if (value < 10)
      return 'cyan-500';
    if (value < 25)
      return 'orange-500';
    if (value < 50)
      return 'red-600';
    if (value < 100)
      return 'green-600';
    return 'violet-600';
  }
  function defineNumberColor(number: number) {
    if (redNumbers.includes(number))
      return 'bg-red-600';
    if (blackNumbers.includes(number))
      return 'bg-stone-900';
  }
  function rollBall(indexNumber: number) {
    let newAngle = 9.75 * indexNumber
    setAngleBall(newAngle)
  }

  return (
    <main className="min-w-min w-screen  min-h-min h-screen flex flex-col bg-zinc-800 text-zinc-50 overflow-auto gap-5 py-5 px-8">
      <section className="w-full h-12 flex justify-center items-center">
        <div>
          <h1 className="text-2xl font-bold">Roulette</h1>
        </div>
      </section>
      <section className="w-full flex justify-center">
        <div className="h-full flex justify-center items-start gap-8">

          {/* ------------------------------------------------------ roulette and history ------------------------------------------------------ */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-72 h-72 relative flex justify-center items-center gap-4 bg-white rounded-full shadow-black shadow-lg border-[#f5c451] border-[10px] border-solid overflow-hidden">
              <div className="w-56 h-56 absolute font-semibold text-xs">
                {
                  rouletteOrder.map((number, index) => {
                    return (
                      <div key={`roulette${number}`} className={`w-1/2 h-1/2 absolute piece p-[17px] select-none ${redNumbers.includes(number) ? 'bg-red-600' : blackNumbers.includes(number) ? 'bg-stone-900' : 'bg-green-500'}`} style={{ '--index': index + 1 } as React.CSSProperties}>
                        <span className="w-4 h-4 block text-center relative transform -rotate-45">{number}</span>
                      </div>
                    )
                  })
                }
              </div>
              <div className="w-56 h-56 bg-transparent rounded-full z-30 border-[#f5c451] border-[3px] border-solid" />
              <div className="w-2/3 h-2/3 absolute flex justify-center items-center bg-[#632016] rounded-full z-30 border-[#f5c451] border-[4px] border-solid">
                <GiSkullCrossedBones className="w-3/5 h-3/5 text-[#d4f3f5] -rotate-[65deg]" />
              </div>
              <div className={`w-52 h-52 absolute flex justify-center rounded-full z-50 transform ball`} style={{ transform: `rotate(${angleBall}deg)` }}>
                <div className="w-3 h-3 ml-[12.8px] absolute bg-white rounded-full z-50" />
              </div>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <h1 className="font-semibold text-sm">History</h1>
              <div className="w-56 h-10  overflow-x-auto scroll scrollbar-hidden bg-gray-50 bg-opacity-15">
                <div className="w-fit flex flex-row-reverse justify-end gap-1 p-1">
                  {numberHistory.map((numberRaffled, index) => {
                    return (
                      <div className={`flex-shrink-0 w-8 h-8 flex justify-center items-center select-none ${redNumbers.includes(numberRaffled) ? 'bg-red-500' : blackNumbers.includes(numberRaffled) ? 'bg-black' : 'bg-green-500'}`} key={`raff${index}`}>
                        {numberRaffled}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ table and tokens ------------------------------------------------------ */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-start">
              {/*zero*/}
              <div className="w-10 h-[124px] bg-white p-[1px]">
                <button key={0} className={`w-full h-full flex justify-center items-center bg-green-500 hover:brightness-90`} onClick={
                  () => {
                    if (bPlayer >= bet + chip) {
                      putBet(0)
                    }
                  }}>
                  {valuesBet[0] !== 0 && (
                    <>
                      <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBet[0])} absolute z-10`} />
                      <p className="text-xs font-medium text-black absolute z-20">{valuesBet[0]}</p>
                    </>
                  )}
                  0
                </button>
              </div>
              <div className="flex items-start bg-white gap-[1px] p-[1px]">
                {/*first*/}
                <div className="flex flex-col gap-[1px]">
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
                                <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBet[number])} absolute z-10`} />
                                <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                              </>
                            )}
                            {number}
                          </button>
                        )
                      })
                    }
                  </div>
                  <div className="w-full h-10">
                    <button className="w-full h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.first
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            first: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.first !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.first)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.first}</p>
                        </>
                      )}
                      1st 12
                    </button>
                  </div>
                  <div className="w-full h-10 flex gap-[1px]">
                    <button className="w-1/2 h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.leftN
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            leftN: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.leftN !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.leftN)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.leftN}</p>
                        </>
                      )}
                      1 to 18
                    </button>
                    <button className="w-1/2 h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.even
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            even: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.even !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.even)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.even}</p>
                        </>
                      )}
                      EVEN
                    </button>
                  </div>
                </div>
                {/*second*/}
                <div className="flex flex-col gap-[1px]">
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
                                <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBet[number])} absolute z-10`} />
                                <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                              </>
                            )}
                            {number}
                          </button>
                        )
                      })
                    }
                  </div>
                  <div className="w-full h-10">
                    <button className="w-full h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.second
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            second: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.second !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.second)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.second}</p>
                        </>
                      )}
                      2nd 12
                    </button>
                  </div>
                  <div className="w-full h-10 flex gap-[1px]">
                    <button className="w-1/2 h-full flex justify-center items-center bg-red-600 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.red
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            red: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.red !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.red)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.red}</p>
                        </>
                      )}
                    </button>
                    <button className="w-1/2 h-full flex justify-center items-center bg-stone-900 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.black
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            black: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.black !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.black)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.black}</p>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/*third*/}
                <div className="flex flex-col gap-[1px]">
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
                                <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBet[number])} absolute z-10`} />
                                <p className="text-xs font-medium text-black absolute z-20">{valuesBet[number]}</p>
                              </>
                            )}
                            {number}
                          </button>
                        )
                      })
                    }
                  </div>
                  <div className="w-full h-10">
                    <button className="w-full h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.third
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            third: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.third !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.third)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.third}</p>
                        </>
                      )}
                      3rd 12
                    </button>
                  </div>
                  <div className="w-full h-10 flex gap-[1px]">
                    <button className="w-1/2 h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.odd
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            odd: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.odd !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.odd)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.odd}</p>
                        </>
                      )}
                      ODD
                    </button>
                    <button className="w-1/2 h-full flex justify-center items-center bg-zinc-800 hover:brightness-90" onClick={
                      () => {
                        if (bPlayer >= bet + chip) {
                          setBet(oldBet => oldBet + chip)
                          let oldValue = valuesBlends.rightN
                          setValuesBlends(oldObject => ({
                            ...oldObject,
                            rightN: oldValue + chip
                          }))
                        }
                      }
                    }>
                      {valuesBlends.rightN !== 0 && (
                        <>
                          <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.rightN)} absolute z-10`} />
                          <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.rightN}</p>
                        </>
                      )}
                      19 to 36
                    </button>
                  </div>
                </div>
              </div>
              {/*cols*/}
              <div className="w-[124px] h-10 flex  bg-white p-[1px] gap-[1px] -rotate-90 -ml-[43px] mt-[42px]">
                <button className="w-1/3 flex justify-center items-center text-xs bg-zinc-800 hover:brightness-90" onClick={
                  () => {
                    if (bPlayer >= bet + chip) {
                      setBet(oldBet => oldBet + chip)
                      let oldValue = valuesBlends.col1
                      setValuesBlends(oldObject => ({
                        ...oldObject,
                        col1: oldValue + chip
                      }))
                    }
                  }
                }>
                  {valuesBlends.col1 !== 0 && (
                    <>
                      <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.col1)} absolute z-10`} />
                      <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.col1}</p>
                    </>
                  )}
                  2 to 1
                </button>
                <button className="w-1/3 flex justify-center items-center text-xs bg-zinc-800 hover:brightness-90" onClick={
                  () => {
                    if (bPlayer >= bet + chip) {
                      setBet(oldBet => oldBet + chip)
                      let oldValue = valuesBlends.col2
                      setValuesBlends(oldObject => ({
                        ...oldObject,
                        col2: oldValue + chip
                      }))
                    }
                  }
                }>
                  {valuesBlends.col2 !== 0 && (
                    <>
                      <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.col2)} absolute z-10`} />
                      <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.col2}</p>
                    </>
                  )}
                  2 to 1
                </button>
                <button className="w-1/3 flex justify-center items-center text-xs bg-zinc-800 hover:brightness-90" onClick={
                  () => {
                    if (bPlayer >= bet + chip) {
                      setBet(oldBet => oldBet + chip)
                      let oldValue = valuesBlends.col3
                      setValuesBlends(oldObject => ({
                        ...oldObject,
                        col3: oldValue + chip
                      }))
                    }
                  }
                }>
                  {valuesBlends.col3 !== 0 && (
                    <>
                      <PiPokerChipFill className={`w-8 h-8 rounded-full bg-${defineTokenColor(valuesBlends.col3)} absolute z-10`} />
                      <p className="text-xs font-medium text-black absolute z-20">{valuesBlends.col3}</p>
                    </>
                  )}
                  2 to 1
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center bg-opacity-25 bg-gray-400 rounded-full gap-2 py-2 px-4">
              <button onClick={() => setChip(1)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 1 ? 'border-[3px]' : ''}`}>
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-zinc-400" />
                <p className="text-sm font-medium text-black absolute">1</p>
              </button>
              <button onClick={() => setChip(5)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 5 ? 'border-[3px]' : ''}`}>
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-cyan-500" />
                <p className="text-sm font-medium text-black absolute">5</p>
              </button>
              <button onClick={() => setChip(10)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 10 ? 'border-[3px]' : ''}`}>
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-orange-500" />
                <p className="text-sm font-medium text-black absolute">10</p>
              </button>
              <button onClick={() => setChip(25)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 25 ? 'border-[3px]' : ''}`}>
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-red-600" />
                <p className="text-sm font-medium text-black absolute">25</p>
              </button>
              <button onClick={() => setChip(50)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 50 ? 'border-[3px]' : ''}`}>
                <PiPokerChipFill className="w-10 h-10 rounded-full bg-green-600" />
                <p className="text-sm font-medium text-black absolute">50</p>
              </button>
              <button onClick={() => setChip(100)} className={`flex justify-center items-center rounded-full hover:brightness-90 border-solid border-white ${chip == 100 ? 'border-[3px]' : ''}`}>
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
                  let newObjBlends = Object.keys(valuesBlends).reduce((obj, key) => {
                    obj[key as keyof blendsObj] = 0
                    return obj
                  }, {} as blendsObj)
                  setValuesBlends(newObjBlends)
                }}>Reset</button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ infos, deposit and chart ------------------------------------------------------ */}
        <div className="h-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <h1 className="font-semibold">Bet</h1>
            <div className="w-full flex flex-col gap-1 items-start">
              <p>Balance: {bBet}</p>
              <p>Winnings: {winBet}</p>
            </div>
            <div className="flex gap-1 text-black text-sm">
              <input type="text" name="depositBet" id="depositBet" className="w-full px-1" value={depositBet} onKeyDown={
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
          <div className="w-full flex flex-col gap-1">
            <h1 className="font-semibold">Player</h1>
            <div className="w-full flex flex-col gap-1 items-start">
              <p>Balance: {bPlayer}</p>
              <p>Winnings: {winPlayer}</p>
            </div>
            <div className="flex gap-1 text-black text-sm">
              <input type="text" name="depositPlayer" id="depositPlayer" className="w-full px-1" value={depositPlayer} onKeyDown={
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
          <div className="w-full h-60 flex flex-col items-center bg-zinc-400 bg-opacity-15 rounded py-2 px-4">
            <h1 className="font-semibold p-0 m-0 text-gray-200">Wins Chart</h1>
            <div className="w-full h-full">
              <Line data={{
                labels: winHistoryPlayer.map((value, index) => { return index + 1 }),
                datasets: [
                  {
                    label: 'Wins Bet',
                    data: winHistoryBet.map(value => { return value }),
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                  },
                  {
                    label: 'Wins Player',
                    data: winHistoryPlayer.map(value => { return value }),
                    borderColor: '#0ea5e9',
                    backgroundColor: '#0ea5e9',
                  },
                ],
              }} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    ticks: {
                      color: '#e5e7eb'
                    },
                    grid: {
                      color: '#e5e7eb'
                    },
                    beginAtZero: false,
                    min: undefined,
                  },
                  x: {
                    ticks: {
                      color: '#e5e7eb'
                    },
                    grid: {
                      color: '#e5e7eb'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: '#e5e7eb'
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>
      </section>
    </main >
  );
}
