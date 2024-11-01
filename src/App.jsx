import { useState } from 'react'
import './App.css'
import Header from './Header'
import Footer from './Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Header />
      <p>cuerpo de la pagina</p>
      <Footer />
    </div>
  )
}

export default App