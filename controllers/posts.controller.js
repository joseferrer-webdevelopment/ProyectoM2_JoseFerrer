const postsService = require("../services/posts.service");
const authorsService = require('../services/authors.service');

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

async function createPost(req, res) {
  try {
    const { authorId, title, content, published } = req.body;

    const authorExists = await authorsService.getAuthorById(authorId);
    if (!authorExists) {
      return res.status(404).json({ error: 'El author especificado no existe' });
    }

    const newPost = await postsService.createPost(authorId, title, content, published);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 

async function updatePosts(req, res) {
  try {
    const { id } = req.params
    const { title, content, published} = req.body

    const updatePosts = await postsService.updatePosts ( id, title, content, published);
    
    res.status(200).json(updatePosts);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
}


module.exports = {getAllPosts, getAllPostsById, getPostsByAuthorId, createPost, updatePosts}
