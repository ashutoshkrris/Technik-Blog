import Head from "next/head";
import Link from "next/link";
import { withRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState } from "react";
import { getBlogs } from "../../actions/blog";
import Card from "../../components/blog/Card";
import { API, DOMAIN, APP_NAME, FB_ID } from "../../config";

const Blogs = ({
  blogs,
  categories,
  tags,
  totalBlogs,
  blogLimit,
  blogSkip,
  router,
}) => {
  const head = () => {
    return (
      <Head>
        <title>Blogs | {APP_NAME}</title>
        <meta
          name="description"
          content="Blogs related to Programming and Technology"
        />
        <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
        <meta property="og:title" content={`Technik Blogs | ${APP_NAME}`} />
        <meta
          property="og:description"
          content="Blogs related to Programming and Technology"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta property="og:image" content={`${DOMAIN}/static/images/seo.jpg`} />
        <meta
          property="og:image:secure_url"
          content={`${DOMAIN}/static/images/seo.jpg`}
        />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="fb:app_id" content={`${FB_ID}`} />
      </Head>
    );
  };

  const [ limit, setLimit ] = useState(blogLimit);
  const [ skip, setSkip ] = useState(0);
  const [ size, setSize ] = useState(totalBlogs);
  const [ loadedBlogs, setLoadedBlogs ] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    getBlogs(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-info btn-lg">
          Load More
        </button>
      )
    );
  };

  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  const showAllCategories = () => {
    return categories.map((category, index) => (
      <Link href={`/categories/${category.slug}`} key={index}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));
  };

  const showAllTags = () => {
    return tags.map((tag, index) => (
      <Link href={`/tags/${tag.slug}`} key={index}>
        <a className="btn btn-outline-info mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, index) => (
      <article key={index}>
        <Card blog={blog} />
      </article>
    ));
  };

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Technik Blogs
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 5;

  return getBlogs(skip, limit).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogLimit: limit,
        blogSkip: skip,
      };
    }
  });
};

export default withRouter(Blogs);
