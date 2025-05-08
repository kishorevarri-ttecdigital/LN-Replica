import { useContext, useState } from "react";
import "./Login.css";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx"

const Login = () => {  

    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("")

    const navitage = useNavigate()
  
    const {dispatch} = useContext(AuthContext)    
    
    const signOutHandler = (e) => {
      e.preventDefault();
      signOut(auth).then(function() {
        dispatch({type:"LOGOUT", payload:null})
        // console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    };

    const user = localStorage.getItem('user')

    const handleLogin = (e) => {
      e.preventDefault();

        // Simple form validation
        if (!email || !password) {
            setError(true);
            setErrorMessage('Please fill in all fields.')
            return;
        }  

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          dispatch({type:"LOGIN", payload:user})
          navitage("/")
        })
        .catch((error) => {
          setError(true);
          setErrorMessage('Invalid Email or Password');
        });
    };
  
    return (
      <div className= 'login-page'>        
        <h2>Please Login</h2>
        <form className="login-form">
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button id="login-btn" type="submit" onClick={handleLogin}>Login</button>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </form>
      </div>
    );
  };
  
  export default Login;


