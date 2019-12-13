const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   POST api/posts
// @desc    Add a new post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).send()
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      })

      const post = await newPost.save()
      res.json(post)
    } catch (e) {
      console.error(e.message)
      res.status(500).send()
    }
  }
)

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).send()
    }

    res.json(post)
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

// @route   DELETE api/posts
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).send()
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).send()
    }

    await post.remove()

    res.json()
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).send()
    }

    post.likes.unshift({ user: req.user.id })
    await post.save()

    res.json(post.likes)
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).send()
    }

    post.likes = post.likes.filter(like => like.user.toString() !== req.user.id)
    await post.save()

    res.json(post.likes)
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

// @route   POST api/posts/:id/comment/
// @desc    Comment on a post
// @access  Private
router.post(
  '/:id/comment/',
  [
    auth,
    [
      check('text', 'text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).send(errors)
    }

    try {
      const post = await Post.findById(req.params.id)
      const user = await User.findById(req.user.id).select('-password')

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      post.comments.push(newComment)
      await post.save()
      res.json(post.comments)
    } catch (e) {
      console.error(e.message)
      res.status(500).send()
    }
  }
)

// @delete  DELETE api/posts/:post_id/comment/:comment_id
// @desc    Delete a comment on a post
// @access  Private
router.delete('/:post_id/comment/:comment_id/', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    if (!post) {
      return res.status(404).send()
    }

    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    )

    if (!comment) {
      return res.status(404).send()
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).send()
    }

    post.comments.remove(comment)

    await post.save()
    res.json(post.comments)
  } catch (e) {
    console.error(e.message)
    res.status(500).send()
  }
})

module.exports = router
