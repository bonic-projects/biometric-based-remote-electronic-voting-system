import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export const useDocument = (c, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime document data
  useEffect(() => {
    if (id) {
      const ref = doc(db, c, id);
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          // need to make sure the doc exists & has data
          if (snapshot.data()) {
            setDocument({ ...snapshot.data(), id: snapshot.id });
            setError(null);
          } else {
            setError("No such document exists");
          }
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

  return { document, error };
};
