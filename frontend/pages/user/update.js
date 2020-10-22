import Layout from "../../components/Layout";
import Private from "../../components/auth/PrivateComponent";
import ProfileUpdate from "../../components/auth/ProfileUpdateComponent"


const UserProfileUpdate = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <ProfileUpdate />
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserProfileUpdate;
