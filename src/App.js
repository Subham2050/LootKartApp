import Footer from './components/Footer'
import Header from './components/Header'
import HomePage from './screenPages/HomePage';
import ProductPage from './screenPages/ProductPage'
import {Container} from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
    <Router>
    <div className="App">
      <Header/>
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' Component={HomePage} exact/>
            <Route path='/products/:id' Component={ProductPage} exact/>
          </Routes>
        </Container>
      </main>
      <Footer/>
    </div>
    </Router>
  );
}

export default App;
