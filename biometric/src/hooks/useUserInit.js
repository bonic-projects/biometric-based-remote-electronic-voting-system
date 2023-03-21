import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export const useUserInit = (authUser) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userHostel, setUserHostel] = useState({});
  const [isUserDeclined, setIsUserDeclined] = useState(false);
  const [isPendingRequest, setIsPendingRequest] = useState(false);
  const [error, setError] = useState(null);

  // realtime document data
  useEffect(() => {
    if (authUser) {
      setIsLoading(true);
      const ref = doc(db, "users", authUser.uid);
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setUser({ ...snapshot.data() });
            setError(null);

            console.log(user);

            // user  validation and taking userHostel
            if (user.hostels) {
              for (var id in user.hostels) {
                if (user.hostels[id].isInmate && !user.hostels[id].isVerified) {
                  setError("Hostel request is pending.");
                  setIsPendingRequest(true);
                  setUserHostel(user.hostels[id]);
                } else if (user.hostels[id].isInmate === false) {
                  setError("Hostel request is declined.");
                  setIsUserDeclined(true);
                  setUserHostel(user.hostels[id]);
                } else if (user.hostels[id].isVerified) {
                  setError(null);
                  setIsPendingRequest(false);
                  setIsUserDeclined(false);
                  setUserHostel({ id: id, ...user.hostels[id] });
                }
              }
            } else {
              setError("Not registered as hostelo inmate.");
            }
          } else {
            setError("Not registered yet");
          }
          setIsLoading(false);
        },
        (err) => {
          console.log(err.message);
          setError("Failed to get document");
        }
      );

      // unsubscribe on unmount
      return () => unsubscribe();
    } else {
      setError("Not registered yet");
    }
  }, [authUser]);

  return {
    user,
    userHostel,
    isLoading,
    isPendingRequest,
    isUserDeclined,
    error,
  };
};
