import Head from "next/head";
import Layout from "../../components/Layout";
import { singleCategory } from "../../actions/category";
import { DOMAIN, APP_NAME, FB_ID } from "../../config";
import Card from "../../components/blog/Card";

const Category = ({ category, blogs, query }) => {
  const head = () => {
    return (
      <Head>
        <title>
          {category.name} | {APP_NAME}
        </title>
        <meta
          name="description"
          content={`Blogs related to ${category.name}`}
        />
        <link rel="canonical" href={`${DOMAIN}/categories/${query.slug}`} />
        <meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
        <meta
          property="og:description"
          content={`Blogs related to ${category.name}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${DOMAIN}/categories/${query.slug}`}
        />
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

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid text-center">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                {blogs.map((blog, index) => (
                  <div>
                    <Card key={index} blog={blog} />
                    <hr />
                  </div>
                ))}
              </div>
            </header>
          </div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Category.getInitialProps = ({ query }) => {
  return singleCategory(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { category: data.category, blogs: data.blogs, query };
    }
  });
};

export default Category;
