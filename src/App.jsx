import './App.css'
import './index.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'


function App() {


  return (
    <div className='flex flex-row-reverse overflow-auto remove-scroll'>
      <Main/> 
      <Sidebar/>
      
    </div>
  )
}

export default App
