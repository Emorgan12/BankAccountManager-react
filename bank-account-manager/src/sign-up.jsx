import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import reactDom from 'react-dom';

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const BASE_URL = 'http://localhost:5000/accounts';
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('username:', username);
        console.log('password:', password);
        fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }
    
    return (  
        <>
             <div className="container">
        <h1 className="title">Bank Account Manager</h1>
        <form onSubmit={handleSubmit} method="post">
            <div>
                <label htmlFor="email" className="label">Email</label><br />
                <input type="email" id="email" className="inputs" />
            </div>
            <div>
                <label htmlFor="username" className="label">Username</label><br />
                <input type="text" id="username" className="inputs" onChange = {(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password" className="label">Password</label><br />
                <input type="password" id="password" className="inputs" onChange= {(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="purpose" className="label">Why are you making an account?</label><br />
                <select name="purpose" id="purpose" className="dropdown">
                    <option value="budgeting">To budget my finances</option>
                    <option value="large-goal">To save for a goal (large)</option>
                    <option value="small-goal">To save for a goal (small)</option>
                    <option value="tracking">To track incoming/outgoing finances</option>
                    <option value="other">Other/Prefer not to say</option>
                </select>
            </div>
            <button type="submit" className="login-signup">Sign Up</button>
        </form>
        <p id="signup-login-link">Already have an account? <a href="index.html">Log in</a></p>
    </div>
        </>
    );
}
reactDom.render(<SignUp />, document.getElementById('app'));