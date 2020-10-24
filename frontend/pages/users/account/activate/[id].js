import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../../components/Layout";
import { withRouter } from "next/router";
import { activate } from "../../../../actions/auth";

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    name: "",
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true,
  });

  const { name, token, error, loading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const { name } = jwt.decode(token);
      setValues({ ...values, name, token });
    }
  }, [router]);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    activate({ token }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false,
        });
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false,
        });
      }
    });
  };

  const showLoading = () =>
    loading ? (
      <h2 className="alert alert-warning text-center col-md-6 offset-md-3">
        <b>Activating...</b>
      </h2>
    ) : (
      ""
    );

  return (
    <Layout>
      <div className="container">
        <h3 className="pb-4 pt-2 text-center">
          Hey {name}, Ready to activate your account?
        </h3>
        {showLoading()}
        {error && error}
        {success && (
          <p className="alert alert-success text-center col-md-6 offset-md-3">
            <b>You have successfully activated your account. You can now login.</b>
          </p>
        )}
        {showButton && (
          <center>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
              Yeah!
            </button>
          </center>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
