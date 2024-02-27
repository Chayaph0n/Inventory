import React, { useState, useEffect } from 'react';
import './Login.css';
import Swal from 'sweetalert2';
import address from '../components/Address';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [isLoginForm, setIsLoginForm] = useState(true);
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsLoginForm(false);
    };

    const handleLoginClick = () => {
        setIsLoginForm(true);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const jsonData = {
            id: data.get('id'),
            password: data.get('password'),
        };

        // Login
        fetch(`${address}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(response => response.json())
        .then(async (data) => {
            if (data.status === 'ok') {
                await Swal.fire({
                    title: 'Login Success!',
                    text: 'You will be able to proceed with deletion.',
                    icon: 'success',
                    confirmButtonColor: '#4b5bec',
                })
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', jsonData.id); 
                navigate('/home');
            } else {
                await Swal.fire({
                    title: 'Login Failed',
                    text: 'Please check your ID or password and try again.',
                    icon: 'error',
                    confirmButtonColor: '#fe3445',
                });
            }
            console.log('Success', data);
        })
        .catch((error) => {
            console.error('Error: ', error);
        });
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const jsonData = {
            id: data.get('id'),
            password: data.get('password'),
            fname: data.get('fname'),
            lname: data.get('lname'),
            phone: data.get('phone'),
        };
    
        // Register
        fetch(`${address}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(response => response.json())
        .then(async (data) => {
            if (data.status === 'ok') {
                await Swal.fire({
                    title: 'Registration Success!',
                    text: 'You can now log in and proceed.',
                    icon: 'success',
                    confirmButtonColor: '#4b5bec',
                })
                window.location = '/';
            } else if (data.message === 'User already exists') {
                await Swal.fire({
                    title: 'Registration Failed',
                    text: 'The provided User ID already exists. Please choose a different User ID.',
                    icon: 'error',
                    confirmButtonColor: '#fe3445',
                });
            } else {
                await Swal.fire({
                    title: 'Registration Failed',
                    text: 'Check your information.',
                    icon: 'error',
                    confirmButtonColor: '#fe3445',
                })
            }
            console.log('Success', data);
        })
        .catch((error) => {
            console.error('Error: ', error);
        });
    };

    return (
        <div>
            <div className="background">
                <div className='container'>
                    <div className="content">
                        <img src="/public/img/wd_bg.png" alt="" />
                    </div>
                    <div className={`logreg-box ${isLoginForm ? '' : 'active'}`}>
                        <div className={`form-box login ${isLoginForm ? 'active' : ''}`}>
                            <form action="#" onSubmit={handleLoginSubmit}>
                                <h2>Sign In</h2>
                                <div className="input-box">
                                    <span className="material-symbols-outlined">mail</span>
                                    <input type="text" id="id" name="id" maxLength={10} required />
                                    <label>User ID</label>
                                </div>

                                <div className="input-box">
                                    <span className="material-symbols-outlined">lock</span>
                                    <input type="password" id="password" name="password" required />
                                    <label>Password</label>
                                </div>

                                <button type='submit' className='btn'>Sign In</button>

                                <div className="login-register">
                                    <p>Don't have an account?</p>
                                    <a href="#" className='register-link' onClick={handleRegisterClick}>Sign up</a>
                                </div>
                            </form>
                        </div>

                        <div className={`form-box register ${isLoginForm ? '' : 'active'}`}>
                            <form action="#" onSubmit={handleRegisterSubmit}>
                                <h2 className='mt'>Sign Up</h2>
                                <div className="input-box">
                                    <span className="material-symbols-outlined">person</span>
                                    <input type="text" id="fname" name="fname" required />
                                    <label>First Name</label>
                                </div>

                                <div className="input-box">
                                    <span className="material-symbols-outlined">group</span>
                                    <input type="text" id="lname" name="lname" required />
                                    <label>Last Name</label>
                                </div>

                                <div className="input-box">
                                    <span className="material-symbols-outlined">call</span>
                                    <input type="text" id="phone" name="phone" maxLength={10} required />
                                    <label>Phone Number</label>
                                </div>

                                <div className="input-box">
                                    <span className="material-symbols-outlined">mail</span>
                                    <input type="text" id="id" name="id" maxLength={10} required />
                                    <label>User ID</label>
                                </div>

                                <div className="input-box">
                                    <span className="material-symbols-outlined">lock</span>
                                    <input type="password" id="sign-password" name="password" required />
                                    <label>Password</label>
                                </div>

                                <button type='submit' className='btn'>Sign Up</button>

                                <div className="login-register">
                                    <p>Already have an account?</p>
                                    <a href="#" className='login-link' onClick={handleLoginClick}>Sign in</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
