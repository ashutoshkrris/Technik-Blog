import Link from "next/link";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";

const RelatedCard = ({ blog }) => {
  return (
    <div className="card">
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className="img img-fluid"
              style={{ maxHeight: "auto", width: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>

      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
          <p className="card-text">{renderHTML(blog.excerpt)}</p>
        </section>
      </div>

      <div className="card-body text-center">
        <div className="float-left">
          Posted by{" "}
          <Link href={`/`}>
            <a>{blog.postedBy.name}</a>
          </Link>{" "}
        </div>
        <div className="float-right">{moment(blog.updatedAt).fromNow()}</div>
      </div>
    </div>
  );
};

export default RelatedCard;
