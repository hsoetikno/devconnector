import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from '../layout/Spinner'
import { getPost } from '../../actions/post'
import PostItem from '../posts/PostItem'
import CommentForm from '../post/CommentForm'
import CommentItem from '../post/CommentItem'

const Post = ({ post: { post, loading }, getPost, match }) => {
  useEffect(() => {
    getPost(match.params.id)
  }, [getPost, match.params.id])

  return loading || post === null ? (
    <Spinner></Spinner>
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back to posts
      </Link>
      <PostItem showActions={false} post={post} />
      <CommentForm postId={post._id} />
      {post.comments.length > 0 ? (
        post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))
      ) : (
        <h4>No comments found</h4>
      )}
    </Fragment>
  )
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)
