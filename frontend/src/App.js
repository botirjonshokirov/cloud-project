import React, {Component} from 'react'
import './App.css'
import MainPage from './pages/MainPage'
import AboutPage from './pages/About'
import Configurator from './pages/Configurator'
import ConactsPage from './pages/Contacts'
import FeaturedPage from './pages/Featured'
import NavigationBar from './NavigationBar'
import BuildPage from './pages/BuildPage'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavigationBar />
          <div id="page-body">
            <Route path="/" component={MainPage} exact />
            <Route path="/about" component={AboutPage} exact />
            <Route path="/build-your-own" component={Configurator} exact />
            <Route path="/contacts" component={ConactsPage} exact />
            <Route path="/builds/" component={FeaturedPage} exact />
            <Route path="/builds/:id" component={BuildPage} exact />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
