import Link from "next/link";
import renderHTML from "react-render-html";
import { API } from "../../config";
import moment from "moment";

const Card = ({ blog }) => {
  const showCategories = (blog) => {
    return blog.categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showTags = (blog) => {
    return blog.tags.map((tag, index) => (
      <Link key={index} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-info mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a style={{ color: "black", textDecoration: "none" }}>
            <h2
              className="pt-3 pb-3 font-weight-bold"
              style={{ cursor: "pointer" }}
            >
              {blog.title}
            </h2>
          </a>
        </Link>
      </header>
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Written by{" "}
          <a
            href={`/profile/${blog.postedBy.username}`}
            style={{ textDecoration: "none" }}
          >
            {blog.postedBy.name}
          </a>{" "}
          | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showCategories(blog)}
        {showTags(blog)}
        <br />
        <br />
      </section>
      <div className="row">
        <div className="col-md-4">
          <section>
            <img
              className="img img-fluid"
              style={{ maxHeight: "150px", width: "auto" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </section>
        </div>
        <div className="col-md-8">
          <section>
            <div className="pb-3">{renderHTML(blog.excerpt)}</div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read More</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Card;
