import { useState } from "react";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
    error: "",
    message: "",
    showForm: true,
  });

  const {
    showForm,
    name,
    newPassword,
    confirmPassword,
    error,
    message,
  } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      newPassword,
      confirmPassword,
      resetPasswordLink: router.query.id,
    }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          showForm: false,
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setValues({
          ...values,
          message: data.message,
          showForm: false,
          newPassword: "",
          confirmPassword: "",
          error: false,
        });
      }
    });
  };

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="col-md-6 offset-md-3">
        <div className="form-group pt-3">
          <input
            type="password"
            onChange={(e) =>
              setValues({ ...values, newPassword: e.target.value })
            }
            className="form-control"
            value={newPassword}
            placeholder="Enter new password"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            onChange={(e) =>
              setValues({ ...values, confirmPassword: e.target.value })
            }
            className="form-control"
            value={confirmPassword}
            placeholder="Confirm new password"
            required
          />
        </div>
        <div>
          <button className="btn btn-primary">Change password</button>
        </div>
      </div>
    </form>
  );

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

  return (
    <Layout>
      <div className="container">
        <h2 className="col-md-6 offset-md-3 text-center">Reset password</h2>
        {showError()}
        <br />
        {showMessage()}
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
