import { useState } from "react";
import Layout from "../../../components/Layout";
import { forgotPassword } from "../../../actions/auth";

const ForgotPassword = () => {
  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
    showForm: true,
  });

  const { email, message, error, showForm } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, message: "", error: "", [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });
    forgotPassword({ email }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: data.message,
          email: "",
          showForm: false,
        });
      }
    });
  };

  const showError = () =>
    error ? (
      <div className="alert alert-danger text-center col-md-6 offset-md-3">
        <b>{error}</b>
      </div>
    ) : (
      ""
    );
  const showMessage = () =>
    message ? (
      <div className="alert alert-success text-center col-md-6 offset-md-3">
        <b>{message}</b>
      </div>
    ) : (
      ""
    );

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="col-md-6 offset-md-3">
        <div className="form-group pt-5 ">
          <input
            type="email"
            onChange={handleChange("email")}
            className="form-control"
            value={email}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <button className="btn btn-primary">Reset Password</button>
        </div>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container">
        <h2 className="col-md-6 offset-md-3 text-center">Forgot password</h2>
        {showError()}
        <br />
        {showMessage()}
        {showForm && passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
