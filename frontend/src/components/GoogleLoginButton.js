import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const API = process.env.REACT_APP_API_URL;

function GoogleLoginButton({ onSuccess }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = user.token;


      const res = await fetch(`${API}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();

      if (data.provider === "google") {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        onSuccess(userData);

        if (!data.hasPassword) {
  toast.info("You can create a password for email login under Profile.");
}

      }
    } catch (err) {
      console.error("Google sign-in error", err);
    }
  };

  return (
    <button onClick={handleLogin} className="btn btn-google">
      Sign in with Google
    </button>
  );
}

export default GoogleLoginButton;
