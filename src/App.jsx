import {
  Navbar,
  Hero,
  Highlights,
  Model,
  Feature,
  HowItWork,
  Footer
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
      <HowItWork />
      <Footer />
    </main>
  )
}

export default App
