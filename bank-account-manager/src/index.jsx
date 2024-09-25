import ReactDOM from 'react-dom';
import React, { useState, useEffect, useContext } from 'react';



function App() {    
    const [user, setUser] = useState([]);   
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [signedIn, setSignedIn] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [depositClicked, setDepositClicked] = useState(false);
    const [widthdrawClicked, setWidthdrawClicked] = useState(false);
    const [transferClicked, setTransferClicked] = useState(false);
    const [amount, setAmount] = useState(0);
    const [transferUser, setTransferUser] = useState([]);

    
    const BASE_URL = 'http://localhost:5000/accounts';
    
    
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
                setError('Error fetching user:', error);
                console.log(error);
            });
        }
    }, [username, password]);
    const handleSignIn = (event) => {
        event.preventDefault();
        if (!user)
            console.log('User not found');    
    }

    function add() {
        setAmount(amount + 1);
    }

    function subtract() {
        if (amount > 0) {
            setAmount(amount - 1);
        }
    }
    
    const handleDeposit = (event) => {
        event.preventDefault();
        console.log('Deposit submitted:', { amount });

        fetch(`${BASE_URL}/${username}, ${password}, ${amount} /deposit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'plain/text'
            },
            
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            console.log('Deposit response:', data);
            if (data && data.balance !== undefined) {
                setUser(data);
                setAmount(0); 
            } else {
                throw new Error('Invalid deposit response');
            }
        })
        .catch(error => {
            console.error('Error making deposit:', error);
            setError('Error making deposit');
        });

        setButtonClicked(false);
        setDepositClicked(false);
    }
    const handleWidthdraw = (event) => {
        event.preventDefault();
        console.log('Widthdraw submitted:', { amount });

        fetch(`${BASE_URL}/${username}, ${password}, ${amount} /widthdraw`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'plain/text'
            },
            
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .then(data => {
            console.log('Deposit response:', data);
            if (data && data.balance !== undefined) {
                setUser(data);
                setAmount(0); 
            } else {
                throw new Error('Invalid widthdraw response');
            }
        })
        .catch(error => {
            console.error('Error making widthdraw:', error);
            setError('Error making widthdraw');
        });

        setButtonClicked(false);
        setWidthdrawClicked(false);
    }

    const handleTransfer = (event) => {
        event.preventDefault();
        console.log('Transfer submitted:', { amount });
            fetch(`${BASE_URL}/${username}, ${password}, ${amount}, ${transferUser}/transfer`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'plain/text'
                },
                
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                console.log('Deposit response:', data);
                if (data && data.balance !== undefined) {
                    setUser(data);
                    setAmount(0); 
                } else {
                    throw new Error('Invalid transfer response');
                }
            })
            .catch(error => {
                console.error('Error making transfer:', error);
                setError('Error making transfer');
            });

        setButtonClicked(false);
        setTransferClicked(false);
    }
    return (
        !signedIn ? (
            <>
        <div className="container">
            <h1 className="title">Bank Account Manager</h1>
            <form onSubmit={handleSignIn}>
                <div>
                    <label htmlFor="username" className="label">Username</label><br />
                    <input 
                        type="text" 
                        id="username" 
                        className="inputs" 
                        onChange={(e) => setUserName(e.target.value)} 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="label">Password</label><br />
                    <input 
                        type="password" 
                        id="password" 
                        className="inputs" 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <button type="submit" className="login-signup">Login</button>
            </form>
            <p id="signup-login-link">Don't have an account? <a href="sign-up.html">Sign Up</a></p>
        </div>
        </> ) : (!buttonClicked ? (
            <>
        <h1 id="welcome">Welcome, {username}</h1>
    
        <div className="container">
            <div id="balance">
                <p>{user.balance}</p>
            </div>
        </div>
        <div className="container">
            <button className="dashboard-buttons" onClick={() => {setWidthdrawClicked(true); setButtonClicked(true); setDepositClicked(false)}}>Withdraw Funds</button>
            <button className="dashboard-buttons" onClick={() => {setDepositClicked(true); setButtonClicked(true);}}>Deposit Funds</button>
            <button className="dashboard-buttons" onClick={() => {setTransferClicked(true); setButtonClicked(true); setDepositClicked(false); setWidthdrawClicked(false)}}>Transfer Funds</button>
            <br />
            <button className="dashboard-buttons" onClick={() => {setSignedIn(false); setPassword(''); setUserName('')}}>Log Out</button>
        </div>
        </> ) : (depositClicked ? ( 
             <>
             <div className="container">
        <p className="label">How much would you like to deposit?</p>
        <form onSubmit={handleDeposit}>
            <div className="withdraw-deposit-parent">
                <button className="withdraw-deposit-button" type= "button" onClick= {add}>+</button>
                <input className="withdraw-deposit" value= {amount} type= "number" />
                <button className="withdraw-deposit-button" type= "button" onClick = {subtract}>-</button>
            </div>
            <button className="withdraw-deposit-button">Deposit</button>
        </form>
        <br />
            <button className="dashboard-buttons" onClick={() => {setWidthdrawClicked(true); setButtonClicked(true); setDepositClicked(false)}}>Widthdraw Funds</button>
            <button className="dashboard-buttons" onClick={() => {setTransferClicked(true); setButtonClicked(true); setDepositClicked(false)}}>Transfer Funds</button>
            <button className="dashboard-buttons" onClick={() => {setButtonClicked(false);}}>Back</button>
        </div>
        </> ) : (widthdrawClicked ? (
            <>
                <div className="container">
        <p class="label">How much would you like to withdraw?</p>
        <form onSubmit={handleWidthdraw}>
            <div className="withdraw-deposit-parent">
            <button className="withdraw-deposit-button" type= "button" onClick= {add}>+</button>
                <p className="withdraw-deposit">{amount}</p>
                <button className="withdraw-deposit-button" type= "button" onClick = {subtract}>-</button>
            </div>
            <button className="withdraw-deposit-button">Withdraw</button>
        <p style={{fontSize: "2vw"}}>Note: You cannot withdraw an amount higher than your current balance ({user.balance})</p>
        </form>
            <br />
            <button className="dashboard-buttons" onClick={() => {setDepositClicked(true); setButtonClicked(true); setWidthdrawClicked(false)}}>Deposit Funds</button>
            <button className="dashboard-buttons" onClick={() => {setTransferClicked(true); setButtonClicked(true); setWidthdrawClicked(false);}}>Transfer Funds</button>
            <button className="dashboard-buttons" onClick={() => {setButtonClicked(false);}}>Back</button>
        </div>
            </>) : ( transferClicked ? (
                <>
                    <div className="container">
            <form onSubmit={handleTransfer}>
            <p className="label">How much would you like to transfer?</p>
                <div className="withdraw-deposit-parent">
                <button className="withdraw-deposit-button" type= "button" onClick= {add}>+</button>
                    <p className="withdraw-deposit">{amount}</p>
                    <button className="withdraw-deposit-button" type= "button" onClick = {subtract}>-</button>
                </div>
                <div className="widthdraw-deposit-parent">
                    <p className="label">Transfer to:</p>
                    <input
                        type="text"
                        id="transfer-username"
                        className="inputs"
                        onChange= {(e) => setTransferUser(e.target.value)}/>
                </div>
                
                <button className="withdraw-deposit-button">Transfer</button>
            <p style={{fontSize: "2vw"}}>Note: You cannot transfer an amount higher than your current balance ({user.balance})</p>
            </form>
                <br />
                <button className="dashboard-buttons" onClick={() => {setWidthdrawClicked(true); setButtonClicked(true);}}>Widthdraw Funds</button>
                <button className="dashboard-buttons" onClick={() => {setDepositClicked(true); setButtonClicked(true);}}>Deposit Funds</button>
                <button className="dashboard-buttons" onClick={() => {setButtonClicked(false);}}>Back</button>
            </div>
                </>) : (
                    <>
                    <p>Something went wrong</p>
                    </> ) 
            )
        )
    )));
}


ReactDOM.render(<App />, document.getElementById('app'));
