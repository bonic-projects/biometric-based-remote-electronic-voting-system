import { Box } from "@mui/material";
export default function DropShadowBox({ children, padding, marginTop }) {
  return (
    <Box
      sx={{
        marginTop: marginTop ?? "10px",
        padding: padding ?? "20px",
        alignItems: "center",
        borderRadius: "20px",
        boxShadow: "0px 0px 4px rgba(255, 255, 255, 0.4)",
      }}
    >
      {children}
    </Box>
  );
}
