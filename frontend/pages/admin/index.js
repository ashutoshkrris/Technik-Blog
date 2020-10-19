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
                <a>
                  <Link href="/admin/crud/category-tag">
                    <li
                      class="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                    >
                      Create New Category
                    </li>
                  </Link>
                </a>
                
                <a>
                  <Link href="/admin/crud/category-tag">
                    <li
                      class="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                    >
                      Create New Tag
                    </li>
                  </Link>
                </a>

                <a>
                  <Link href="/admin/crud/blog">
                    <li
                      class="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                    >
                      Create New Blog
                    </li>
                  </Link>
                </a>

                <a>
                  <Link href="/admin/crud/blogs">
                    <li
                      class="list-group-item list-group-item-action"
                      style={{ cursor: "pointer" }}
                    >
                      Update/Delete Blog
                    </li>
                  </Link>
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
