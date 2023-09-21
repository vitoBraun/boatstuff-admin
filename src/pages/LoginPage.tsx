import React, { useState } from 'react'
import { login } from '../common/ApiService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event: any) => {
        event.preventDefault();

        try {
            const response = await login({ email, password });
            if (response) {
                navigate('/products')
            }

        } catch (error) {
            console.log(error);
        }
    };
    return (


        <form onSubmit={handleSubmit} className="w-screen h-screen overflow-hidden flex justify-center items-center bg-white">
            <div className="w-full my-2 md:w-3/5 lg:w-2/5">
                <div className="flex justify-center items-center mt-10 mb-20">

                </div>
                <div className="flex my-8 mx-4 md:mx-2 border-b-2 border-gray-700 hover:border-green-800">

                    <input className="w-full py-3 pl-5 md:pl-20 border-0 focus:outline-none" type="email" placeholder="johndoe@gmail.com" autoComplete="on" required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex my-8 mx-4 md:mx-2 border-b-2 border-gray-700 hover:border-green-800">

                    <input className="w-full py-3 pl-2 md:pl-8 border-0 focus:outline-none" type="password" required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button ></button>
                <button type="submit" className="m-4 block hover:border-white rounded-xl border p-3 border-gray-500 disabled:text-gray-400" >Login</button>
            </div>
        </form>
    )
}
