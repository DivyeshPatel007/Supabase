import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./contexts/AuthProvider"
import Approutes from "./routes/Approutes"



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Approutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
