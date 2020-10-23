import Layout from "../components/Layout";
import Link from "next/link";
import ContactForm from "../components/contact/ContactForm";

const Contact = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h2 className="text-center">Contact form</h2>
            <br />
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
