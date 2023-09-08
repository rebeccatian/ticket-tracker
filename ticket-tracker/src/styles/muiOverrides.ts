import { createTheme } from "@mui/material/styles";

export default function theme() { 
return createTheme({
    components: {
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "white"
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: "white"
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: "white"
          },
        },
      },
    },
  });
}