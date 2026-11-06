const express = require('express');
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  listPosts,
} = require('../controllers/postsController');

const router = express.Router();

router.post('/', createPost);
router.get('/', listPosts);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
