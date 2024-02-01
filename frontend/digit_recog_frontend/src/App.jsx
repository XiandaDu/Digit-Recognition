import DrawingBoard from "./DrawingBoard.jsx";
import "./index.css"
import Welcome from "./Welcome.jsx";


const App = () => {
  return (
    <div className="max-container">
        <Welcome/>
        <DrawingBoard/>
    </div>
  )
}

export default App