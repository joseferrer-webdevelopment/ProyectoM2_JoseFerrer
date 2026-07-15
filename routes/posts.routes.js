const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');
const validatePost = require('../middlewares/validatePost');
const { validatePositiveId } = require('../middlewares/validateParams');

router.get('/', postsController.getAllPosts);
router.get('/author/:authorId', validatePositiveId('authorId'), postsController.getPostsByAuthorId);
router.get('/:id', validatePositiveId('id'), postsController.getAllPostsById);
router.post('/', validatePost, postsController.createPost);
router.put('/:id', validatePositiveId('id'), validatePost, postsController.updatePosts);
router.delete('/:id', validatePositiveId('id'), postsController.deletePostById);

module.exports = router;
