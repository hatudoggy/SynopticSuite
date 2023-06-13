import './App.css'
import Sidebar from './components/Sidebar'
import Main from './components/Main'


function App() {


  return (
    <div className='flex flex-row-reverse'>
      <Main/> 
      <Sidebar/>
      
    </div>
  )
}

export default App
