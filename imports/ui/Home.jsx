import React, { useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, Box } from "@mui/material";
import { Welcome } from "./Welcome";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "./UserProvider";

export const Home = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?._id) navigate("/login");
  }, [user?._id]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container>
        <Welcome />
      </Container>
    </Box>
  );
};
