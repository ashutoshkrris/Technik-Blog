import Layout from "../../components/Layout";
import Admin from "../../components/auth/AdminComponent";
import Link from "next/link";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul class="list-group">
                <a
                  href="/admin/crud/category-tag"
                  style={{ textDecoration: "none" }}
                >
                  <li
                    class="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Create New Category
                  </li>
                </a>

                <a
                  href="/admin/crud/category-tag"
                  style={{ textDecoration: "none" }}
                >
                  <li
                    class="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Create New Tag
                  </li>
                </a>

                <a href="/admin/crud/blog" style={{ textDecoration: "none" }}>
                  <li
                    class="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Create New Blog
                  </li>
                </a>

                <a href="/admin/crud/blogs" style={{ textDecoration: "none" }}>
                  <li
                    class="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Update/Delete Blog
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
