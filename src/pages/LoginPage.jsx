import '../App.css'

function LoginPage() {

  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className='flex w-7/12 h-3/4 bg-slate-400'>
        <TextLogin/>
        <BtnLogin/>
      </div>
    </div>
  )
}

function TextLogin(){

  return(
    <div className='flex justify-center items-center bg-red-400 w-1/2'>
			<div className='flex flex-col justify-center items-center gap-5 bg-red-200 w-5/6 h-5/6'>
				<h1 className='text-3xl'>Login</h1>
				<input type='text'></input>
				<input type='text'></input>
				<button/>
			</div>
    </div>
  )
}

function BtnLogin(){

	return(
		<div className='flex justify-center items-center bg-green-400 w-1/2'>
			<div className='bg-green-200 w-5/6 h-5/6'>

			</div>
		</div>
	)
}

export default LoginPage
