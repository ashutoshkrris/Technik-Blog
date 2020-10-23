import fetch from "isomorphic-fetch";
import { API } from "../config";
import queryString from "query-string";
import { isAuth, handleResponse } from "./auth";

// Create new blog
export const createBlog = (blog, token) => {
  let createBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndpoint = `${API}/blog/create`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndpoint = `${API}/blog/user/create`;
  }

  return fetch(`${createBlogEndpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Get all blogs with categories and tags
export const getBlogs = (skip, limit) => {
  const data = { limit, skip };
  return fetch(`${API}/blog/posts/ct`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// get single blog
export const singleBlog = (slug) => {
  return fetch(`${API}/blog/post/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Get related blogs using categories
export const getRelated = (blog) => {
  return fetch(`${API}/blog/related`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blog),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// get all blogs
export const listBlogs = (username) => {
  let listBlogEndpoint;

  if (username) {
    listBlogEndpoint = `${API}/blog/${username}/posts`;
  } else {
    listBlogEndpoint = `${API}/blog/posts`;
  }

  return fetch(`${listBlogEndpoint}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Remove blog
export const removeBlog = (slug, token) => {
  let deleteBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndpoint = `${API}/blog/post/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogEndpoint = `${API}/blog/user/post/${slug}`;
  }

  return fetch(`${deleteBlogEndpoint}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Update blog
export const updateBlog = (blog, token, slug) => {
  let updateBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndpoint = `${API}/blog/post/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndpoint = `${API}/blog/user/post/${slug}`;
  }

  console.log(slug, token, blog);
  return fetch(`${updateBlogEndpoint}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      handleResponse(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

// search blogs
export const listSearch = (params) => {
  let query = queryString.stringify(params);
  return fetch(`${API}/blog/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
