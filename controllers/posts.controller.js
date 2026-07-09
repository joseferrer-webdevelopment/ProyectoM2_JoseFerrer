const postsService = require("../services/posts.service");

async function getAllPosts(req, res) {
  try {
    const posts = await postsService.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPostsById(req, res) {
  try {
    const { id } = req.params;
    const post = await postsService.getAllPostsById(id);

    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado'});
    }

    res.json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPostsByAuthorId( req, res) {
  try {
    const { authorId } = req.params;
    const posts = await postsService.getPostsByAuthorId(authorId);

    res.json(posts)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


module.exports = {getAllPosts, getAllPostsById, getPostsByAuthorId}
