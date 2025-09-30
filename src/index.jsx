/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route, HashRouter } from '@solidjs/router'
import Memory from './Memory.jsx'
import Random from './Random.jsx'
import Question from './Question.jsx'

const app = document.getElementById('app')

const Test = () => <h1>Test page</h1>

render(() => (
  <>
  <Router base="/digit-span">
    <Route path="/random" component={Random} />
    <Route path="/memory/:id/:trial" component={Memory} />
    <Route path="/question/:id" component={Question} />
    <Route path="/" component={Test} />
  </Router></>
), app)
