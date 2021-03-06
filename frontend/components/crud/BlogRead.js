import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { listBlogs, removeBlog } from "../../actions/blog";
import moment from "moment";
import swal from "sweetalert";

const BlogRead = ({username}) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    listBlogs(username).then((data) => {
      console.log(data)
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const deleteConfirm = (slug) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this blog!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteBlog(slug);
        swal("Poof! Your blog has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your blog is safe!");
      }
    });
  };

  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <a href={`/user/crud/${blog.slug}`} style={{ textDecoration: "none" }}>
          <a className="btn btn-sm btn-warning ml-2">Update</a>
        </a>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <a href={`/admin/crud/${blog.slug}`} style={{ textDecoration: "none" }}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </a>
      );
    }
  };

  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <div key={index} className="pb-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            Written by {blog.postedBy.name} | {moment(blog.updatedAt).fromNow()}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            Delete
          </button>
          {showUpdateButton(blog)}
        </div>
      );
    });
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">{showAllBlogs()}</div>
      </div>
    </React.Fragment>
  );
};

export default BlogRead;
