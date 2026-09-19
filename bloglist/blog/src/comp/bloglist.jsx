import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import blog from "./blog";
import { Notification } from "./notification";
import { LoginForm } from "./LoginForm";
import BlogForm from "./blogform";
import Togglable from "./toggle";
import loginService from "../service/login";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import blogService from "../service/blog";
import persistentUser from "../service/persistentUser";

const BlogList = ({ blogs }) => {
  const location = useLocation();
  const stateBlogs = location.state?.blogs;
  const selectedUser = location.state?.userName;
  const visibleBlogs = Array.isArray(stateBlogs) ? stateBlogs : blogs ?? [];
  const pageTitle = Array.isArray(stateBlogs) ? selectedUser || "User" : "bLOGS";

  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = persistentUser.getUser();
    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogsToShow = showAll ? blogs : blogs.filter((blog) => blog.important);

  if (Array.isArray(stateBlogs)) {
    return (
      <div>
        <h2>{pageTitle}</h2>
        <h3>added blogs</h3>
        <ul>
          {visibleBlogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2>{pageTitle}</h2>
      <Notification message={errorMessage} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>
                  {blog.user ? blog.user.username : "unknown"}
                </TableCell>
                <TableCell>{blog.important ? "yes" : "no"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogList;
