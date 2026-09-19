import { TextField, Button } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1em;
  padding: 1em;
  background: #f0f0f0;
  margin-bottom: 2em;
  width: 100%;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 300px; /* Makes the form narrower */
`;

export const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <Container>
      <h2>Login</h2>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          type="text"
          size="small" // Makes the input field smaller and more compact
          value={username}
          onChange={handleUsernameChange}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          size="small"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" size="small">
          login
        </Button>
      </Form>
    </Container>
  );
};
