import { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

// Google auth proivider
const provider = new GoogleAuthProvider();

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async () => {
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await signInWithPopup(auth, provider);

      if (!res || !res.user) {
        if (!isCancelled) {
          setIsPending(false);
          setError("Login failed");
        }
        throw new Error("Could not complete login");
      }

      // update online status
      // const documentRef = projectFirestore
      //   .collection("users")
      //   .doc(res.user.uid);
      // await documentRef.update({ online: true });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
};
