// ✅ FINAL: AuthContext.js (Only Google OAuth + Email/Password)
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          photoURL: firebaseUser.photoURL || "",
          token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("userToken", token);
        sessionStorage.setItem("userEmail", firebaseUser.email);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("userToken");
        sessionStorage.removeItem("userEmail");
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
