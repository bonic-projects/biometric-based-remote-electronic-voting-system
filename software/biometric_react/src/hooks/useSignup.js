import { useState, useEffect } from "react";
import { auth, db, timestamp } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import {
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async ({ name, phone, department, year, institution }) => {
    setError(null);
    setIsPending(true);

    console.log(name, phone, department, year, institution);

    try {
      // signup
      const res = await signInWithPopup(auth, provider);

      if (!res || !res.user) {
        if (!isCancelled) {
          setIsPending(false);
          setError("Login failed");
        }
        throw new Error("Could not complete login");
      }

      // user firestore reference
      const ref = doc(db, "users", res.user.uid);

      // console.log("checking if user exists");

      // check is already registered
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        const user = docSnap.data();
        if (user.institutionId) {
          // if (!isCancelled) {
          setIsPending(false);
          setError("Already registered, Loging in...");
          // }
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await dispatch({ type: "LOGIN", payload: res.user });
          throw new Error("Already registered");
        }
      }

      // upload user thumbnail
      // const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
      // const img = await projectStorage.ref(uploadPath).put(thumbnail);
      // const imgUrl = await img.ref.getDownloadURL();

      // add display AND PHOTO_URL name to user
      // await res.user.updateProfile({ displayName: name, photoURL: imgUrl });
      await updateProfile(res.user, { displayName: name });

      // create a user document
      await setDoc(
        ref,
        {
          name,
          phone,
          uid: res.user.uid,
          email: res.user.email,
          photoURL: res.user.photoURL,
          institutionId: institution.id,
          institutionName: institution.name,
          // type: type,
          // regNo: regNo,
          department: department,
          year: year,
          isVerified: false,
          isMember: false,
          joinedOn: timestamp.fromDate(new Date()),
        },
        { merge: true }
      );

      // increment member count for the institution
      const institutionRef = doc(db, "institutions", institution.id);
      await updateDoc(institutionRef, {
        memberCount: increment(1),
      });

      // // increment reg count for the event
      // const eventRef = doc(db, "events", "X4q3MoIFbmuSQvTioqK0");
      // await updateDoc(eventRef, {
      //   regCount: increment(1),
      // });

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
        console.log(err.message);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
