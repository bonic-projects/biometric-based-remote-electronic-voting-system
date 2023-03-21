import {
  Box,
  InputAdornment,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

const years = [
  { id: 1, title: "1st year" },
  { id: 2, title: "2nd year" },
  { id: 3, title: "3rd year" },
  { id: 4, title: "4th year" },
];

export default function UserForm({ back, onSubmit, buttonText, user }) {
  const [name, setName] = useState(user ? user.name : "");
  const [nameError, setNameError] = useState(false);
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [phoneError, setPhoneError] = useState(false);
  const [department, setDepartment] = useState(user ? user.department : "");
  const [departmentError, setDepartmentError] = useState(false);
  const [year, setYear] = useState(
    user ? years.find((year) => year.id === user.year) : years[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(false);
    setPhoneError(false);
    setDepartmentError(false);
    if (name.length < 3) {
      setNameError(true);
      return;
    }
    if (phone.length < 10) {
      setPhoneError(true);
      return;
    }
    if (department.length < 2) {
      setDepartmentError(true);
      return;
    }

    onSubmit({ name, phone, department, year: year.id });
  };

  return (
    <Box
      component="form"
      sx={{
        maxWidth: "100vw",
        // onSubmit: handleSubmit,
        "& .MuiTextField-root": {
          display: "flex",
          margin: "0 auto",
          paddingBottom: 1,
          paddingRight: 1,
          //   p: 1,
        },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        id="name"
        label="Name"
        type="text"
        helperText={"Your official name as registered in the university"}
        value={name}
        error={nameError}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        required
        // fullWidth
        id="phone"
        label="Phone"
        type="tel"
        InputProps={{
          startAdornment: <InputAdornment position="start">+91</InputAdornment>,
        }}
        value={phone}
        error={phoneError}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Box
        sx={{
          display: "flex",
        }}
      >
        <TextField
          required
          fullWidth
          id="department"
          label="Department"
          type="text"
          helperText="eg: ECE"
          value={department}
          error={departmentError}
          onChange={(e) => setDepartment(e.target.value)}
        />
        <TextField
          id="year"
          fullWidth
          select
          label="Year of study"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          // helperText="Please select your currency"
          sx={{ minWidth: "100px" }}
        >
          {years.map((option) => (
            <MenuItem key={option.id} value={option}>
              {option.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        display="flex"
        sx={{
          paddingTop: "2rem",
        }}
      >
        {back && (
          <Button
            variant="contained"
            sx={{
              // backgroundColor: "black",
              color: "white",
              "&:hover": {
                opacity: 0.8,
                backgroundColor: "black",
                color: "white",
              },
              display: "block",
              margin: "0 auto",
              //   marginTop: "20px",
              marginBottom: "20px",
            }}
            onClick={back}
          >
            Back
          </Button>
        )}
        <Button
          variant="contained"
          sx={{
            type: "submit",
            display: "block",
            margin: "0 auto",
            //   marginTop: "20px",
            marginBottom: "20px",
          }}
          onClick={handleSubmit}
        >
          {buttonText ?? "Update"}
        </Button>
      </Box>
    </Box>
  );
}
