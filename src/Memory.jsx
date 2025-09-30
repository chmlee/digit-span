import { createContext, createSignal, createEffect, useContext, onMount, onCleanup } from 'solid-js'
import { useParams } from "@solidjs/router";
import QRCode from 'qrcode'

const TestContext = createContext();

const TestProvider = (props) => {
  const [ digits, setDigits ] = createSignal([])
  const [ digitsIndex, setDigitsIndex ] = createSignal(0)
  const [ roundIndex, setRoundIndex ] = createSignal(0)
  const [ result, setResult ] = createSignal([])
  const [ status, setStatus ] = createSignal('init') // init, ready, next, flash, input, finish

  const value = {
    digits, setDigits,
    roundIndex, setRoundIndex,
    status, setStatus,
    digitsIndex, setDigitsIndex,
    result, setResult
  }

  return <TestContext.Provider value={value}>
    {props.children}
  </TestContext.Provider>
}

const FlashDigits = (props) => {
  const { digits, digitsIndex, setDigitsIndex, setStatus, status } = useContext(TestContext)

  
  const [ show, setShow ] = createSignal(true)

  let timerId;
  createEffect(() => {
    console.log(digits())
    let timerId = setInterval(() => {
      setShow(prev => {
        if (digitsIndex() > digits().length && digits().length > 0) {
	  setStatus('input')
          clearInterval(timerId)
	}
        if (prev) {
          return false;
	} else {
          setDigitsIndex(digitsIndex() + 1)
          return true
	}
      })
    }, 800)
  })

  onCleanup(() => clearInterval(timerId))

  const digit = () => digits()[digitsIndex()]

  return <p key={digits}>Your digits are: {show() ? digit() : ""}</p>
  
}

const Digit = (props) => {
  const { digits, roundIndex } = useContext(TestContext)

  return <p>digits: {digits} ({roundIndex})</p>
}

const Interactive = (props) => {
  const { roundIndex, setRoundIndex, setDigits, digits, status, setStatus, setDigitsIndex, result, setResult } = useContext(TestContext)
  const params = useParams()

  const [ inputAllowed, setInputAllowed ] = createSignal(false)
  const [ buttonAllowed, setButtonAllowed ] = createSignal(true)
  const [ buttonText, setButtonText ] = createSignal('Start Round')
  const [ message, setMessage ] = createSignal('')
  const [ startTime, setStartTime ] = createSignal(0)

  const handlePress = (e) => {
    if (status() === 'ready' || status() === 'init') {
      setInputAllowed(false)
      setButtonAllowed(false)
      setButtonText('Enter')
      setStatus('flash')
      handleNextRound()
    }
    if (status() === 'input') {
      let time = Date.now() - startTime()
      console.log(time)

      const answers = document.querySelectorAll("#answer")
      const answer = Array.from(answers)[0]
      console.log(answer.value)

      let newResult =  result()
      newResult.push([digits().join(""), answer.value, time])
      setResult(newResult)
      
      answer.value = ""
      if (roundIndex() < 10) { // update this
        setMessage('Your response has been recorded. Please continue.')
        setButtonText('Next Round')
        setStatus('ready')
      } else {
        setMessage('You have completed the test. Please save the following QR code and submit it to the test moderator.')
        setButtonText('Submit')
	setStatus('done')
      }
      setButtonAllowed(true)
      setInputAllowed(false)
    }
    if (status() === 'done') {
      //generate result
      const finalResult = {
        id: params.id,
	trial: params.trial,
	result: result(),
      }
      const data = JSON.stringify(finalResult)
      const canvas = document.getElementById('qr')
      QRCode.toCanvas(canvas, data, (error) => {
        if (error) console.log(error)
        console.log('success')
      })

    }
  }

  createEffect(() => {
    if (status() === 'flash') {
      setInputAllowed(false)
      setButtonAllowed(false)
      setButtonText('Enter')
      setMessage('Memorize the digits')
    }
    if (status() === 'input') {
      setInputAllowed(true)
      setButtonAllowed(true)
      setButtonText('Enter')
      setMessage('Please enter the digits you just saw')
      setStartTime(Date.now())
    }
    if (status() === 'done') {
      setInputAllowed(false)
      setButtonAllowed(true)
      setButtonText('Submit')
      setMessage('You have completed the test. Please save the following QR code and submit it to the test moderator.')
    }
  })

  const handleNextRound = () => {
    setRoundIndex(roundIndex() + 1)
    let n = Math.ceil(roundIndex()/2 + 1) + 3
    /* 
     * trial 1, 2  => 5 digits
     * trial 3, 4  => 6 digits
     * trial 5, 6  => 7 digits
     * trial 7, 8  => 8 digits
     * trial 9, 10 => 9 digits
     */
    //console.log(roundIndex(), status())
    setDigits(generateRandomDigits(n))
    console.log(digits())
    setDigitsIndex(-1)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
        handlePress()
    }
  }

  return (<> 
    <input
      type="text"
      disabled={!inputAllowed()}
      id="answer"
      onKeyDown={handleKey}
    />
    <button 
      onclick={handlePress}
      disabled={!buttonAllowed()}
    >{buttonText}
    </button>
    <p>{message}</p>
  </>)
}

const Header = () => {
  const { roundIndex } = useContext(TestContext)
  const params = useParams()

  return <div>
    <h1>Digit Span Memory Test</h1>
    <h2>ID: {params.id}; Trial: {params.trial}</h2>
    <p>Round {roundIndex}/10</p>
  </div>
}

const generateRandomDigits = n => {
  let digits = []
  for (let i = 0; i < n; i++) {
    let digit = Math.floor(Math.random() * 10)
    digits.push(digit)
  }

  return digits
}

function Memory() {
  return (
    <>
      <TestProvider>
	<Header />
	<FlashDigits />
	<Interactive />
	<canvas id="qr"> </canvas>
      </TestProvider>
    </>
  )
}


export default Memory
