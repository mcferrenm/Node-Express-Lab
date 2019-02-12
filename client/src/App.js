import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const BASE_URL = "http://localhost:4000"

class App extends Component {
  state = {
    posts: [],
    postInputs: {
      title: '',
      contents: ''
    },
    isLoading: false,
    error: ''
  }

  componentDidMount() {
    try {
      this.getPosts('?sortby=id');
    } catch (error) {
      this.setState({
        error
      })
    }
  }


  getPosts = async query => {
    this.setState({
      isLoading: true
    })
    try {
      const { data: posts } = await axios.get(`${BASE_URL}/api/posts${query}`)
      this.setState({
        posts,
        isLoading: false
      })
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      })
    }
  }

  handleChange = e => {
    e.persist();
    this.setState(prevState => ({
      postInputs: {
        ...prevState.postInputs,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleAddPost = async () => {
    const { postInputs } = this.state;
    try {
      const { data: post } = await axios.post(`${BASE_URL}/api/posts`, postInputs)
      this.setState(prevState => ({
        posts: [...prevState.posts, post[0]],
      }))
    } catch (error) {
      this.setState({
        error
      })
    }
  }

  handleDeletePost = async (id) => {
    try {
      const { data: deletedPost } = await axios.delete(`${BASE_URL}/api/posts/${id}`)
      const posts = this.state.posts.filter(post => post.id !== deletedPost.id)
      this.setState(() => ({
        posts
      }))

    } catch (error) {
      this.setState({
        error,
        isLoading: false
      })
    }
  }

  handleSortPosts = e => {
    e.preventDefault();
    const query = e.target.name === "name" ? "?sortby=title" : "?sortby=id"
    this.getPosts(query)
  }

  render() {
    const { isLoading, error, postInputs: { title, contents } } = this.state;
    if (isLoading) {
      return <p>Loading...</p>
    }
    if (error) {
      return <p>{error.message}</p>
    }

    return (
      <div className="App">
        <div className="form">
          <input onChange={this.handleChange} type="text" name="title" value={title} />
          <input onChange={this.handleChange} type="text" name="contents" value={contents} />
          <button onClick={this.handleAddPost}>Add post</button>
          <button onClick={this.handleSortPosts} name="name">Sort by name</button>
          <button onClick={this.handleSortPosts} name="id">Sort by id</button>
        </div>
        {this.state.posts.map(({ title, contents, id }) =>
          <div className="post-item" key={id} onClick={() => this.handleDeletePost(id)}>
            <p>Title: {title}</p>
            <p>Contents: {contents}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
