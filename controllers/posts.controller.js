const postsService = require('../services/posts.service');
const authorsService = require('../services/authors.service');

async function getAllPosts(req, res, next) {
  try {
    const posts = await postsService.getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function getAllPostsById(req, res, next) {
  try {
    const post = await postsService.getAllPostsById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function getPostsByAuthorId(req, res, next) {
  try {
    const posts = await postsService.getPostsByAuthorId(req.params.authorId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const { authorId, title, content, published } = req.body;
    const authorExists = await authorsService.getAuthorById(authorId);

    if (!authorExists) {
      return res.status(404).json({ error: 'El author especificado no existe' });
    }

    const newPost = await postsService.createPost(authorId, title, content, published);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
}

async function updatePosts(req, res, next) {
  try {
    const { title, content, published } = req.body;
    const updatedPost = await postsService.updatePosts(req.params.id, title, content, published);

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
}

async function deletePostById(req, res, next) {
  try {
    const post = await postsService.deletePostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPosts,
  getAllPostsById,
  getPostsByAuthorId,
  createPost,
  updatePosts,
  deletePostById
};
