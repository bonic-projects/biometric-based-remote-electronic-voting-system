import { useEffect, useState } from "react";
import { rtdb } from "../firebase/config";
import { ref, onValue } from "firebase/database";

export const useDatabase = (c, id) => {
  const [value, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime document data
  useEffect(() => {
    if (id) {
      const rtdbRef = ref(rtdb, c + "/" + id);
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
  }, [c, id]);

  return { value, error };
};
