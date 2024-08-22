import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useCollection } from "../hooks/useCollection";

export default function HostelSelector({ selection }) {
  const [institution, setInstitution] = useState(null);

  const selectInstituion = (value) => {
    setInstitution(value);
  };

  const next = () => {
    selection(institution);
  };

  return (
    <>
      <Box>
        <Selector
          collection="institutions"
          title="Select your institution"
          subTitle="Select your institution from the below list."
          selection={selectInstituion}
        />

        <Box
          display="flex"
          sx={{
            paddingTop: "2rem",
          }}
        >
          <Button
            variant="contained"
            sx={{
              display: "block",
              margin: "0 auto",
              //   marginTop: "20px",
              marginBottom: "20px",
            }}
            onClick={next}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  );
}

function Selector({ collection, title, subTitle, selection, id }) {
  const [item, setItem] = useState(null);
  let query = id ? ["institutionId", "==", id] : null;
  // let query2 = id ? ["isApproved", "==", true] : null;//todo uncomment and add to bellow line
  const { error, documents: items } = useCollection(collection, query);

  useEffect(() => {
    if (items && items.length > 0) {
      selection(items[0]);
    }
  }, [items, selection]);

  const selectItem = (e) => {
    setItem(e.target.value);
    selection(e.target.value);
  };

  return (
    <>
      <Typography
        color="text.primary"
        variant="h5"
        component="h1"
        textAlign={["center"]}
      >
        {title}
      </Typography>
      <Typography
        color="text.primary"
        variant="p"
        component="p"
        textAlign={["center"]}
        sx={{
          maxWidth: "500px",
          paddingBottom: "2rem",
        }}
      >
        {subTitle}
      </Typography>
      {!items && !error && (
        <Typography color="text.primary" textAlign={["center"]}>
          Loading...
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {items && (
        <SelectItem
          id={collection}
          item={item ?? items[0]}
          items={items}
          selectItem={selectItem}
        />
      )}
    </>
  );
}

function SelectItem({ id, items, item, selectItem }) {
  return (
    <>
      {id === "institutions" && (
        <Box
          component="img"
          alt={item.name}
          src={id === "hostels" ? item.logoImg : item.logoUrl}
          maxHeight="90px"
          sx={{
            display: "block",
            margin: "0 auto",
            borderRadius: "100px",
            // paddingBottom: "1rem",
          }}
        />
      )}
      <Box height="20px" />
      <TextField
        id={id}
        select
        label={id === "hostels" ? "Hostel" : "Institution"}
        value={item}
        onChange={selectItem}
        // helperText="Please select your currency"
        sx={{
          minWidth: "80px",
          maxWidth: "100%",
          display: "flex",
          margin: "0 auto",
          paddingBottom: "0.5rem",
          "&:before": {
            borderColor: "white",
          },
          "&:after": {
            borderColor: "white",
          },
        }}
      >
        {items.map((option) => (
          <MenuItem
            key={option.name}
            value={option}
            sx={{
              backgroundColor: "blue",
            }}
          >
            <Typography variant="p" color="text.primary">
              {option.name}
            </Typography>
          </MenuItem>
        ))}
      </TextField>
      <Typography
        variant="p"
        component="p"
        color="text.primary"
        textAlign={["center"]}
        sx={{
          maxWidth: "500px",
        }}
      >
        {id === "hostels"
          ? `${Object.values(item.hostelAdmins)[0].designation}: ${
              Object.values(item.hostelAdmins)[0].name
            }`
          : item.address}
      </Typography>
    </>
  );
}
