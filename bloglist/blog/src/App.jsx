import { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Blog from "./comp/blog";
import persistentUser from "./service/persistentUser"
import { Notification } from "./comp/notification";
import { ErrorNotification } from "./comp/notification";
import { LoginForm } from "./comp/LoginForm";
import { NotificationStore, BlogStore } from "./comp/store";
import Togglable from "./comp/toggle";
import blogService from "./service/blog";
import loginService from "./service/login";
import BlogForm from "./comp/blogform";
import styled from "styled-components";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import BlogList from "./comp/bloglist";
import Usersblogs from  "./comp/Usersblogs";
import Home from "./comp/home";
import Footer from "./comp/footer";
import ErrorBoundary from "./ErrorBoundary";
const SingleBlog = ({
  blogs,
  addlike,
  removeblog,
  user,
  toggleImportanceOf,
}) => {
  const { id } = useParams();
  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) return <div>Blog not found</div>;
  if (!blog.user) throw new Error("Blog user is missing");

  return (
    <ul>
      <Blog
        blog={blog}
        updateLikes={addlike}
        removeBlog={removeblog}
        user={user}
        toggleImportanceOf={toggleImportanceOf}
      />
    </ul>
  );
};

const App = () => {
  const navigate = useNavigate();

  
  const blogs = BlogStore((state) => state.blogs)
  const setBlogs = BlogStore((state) => state.setBlogs)
  const [showAll, setShowAll] = useState(true);
  const [loginVisible, setLoginVisible] = useState(true);
  const blogFormRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setNotification = NotificationStore((state) => state.setNotification);
 
  const parsedUser=persistentUser.getUser();
    

  useEffect(() => {
  blogService.getAll().then((blogs) => {
    setBlogs(blogs)
  })
}, [])

  const handleLogout = () => {
    persistentUser.removeUser()

    setUser(null);
    blogService.setToken(null);
  };
  const addlike = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then((returnedBlog) => {
       setBlogs(
  blogs.map((blog) =>
    blog.id !== id ? blog : returnedBlog
  )
)
        setNotification('blog created successfully', 'success')
        setTimeout(() => {
          NotificationStore.getState().clearNotification();
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("error updating a blog");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };
  const toggleImportanceOf = (id) => {
    const blog = blogs.find((n) => n.id === id);
    const changedBlog = { ...blog, important: !blog.important };

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
      })
      .catch(() => {
        /*
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        */
        setBlogs(blogs.filter((n) => n.id !== id));
      });
  };
  const removeblog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        setBlogs((currentBlogs) =>
          currentBlogs.filter((blog) => blog.id !== id),
        );

        
        setNotification(`blog has  been deleted`, 'success')

        setTimeout(() => {
          NotificationStore.getState().clearNotification();
        }, 5000);
      })
      .catch((error) => {
        console.log("hgghgfhgffg");
        console.log(error);
        setErrorMessage("error deleating a blog");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);

      const blogWithUser = {
        ...returnedBlog,
        user: {
          username: user.username,
          name: user.name,
          id: returnedBlog.user,
        },
      };

      setBlogs(blogs.concat(blogWithUser));
     
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 'success')
      setTimeout(() => {
        NotificationStore.getState().clearNotification();
      }, 5000);
      navigate("/blogs");
    } catch (error) {
      console.log("THE EXACT ERROR IS:", error);
      if (error.response) {
        console.log("BACKEND SAID:", error.response.data);
      }

      setErrorMessage("error adding a blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const padding = {
    padding: 5,
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      persistentUser.saveUser(user);
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");

      setNotification(`a new user ${user.username} has signed in`, 'success')
      setErrorMessage(null);
      setTimeout(() => {
        NotificationStore.getState().clearNotification();
      }, 5000);
      navigate("/blogs");
    } catch {
      setErrorMessage("wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  console.log(blogs,typeof(blogs),"here hina")

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          \
        </div>
      </div>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            component={Link}
            to="/users"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            users
          </Button>
          <Button color="inherit">
            <Link
              to="/"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              blogs
            </Link>
          </Button>

          {!user ? (
            <Button color="inherit">
              <Link
                to="/login"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                login
              </Link>
            </Button>
          ) : (
            <>
              <Button color="inherit">
                <Link
                  to="/create"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  new blog
                </Link>
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                logout {user.name}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <div>
     

        {/* Routes block containing ONLY Route components */}
        <ErrorBoundary>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <SingleBlog
                blogs={blogs}
                addlike={addlike}
                removeblog={removeblog}
                user={user}
                toggleImportanceOf={toggleImportanceOf}
              />
            }
          />
          <Route path="/blogs" element={<BlogList blogs={blogs} />} />
          <Route path="/userblogs" element={<BlogList blogs={[]} />} />
          <Route path="/login" element={loginForm()} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route path="/users" element={<Usersblogs blogs={blogs} />} />
          <Route
            path="*"
            element={
              <h1>
                <div>Page not found</div>
              </h1>
            }
          />
        </Routes>
        </ErrorBoundary>

        <Footer />
      </div>
    </>
  );
};

export default App;
