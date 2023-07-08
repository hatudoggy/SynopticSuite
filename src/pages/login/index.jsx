import { useState } from 'react';
import {
  FaGoogle as Gg,
  FaMicrosoft as Mc
} from 'react-icons/fa'
import '../../css/App.css'
import logo from "../../assets/SuiteLogo.png";
import { IconContext } from 'react-icons/lib';

function LoginPage() {

  return (
    <div className="w-screen h-screen 
    bg-[radial-gradient(farthest-corner_circle_at_50%_50%,_#fff0_0%,_#dedede_100%)]">
      <div className="flex justify-center items-center w-full h-full
      bg-cover bg-no-repeat bg-center bg-[url('/src/assets/layered-waves.svg')]">
        <div className='flex w-[27rem]'>
          <TextLogin/>
        </div>
      </div>

    </div>
  )
}

function TextLogin(){

  return(
    <div className='flex justify-center py-7 w-full shadow-4l rounded-lg bg-white'>
			<div className='flex flex-col items-center gap-5 w-3/4'>

				<img className='sepia-0 backdrop-brightness-0 w-24 rounded' src={logo}/>
        <h1 className='text-3xl'>Welcome Back</h1>

        <FormLogin/>
        <hr className='bg-primary w-full h-[3px] rounded-xl opacity-90'/>
        <SocialLogin/>
        <div className='flex gap-1'>
          <span className='opacity-80'>Dont have an account? </span>
          <button className='font-medium underline'>Sign up</button>
        </div>
			</div>
    </div>
  )
}

function FormLogin(){
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState('');
  
  return(
    <form className='flex flex-col gap-5 w-full'>
      <div className='flex flex-col'>
        <label className='text-lg'>Username</label>
        <TextField placeholder={"Your username"} value={userValue} setVal={setUserValue}/>
      </div>

      <div className='flex flex-col'>
        <label className='text-lg'>Password</label>
        <TextField placeholder={"Your password"} value={passValue} setVal={setPassValue}/>
      </div>

      <button className='bg-primary text-white text-lg rounded-3xl p-2' type='submit'>Login</button>

      <div className='flex justify-between'>
        <div className='flex items-center gap-1'>
          <input className='w-4 h-4 text-primary border-primary border-2 opacity-80 rounded focus:ring-0' type='checkbox' value={'remember'}/>
          Remember me
        </div>
        <button className='underline text-primary opacity-80' type='button'>Forgot Password?</button>
      </div>
    </form>
  )
}

function TextField({placeholder, val, setVal}){
  
  return(
    <input className='border-2 rounded-md p-1 px-2' placeholder={placeholder} value={val} onChange={val => setVal(val.target.value)}/>
  )
}


function SocialLogin(){

  return(
    <div className='flex flex-col w-full items-center gap-2'>
      <SocialLoginBtn color='bg-blue-500' icon={<Gg/>} text='Google'/>
      <SocialLoginBtn color='bg-blue-500' icon={<Mc/>} text='Microsoft'/>
    </div>
  )
}


function SocialLoginBtn(props){

  return(
    <button className='flex items-center justify-around w-4/5 p-2 px-5 gap-1 text-md border-2 rounded-md'>
      <IconContext.Provider value={{color: 'bg-primary', size: 20}}>
        {props.icon} Login with {props.text}
      </IconContext.Provider>
    </button>
  )
}

export default LoginPage
