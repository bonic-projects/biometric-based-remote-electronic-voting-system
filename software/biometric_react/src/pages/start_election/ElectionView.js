import { useState, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import UserVerification from "../../components/userVerification/UserVerification";

const ElectionList = () => {
    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);
  
    const setUserVerified = (authUser, user) => {
      setUser(user);
      setAuthUser(authUser);
    };

  const [elections, setElections] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'elections'), (snapshot) => {
      setElections(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsub;
  }, []);

  const handleDeleteElection = async (id) => {
    try {
      await deleteDoc(doc(db, 'elections', id));
    } catch (error) {
      console.error('Error deleting elections document: ', error);
    }
  };

  return (
    <UserVerification onUser={setUserVerified}>
      {elections.map((booth) => (
        <Card key={booth.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              {booth.electionName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booth.electionDetails}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booth.candidates[0]} : {booth.vot1 ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booth.candidates[1]} : {booth.vot2 ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booth.candidates[2]} : {booth.vot3 ?? 0}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
            variant="contained"
            size="small" onClick={() => handleDeleteElection(booth.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </UserVerification>
  );
};

export default ElectionList;
