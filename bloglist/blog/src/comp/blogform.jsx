import { useState } from "react";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  width: 300px;
`;

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <Container>
      <h2>Create new blog</h2>
      <Form onSubmit={addBlog}>
        <TextField
          label="Title"
          type="text"
          size="small"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="title"
          fullWidth
        />

        <TextField
          label="Author"
          type="text"
          size="small"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="author"
          fullWidth
        />

        <TextField
          label="URL"
          type="text"
          size="small"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="url"
          fullWidth
        />

        <Button type="submit" variant="contained" color="primary" size="small">
          create
        </Button>
      </Form>
    </Container>
  );
};

export default BlogForm;
