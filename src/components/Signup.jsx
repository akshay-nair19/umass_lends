import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Signup = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const { session,signUpNewUser } = UserAuth();
const navigate = useNavigate();
//console.log(session);


const handleSignUp = async (e) =>{
    e.preventDefault()
    setLoading(true)
    try{
        const result = await signUpNewUser(email, password)

        if(result.success){
            navigate('/dashboard')
        }
    } catch(err) {
        setError("an error occured");

    } finally {
        setLoading(false); // maybe setLoading
    }

};

    return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
            <div className="max-w-md w-full mx-auto px-4">
                <form onSubmit={handleSignUp} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-3xl font-bold text-[#881c1c] pb-2 mb-4">Sign Up Today!</h2>
                    <p className="text-gray-600 mb-6">
                        Already have an account? <Link to="/signin" className="text-[#881c1c] hover:text-[#6b1515] font-semibold underline">Sign in!</Link>
                    </p>
                    <div className="flex flex-col py-4">
                        <input 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Email" 
                            className="p-3 mt-4 border-2 border-gray-300 rounded-lg focus:border-[#881c1c] focus:outline-none" 
                            type="email" 
                            required
                        />
                        <input 
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password" 
                            className="p-3 mt-4 border-2 border-gray-300 rounded-lg focus:border-[#881c1c] focus:outline-none" 
                            type="password" 
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={loading} 
                            style={{ backgroundColor: '#881c1c' }}
                            className="mt-6 w-full text-white py-3 px-4 rounded-lg hover:bg-[#6b1515] font-semibold transition-colors disabled:opacity-50 shadow-md cursor-pointer"
                        >
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                        {error && <p className="text-red-600 text-center pt-4">{error}</p>}
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Signup