import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BlogStore } from "./store";
import blogService from "../service/blog";
import persistentUser from "../service/persistentUser";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;
const BlogContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  max-width: 600px;
  margin: 20px auto;
`;

const BlogTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 8px;
`;

const BlogContent = styled.p`
  font-size: 1em;
  margin-bottom: 8px;
`;

const BlogAuthor = styled.p`
  font-size: 0.9em;
  color: #555;
  margin-bottom: 8px;
`;

const BlogLikes = styled.p`
  font-size: 0.9em;
  color: #751f1f;
  margin-bottom: 8px;
`;

const buttonStyle = {
  marginRight: "8px",
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const Blog = ({
  blog,
  toggleImportanceOf,
  removeBlog,
  addlike,
  updateLikes,
}) => {
  const user = persistentUser.getUser();
  const navigate = useNavigate();

  if (!blog) {
    return null;
  }
  console.log(blog)

  const label = blog.important ? "make not important" : "make important";
  const [comment, setComment] = useState("");
  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}"?`)) {
      removeBlog(blog.id);
      navigate("/blogs");
    }
  };

  const isOwner = user && blog.user && user.username === blog.user.username;

  const handleLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 };
    updateLikes(blog.id, updatedBlog);
  };
 const addcomment = async (event) => {
  event.preventDefault();

  if (!comment.trim()) {
    return;
  }

  console.log("adding comment:", comment);

  const updatedBlog = await blogService.addComment(blog.id, comment);
  blog.comments = updatedBlog.comments;

  setComment("");
};

  return (
    <BlogContainer>
      <BlogTitle>{blog.title}</BlogTitle>
      {blog.content && <BlogContent>{blog.content}</BlogContent>}
      <BlogAuthor>by {blog.author}</BlogAuthor>
      <BlogLikes>Likes: {blog.likes}</BlogLikes>
      
      {blog.user && <BlogAuthor>Added by: {blog.user.name}</BlogAuthor>}
      
      <BlogContent>
        URL:{" "}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </BlogContent>

      {user && (
        <div>
          <button
            style={buttonStyle}
            onClick={() => toggleImportanceOf(blog.id)}
          >
            {label}
          </button>
          <button style={buttonStyle} onClick={handleLike}>
            Like
          </button>
          {isOwner && (
            <button style={buttonStyle} onClick={handleDelete}>
              delete
            </button>
          )}
           <h1>Comments</h1>

<ul>
  {blog.comments?.map((comment, index) => (
    <li key={index}>{comment}</li>
  ))}
</ul>

<Form onSubmit={addcomment}>
  <TextField
    label=""
    type="text"
    size="small"
    value={comment}
    onChange={(event) => setComment(event.target.value)}
    placeholder="comment"
    fullWidth
  />

  <Button
    type="submit"
    variant="contained"
    color="primary"
    size="small"
  >
    ADD COMMENT
  </Button>
</Form>
        </div>
        
      )}
    </BlogContainer>
  );
};

export default Blog;
