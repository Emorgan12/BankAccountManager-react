import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';

function SignIn() {    
    const [user, setUser] = useState([]);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signedIn, setSignedIn] = useState(false);

    const BASE_URL = 'https://localhost:5001/accounts';
  useEffect(() => {
    if (username && password) {
        fetch(`${BASE_URL}/${username} ${password}`)
            .then(response => {
                if (response.status === 200) {
                    setSignedIn(true);
                    return response.json();
                } else {
                    setSignedIn(false);
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                if (data && data.balance !== undefined) {
                    setUser(data);
                } else {
                    throw new Error('Invalid user data');
                }
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                setError('Error fetching user');
            });
    }
}, [username, password]);

  
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted:', { username, password });
    }
  

    return (
        !signedIn ? (
        <>
        <div className="container">
            <h1 className="title">Bank Account Manager</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username" className="label">Username</label><br />
                    <input 
                        type="text" 
                        id="username" 
                        className="inputs" 
                        value={username} 
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="label">Password</label><br />
                    <input 
                        type="password" 
                        id="password" 
                        className="inputs" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="login-signup">Login</button>
            </form>
            <p id="signup-login-link">Don't have an account? <a href="sign-up.html">Sign Up</a></p>
        </div>
        </> ) : (
        <>
        <h1 id="welcome">Welcome, {username}</h1>
    
        <div className="container">
            <div id="balance">
                <p>{user.balance}</p>
            </div>
        </div>
        <div className="container">
            <button className="dashboard-buttons"><a href="withdraw.html">Withdraw Funds</a></button>
            <button className="dashboard-buttons"><a href="deposit.html">Deposit Funds</a></button>
            <button className="dashboard-buttons"><a href="transfer.html">Transfer Funds</a></button>
        </div>
        </>
        )
    );
}

ReactDOM.render(<SignIn />, document.getElementById('app'));