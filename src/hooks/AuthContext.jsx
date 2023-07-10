import { useState, useContext, useEffect, createContext} from 'react';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(false);
  
    
    // function login(email, password) {
    //     return signInWithEmailAndPassword(auth, email, password);
    // }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, 'crisostomo@ibarra.com', 'JuanRizal');
    }

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signout(){
        signOut(auth);
    }
 
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAuthUser(user);
        setLoading(false);

      });
  
      return unsubscribe;
    }, [])
  

    const value = {
        authUser,
        login,
        signup,
        signout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
