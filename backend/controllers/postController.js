const data = `${__dirname}/data.json`;
const fs = require("fs-extra");
const path = require("path");
const getAllPosts = async (req, res) => {
  fs.readFile(data, "utf8", (error, data) => {
    if (error) {
      console.error("Error reading data.json:", error);
      res.status(500).send("Server error");
    } else {
      res.json(JSON.parse(data));
    }
  });
};

// create the post

const createPost = async (req, res) => {
  const dataPath = path.join(__dirname, "data.json");

  try {
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const posts = JSON.parse(jsonData);
    const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      body: req.body.body,
    };

    posts.unshift(newPost);

    fs.writeFileSync(dataPath, JSON.stringify(posts));

    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error writing data" });
  }
};

const updatePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const dataPath = path.join(__dirname, "data.json");

  try {
    // Read the existing data from the JSON file
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const posts = JSON.parse(jsonData);

    // Find the post to update
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Update the post with new values
    post.title = req.body.title;
    post.body = req.body.body;

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(posts));

    // Send the updated post as the response
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error writing data" });
  }
};

// delete the post

const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const dataPath = path.join(__dirname, "data.json");

  try {
    // Read the existing data from the JSON file
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const posts = JSON.parse(jsonData);

    // Find the index of the post to delete
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    // Remove the post from the array
    const deletedPost = posts.splice(index, 1)[0];

    // Write the updated data back to the JSON file
    fs.writeFileSync(dataPath, JSON.stringify(posts));

    // Send the deleted post as the response
    res.json(deletedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error writing data" });
  }
};

module.exports = {
  createPost,
  updatePost,
  getAllPosts,
  deletePost,
};
