import {
  Navbar,
  Hero,
  Highlights,
  Model
} from "src/components";
import './App.css'

function App() {

  return (
    <main className="bg-black">
      <Navbar/>
      <Hero />
      <Highlights />
      <Model />
    </main>
  )
}

export default App
