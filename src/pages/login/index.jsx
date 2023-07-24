import {
  FaGoogle as Gg,
  FaMicrosoft as Mc,
} from 'react-icons/fa'
import {  AiOutlineLoading as Ld } from 'react-icons/ai'
import '../../css/App.css'
import logo from "../../assets/SuiteLogo.png";
import { IconContext } from 'react-icons/lib';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../hooks/AuthContext';

function LoginPage() {

  return (
    <div className="w-screen h-screen 
    bg-[radial-gradient(farthest-corner_circle_at_50%_50%,_#fff0_0%,_#dedede_100%)]">
      <div className="flex justify-center items-center w-full h-full
      bg-cover bg-no-repeat bg-center bg-[url('/src/assets/layered-waves.svg')]">
        <div className='flex w-[27rem] h-auto'>
          <TextLogin/>

        </div>
      </div>

    </div>
  )
}

function TextLogin(){
  const [loading, setLoading] = useState(false);
  const [loginFail, setLoginFail] = useState(false);
  //console.log(loginFail);

  useEffect(()=>{
    setTimeout(()=>{
      setLoginFail(false);
    },3000)
  },[loginFail])

  return(
    <div className='relative flex justify-center py-7 w-full shadow-4l rounded-lg bg-white'>
      
      <div className={(loading?'visible':'invisible')+' absolute top-0 z-10 flex justify-center items-center w-full h-full'}>
        <div className='flex flex-col items-center gap-3 z-20 text-white text-2xl'>
          Loading
          <IconContext.Provider value={{color: 'bg-white', size: 20}}>
            <div className='animate-spin'>
              <Ld/> 
            </div>
          </IconContext.Provider>
        </div>
        <div className='absolute z-10 rounded-lg w-full h-full bg-slate-800 backdrop-blur-lg'
        style={{background: "rgba(0, 0, 0, 0.65)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(1.5px)",
          }}></div>
      </div>

      <div className={'absolute top-3 bg-red-600 p-3 rounded-md text-white z-10 '+
          (loginFail?'visible opacity-100 translate-y-0':'invisible opacity-0 -translate-y-8')}
          style={{transition:'visibility 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.2s ease-in-out'}}
      >
            
        Login Failed
      </div>
			<div className='flex flex-col items-center gap-5 w-3/4'>

				<img className='sepia-0 backdrop-brightness-0 w-24 rounded' src={logo}/>
        <h1 className='text-3xl'>Welcome Back</h1>

        <FormLogin setLogFail={setLoginFail} setLoad={setLoading}/>
        <hr className='bg-primary w-full h-[3px] rounded-xl opacity-90'/>
        <SocialLogin/>
        <div className='flex gap-1'>
          <span className='opacity-80'>Dont have an account? </span>
          <button className='font-medium underline'>SignUp</button>
        </div>
			</div>
    </div>
  )
}

function FormLogin({setLogFail, setLoad}){
  const [userValue, setUserValue] = useState('');
  const [passValue, setPassValue] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // async function signIn(e){
  //   e.preventDefault();
  //   try {
  //     setLoad(true);
  //     login(userValue, passValue);
  //     //navigate('/calendar');
  //   } catch (error) {

  //     console.log(error);
  //     setLogFail(true);

  //     //e.target.reset();
  //   }

  //   navigate('/calendar');
  //   setLoad(false);

  // }

  function signIn(e){

    e.preventDefault();
    setLoad(true);
    login(userValue, passValue)
    .then(()=>{
      navigate('/calendar');
      setLoad(false);
    }).catch((error)=>{

      console.log(error);
      setLogFail(true);
      setLoad(false);
    })

  }
  
  return(
    <form className='flex flex-col gap-5 w-full' onSubmit={signIn}>
      <div className='flex flex-col'>
        <label className='text-lg'>Username</label>
        <TextField type={'email'} placeholder={"Your username"} value={userValue} setVal={setUserValue}/>
      </div>

      <div className='flex flex-col'>
        <label className='text-lg'>Password</label>
        <TextField type={'password'} placeholder={"Your password"} value={passValue} setVal={setPassValue}/>
      </div>

      <button className='bg-primary text-white text-lg rounded-3xl p-2' type='submit'>Login</button>

      <div className='flex justify-between'>
        <div className='flex items-center gap-1'>
          <input className='w-4 h-4 form-checkbox text-primary border-primary border-2 opacity-80 rounded focus:ring-transparent' type='checkbox' value={'remember'}/>
          Remember me
        </div>
        <button className='underline text-primary opacity-80' type='button'>Forgot Password?</button>
      </div>
    </form>
  )
}

function TextField({type, placeholder, val, setVal}){
  
  return(
    <input className='border-2 rounded-md p-1 px-2' type={type} placeholder={placeholder} value={val} onChange={val => setVal(val.target.value)}/>
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
