import { createSignal } from 'solid-js'
import { A } from "@solidjs/router";

const base32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const generateId = () => Array.from({length: 12}, () =>
  base32[Math.floor(Math.random() * 32)]
).join('')

const Random = () => {
  const [ id, setId ] = createSignal(generateId())
  const [ update, setUpdate ] = createSignal(false)
  
  const handleClick = () => {
    setId(generateId())
    console.log(parseInt(id(), 32))
    setUpdate(true)
  }

  const group = () => {
    let int = parseInt(id(), 32)
    if (int % 2 == 0) {
      return "Sugar Water"
    } else {
      return "Plain Water"
    }
  }

  const Question = () => {
    //return <a href="https://chmlee.github.io/digit-span/question/{id()}">https://chmlee.github.io/digit-span/question/{id()}</a>
    const link = () => `/question/${id()}`
    return <A href={link()}>https://chmlee.github.io/digit-span/question/{id()}</A>
  }

  const First = () => {
    const link = () => `/memory/${id()}/1`
    return <a href={link()}>https://chmlee.github.io/digit-span/memory/{id()}/1</a>
  }

  const Second = () => {
    const link = () => `/memory/${id()}/2`
    return <a href={link()}>https://chmlee.github.io/digit-span/memory/{id()}/2</a>
  }

  

  return (<>
    <h1>Randomly generate ID</h1>
    <p>ID: {id}</p>
    <p>Group: {group()}</p>
    <p><button onclick={handleClick}>New ID</button></p>
      <p>Thank for participating in our experiment!</p>
      <p>Please complete the questionnaire before starting the experiment:</p>
      <Question />
      <p>Then begin the experiment:</p>
      <First />
      <p>After completing the experiment, rinse your mouth as instructed.</p>
      <p>90 minutes later, redo the experiment, with the following link:</p>
      <Second />
  </>)
}


export default Random
