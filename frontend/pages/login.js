import Layout from "../components/Layout";
import LoginComponent from "../components/auth/LoginComponent"

const Login = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Login Page</h2>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <LoginComponent/>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
