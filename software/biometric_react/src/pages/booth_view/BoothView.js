import { useState, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import UserVerification from "../../components/userVerification/UserVerification";

const BoothList = () => {
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);
  
    const setUserVerified = (authUser, user) => {
      setUser(user);
      setAuthUser(authUser);
    };

  const [booths, setBooths] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'booths'), (snapshot) => {
      setBooths(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  const handleDeleteBooth = async (id) => {
    try {
      await deleteDoc(doc(db, 'booths', id));
    } catch (error) {
      console.error('Error deleting booth document: ', error);
    }
  };

  return (
    <UserVerification onUser={setUserVerified}>
      {booths.map((booth) => (
        <Card key={booth.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {booth.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booth.place}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
            variant="contained"
            size="small" onClick={() => handleDeleteBooth(booth.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </UserVerification>
  );
};

export default BoothList;
