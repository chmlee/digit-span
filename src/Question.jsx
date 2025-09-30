import { createSignal } from 'solid-js'
import { useParams } from "@solidjs/router";
import QRCode from 'qrcode'


function Question() {
  const params = useParams()
  const [ msg, setMsg ] = createSignal('')

  const submit = () => {
    
    setMsg("Please save the following QR code and send it to the research moderator.\nIf you do not see a QR code below after submitting, you might have missed some questions. Do not leave any answer blank!")
    const alcohol = document.querySelectorAll("#alcohol")[0].value
    const exam = document.querySelectorAll('input[type="radio"]:checked')[0].value
    const wakeup = document.querySelectorAll("#wakeup")[0].value
    const sleep = document.querySelectorAll("#sleep")[0].value
    const breakfast = document.querySelectorAll("#breakfast")[0].value
    const travel = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.id)
    const coffee = document.querySelectorAll("#coffee")[0].value

    const result = {
      id: params.id,
      alcohol, exam, wakeup, sleep, breakfast, travel, coffee
    }


    for (let key in result) {
      console.log(key, result[key])
    }
    const data = JSON.stringify(result)

    const canvas = document.getElementById('qr')

    QRCode.toCanvas(canvas, data, (error) => {
      if (error) console.log(error)
      console.log('success')
    })
    

  }

  return (<>
    <h1>Questionnaire</h1>
    <h2>ID: {params.id}</h2><div>
    <div className="q-row">
      <div className="question">
        1. In the 10 hours before bed last night, did you consume any alcohol?
        If yes, list each drink and its amount (e.g. 1 glass of wine, 2 bottles of beer).
	If no, write "none".
	
      </div>
      <input type="text" required id="alcohol" />
    </div>

    <div className="q-row">
      <div className="question">
        2. Did you have exams yesterday?
      </div>
        <input type="radio" id="exam" name="exam" value="yes" /> <label for="exam-yes">Yes</label> 
        <input type="radio" id="exam"  name="exam" value="no"  /> <label for="exam-no" >No </label> 
    </div>

    <div className="q-row">
      <div className="question">
        3. Approximately what time did you get up today?
      </div>
      <input type="time" id="wakeup" name="wakeup" min="00:00" max="12:00" required />
    </div>

    <div className="q-row">
      <div className="question">
        4. How many hours did you sleep last night?
      </div>
      <input type="number" id="sleep" name="sleep" min="0" max="24" required/>
    </div>

    <div className="q-row">
      <div className="question">
        5. If you had breakfast today, what did you have for breakfast and approximate how much? 
        Briefly describe it in one sentence, e.g. 2 egg, 3 slices of bread and 1 cup of milk.
	If no, write "none"
      </div>
      <input type="text" required id="breakfast" />
    </div>

    <div className="q-row">
      <div className="question">
        6. How did you travel to school today? Choose all that apply:
      </div>
      <div>
        <input type="checkbox" id="walk" name="walk"/>
        <label for="walk">Walk</label>
      </div>
      <div>
        <input type="checkbox" id="bike" name="bike"/>
        <label for="bike">Bike</label>
      </div>
      <div>
        <input type="checkbox" id="motorbike" name="motorbike"/>
        <label for="motorbike">Motorbike</label>
      </div>
      <div>
        <input type="checkbox" id="public-transportation" name="walk"/>
        <label for="public-transportation">Public Transportation</label>
      </div>
      <div>
        <input type="checkbox" id="car" name="car"/>
        <label for="car">Car</label>
      </div>
    </div>

    <div className="q-row">
      <div className="question">
        7. Did you have coffee today? If yes, how many cups? e.g. 1 cup of Espresso.
      </div>
      <input type="text" required id="coffee" />
    </div>

    <button onclick={submit}>Submit</button></div>

    <p>{msg}</p>


    <canvas id="qr"> </canvas>
    
  </>)
}


export default Question

/*
1. During the 10 hours before you went to sleep last night, did you consume any alcohol?
If Yes, please give type of drink and amount, e.g. 1 glass of wine, 2 bottle of beer.

2. Did you have exams yesterday?

3. Approximately what time did you get up today?

4. How many hours did you sleep last night?

5. If you had breakfast today, what did you have for breakfast and approximate how much? 
e.g. 2 egg, 3 slices of bread and 1 cup of milk.

6. How did you travel to school today? Choose all that apply: walk, bicycle, motorbike, public transportation, car.

7. Did you have coffee today? If yes, how many cups?
*/
