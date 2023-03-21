import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const useCollection = (c, _query, _query2, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const q = useRef(_query).current;
  const q2 = useRef(_query2).current;

  const oB = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(db, c);

    if (q) {
      if (q2) {
        ref = query(ref, where(...q), where(...q2));
      } else {
        ref = query(ref, where(...q));
      }
    }
    if (oB) {
      ref = query(ref, orderBy(...oB));
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push(doc.data());
        });

        // update state
        setDocuments(results);

        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, q, q2, oB]);

  return { documents, error };
};
