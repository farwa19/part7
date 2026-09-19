const config = require("./utils/config");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// --- ROUTERS & MODELS ---
// Double check: if your login file is named 'login.js', change './controllers/log' to './controllers/login'
const loginRouter = require("./controllers/log");
const usersRouter = require("./users");
const Blog = require("./models/model");
const User = require("./models/user");

const app = express();

// --- 1. GLOBAL MIDDLEWARE (Must come before routes!) ---
app.use(cors());
app.use(express.json()); // ✅ MOVED UP: Now your login router can read request.body!

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (decodedToken.id) {
      request.user = await User.findById(decodedToken.id);
    }
  }
  next();
};

app.use(tokenExtractor);
app.use(userExtractor);

// --- 2. DATABASE ---
const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 });

// --- 3. ROUTERS ---
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

// --- 4. DIRECT ROUTES ---
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

app.get("/api/blogs/:id", async (request, response) => {
  const note = await Blog.findById(request.params.id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post("/api/blogs", userExtractor, async (request, response) => {
  const body = request.body;
  if (!body.author)
    return response.status(400).json({ error: "author is missing" });
  if (!body.url) return response.status(400).json({ error: "url is missing" });
  if (!body.title)
    return response.status(400).json({ error: "title is missing" });

  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "userId missing or not valid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0,
  });

  const result = await blog.save();
  user.blog.push(result._id);
  await user.save();

  response.status(201).json(result);
});

app.delete("/api/blogs/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  const user = request.user;
  if (!user) {
    return response.status(400).json({ error: "user missing or not valid" });
  }

  if (blog.user && blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id);
    return response.status(204).end();
  } else {
    return response
      .status(401)
      .json({ error: "only the creator can delete a blog" });
  }
});

app.put("/api/blogs/:id", async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate("user", { username: 1, name: 1 });

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

if (process.env.NODE_ENV === "test") {
  app.post("/api/testing/reset", async (request, response) => {
    await Promise.all([Blog.deleteMany({}), User.deleteMany({})]);
    response.status(204).end();
  });
}

app.post("/api/blogs/:id/comments", async (request, response) => {
  const { comment } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: "blog not found" })
  }

  blog.comments = blog.comments.concat(comment)

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})
app.use((request, response, next) => {
  if (request.method === "GET" && !request.path.startsWith("/api")) {
    response.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    next();
  }
});
// --- 5. ERROR HANDLER (Must be at the very bottom!) ---
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }
  next(error);
};

app.use(errorHandler);

// --- 6. EXPORT ---
module.exports = app;
