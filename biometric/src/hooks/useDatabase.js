import { useEffect, useState } from "react";
import { rtdb } from "../firebase/config";
import { ref, onValue } from "firebase/database";

export const useDatabase = (c) => {
  const [value, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime document data
  useEffect(() => {
    if (c) {
      const rtdbRef = ref(rtdb, c);
      console.log(rtdbRef);
      const unsubscribe = onValue(
        rtdbRef,
        (snapshot) => {
          setDocument({ ...snapshot.val() });
          setError(null);
        },
        (err) => {
          console.log(err.message);
          setError("Failed to get document");
        }
      );

      // unsubscribe on unmount
      return () => unsubscribe();
    } else {
      setError("No id");
    }
  }, [c]);

  return { value, error };
};
