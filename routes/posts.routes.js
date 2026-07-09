const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller')

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getAllPostsById);
router.get('/author/:authorId', postsController.getPostsByAuthorId);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePosts);
router.delete('/:id', postsController.deletePostById);


module.exports = router