import {
  Navbar,
  Hero,
  Highlights,
  Model,
  Feature
} from "src/components";
import './App.css'

function App() {

  return (
    <main className="bg-black">
      <Navbar/>
      <Hero />
      <Highlights />
      <Model />
      <Feature />
    </main>
  )
}

export default App
