import Layout from "../../components/Layout";
import Private from "../../components/auth/PrivateComponent";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>User Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul className="list-group">
                <a href="/user/update" style={{ textDecoration: "none" }}>
                  <li
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Update Profile
                  </li>
                </a>

                <a href="/user/crud/blog" style={{ textDecoration: "none" }}>
                  <li
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Create New Blog
                  </li>
                </a>

                <a href="/user/crud/blogs" style={{ textDecoration: "none" }}>
                  <li
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                  >
                    Update/Delete Blog
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
