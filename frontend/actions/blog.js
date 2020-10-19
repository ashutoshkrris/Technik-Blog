import fetch from "isomorphic-fetch";
import { API } from "../config";

// Create new blog
export const createBlog = (blog, token) => {
  return fetch(`${API}/blog/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
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
export const listBlogs = () => {
  return fetch(`${API}/blog/posts`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Remove blog
export const removeBlog = (slug, token) => {
  return fetch(`${API}/blog/post/${slug}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Update blog
export const updateBlog = (blog, token, slug) => {
  console.log(slug,token,blog)
  return fetch(`${API}/blog/post/${slug}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: blog,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
