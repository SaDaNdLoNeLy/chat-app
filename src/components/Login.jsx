import React from 'react';
// import * as Components from './com.js';
import loginImg from '../assets/login.jpg';

export default function Login() {
    // const [signIn, toggle] = React.useState(true);
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
            <div className='hidden sm:block'>
                <img className='w-full h-full object-cover' src={loginImg} alt="" />
            </div>

            <div className='bg-gray-800 flex flex-col justify-center'>
                <form className='max-w-[400px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8'>
                    <h2 className='text-3xl dark:text-white font-bold text-center'>Welcome back!</h2>
                    <h2 className='text-xs dark:text-gray-400 font-bold text-center'>We're so excited to see you again!</h2>

                    <div className='flex flex-col text-gray-200 py-2'>
                        <div className='flex'>
                            <label className='text-sm'>EMAIL OR PHONE NUMBER</label>
                            <span  className='dark:text-red-600 ml-1'>*</span>
                        </div>
                        <input className='rounded-lg bg-gray-700 mt-1 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" />
                    </div>
                    <div className='flex flex-col text-gray-200 pt-2'>
                        <div className='flex'>
                            <label className='text-sm'>PASSWORD</label>
                            <span  className='dark:text-red-600 ml-1'>*</span>
                        </div>
                        <input className='p-2 rounded-lg bg-gray-700 mt-1 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="password" />
                    </div>
                    <div className='flex justify-between text-gray-400 py-2'>
                        {/* <p className='flex items-center'><input className='mr-2' type="checkbox" /> Remember Me</p> */}
                        <a href='' className='text-gray-400 hover:text-gray-200'>Forgot your password?</a>
                    </div>
                    <button className='w-full mt-5 mb-1 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Log in</button>
                    <div className='flex'>
                        <p  className='text-gray-400 mr-1'>Need an account? </p>
                        <a href='' className='text-gray-400 hover:text-gray-200'> Register</a>

                    </div>
                    
                </form>
            </div>
        </div>

    )
}
