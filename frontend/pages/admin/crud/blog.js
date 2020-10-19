import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/AdminComponent";
import BlogCreate from "../../../components/crud/BlogCreate";

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage Blogs</h2>
            </div>
            <div className="col-md-12">
              <BlogCreate />
            </div>
          </div>    
        </div>
      </Admin>
    </Layout>
  );
};

export default Blog;
