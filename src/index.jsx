/* @refresh reload */
import { render } from 'solid-js/web'
import { Router, Route, HashRouter } from '@solidjs/router'
import Memory from './Memory.jsx'
import Random from './Random.jsx'
import Question from './Question.jsx'

const app = document.getElementById('app')

render(() => (
  <Router>
    <Route path="/random" component={Random} />
    <Route path="/memory/:id/:trial" component={Memory} />
    <Route path="/question/:id" component={Question} />
    <Route path="/" component={<h1>test</h1>} />
  </Router>
), app)
