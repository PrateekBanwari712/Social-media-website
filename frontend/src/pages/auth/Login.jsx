import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast"
import { API_URL } from '../../utilities/constant.js'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/user.slice.js'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await axios.post(`${API_URL}/user/login`,
                { email, password },
                { withCredentials: true })

            if (response.data.success) {
                dispatch(setUser(response.data.user))
                toast.success(response.data.message)
                navigate("/")
            }



        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 py-8 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Login to Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-blue-400 rounded-full inline-block"></span>
                        ) : null}
                        {loading ? "Please Wait" : "Login"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-600">Don't have an account?</span>
                    <Link to={'/signup'} className="text-blue-500 hover:underline ml-1">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;