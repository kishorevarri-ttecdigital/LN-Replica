import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export const useLogout = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const logout = async () => {
    try {
        await signOut(auth);
        dispatch({ type: "LOGOUT", payload: null });
        console.log('Signed Out');
        navigate("/");
    } catch (error) {
        console.error('Sign Out Error', error);
        // Optionally dispatch an error to your context or show a user-friendly message.
    }
    };

    return logout;
};
