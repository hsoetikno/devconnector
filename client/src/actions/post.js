import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './types'

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts')
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Like post
export const likePost = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`)
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Unlike post
export const unlikePost = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`)
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`)
    dispatch({
      type: DELETE_POST,
      payload: id
    })

    dispatch(setAlert('Post removed', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Add post
export const addPost = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/posts', formData, config)
    dispatch({
      type: ADD_POST,
      payload: res.data
    })

    dispatch(setAlert('Post created', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Get post
export const getPost = id => async dispatch => {
  try {
    const res = await axios.get(`/api/posts/${id}`)
    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  try {
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }

    const res = await axios.post(`/api/posts/${postId}/comment`, formData)
    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    })

    dispatch(setAlert('Comment added', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}/comment/${commentId}`)
    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    })

    dispatch(setAlert('Comment removed', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}
