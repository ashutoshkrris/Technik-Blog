import { useState, useEffect } from "react";
import { isAuth, getCookie } from "../../actions/auth";
import { create, getTags, removeTag } from "../../actions/tag";
import swal from "sweetalert";

const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadTags();
  }, [reload]);

  const loadTags = () => {
    getTags().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data });
      }
    });
  };

  const showTags = () => {
    return tags.map((t, i) => {
      return (
        <button
          onDoubleClick={() => deleteConfirm(t.slug)}
          title="Double click to delete"
          key={i}
          className="btn btn-outline-info mr-1 ml-1 mt-3"
        >
          {t.name}
        </button>
      );
    });
  };

  const deleteConfirm = (slug) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this tag!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteTag(slug);
        swal("Poof! Your tag has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your tag is safe!");
      }
    });
  };

  const deleteTag = (slug) => {
    // console.log(`delete ${slug}`)
    removeTag(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    // console.log('create tag', name);
    create({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
          removed: false,
          reload: !reload,
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: "",
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Tag is created.</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className="text-danger">Tag already exists.</p>;
    }
  };

  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Tag is removed.</p>;
    }
  };

  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, success: false, removed: "" });
  };

  const newTagFom = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newTagFom()}
        {showTags()}
      </div>
    </React.Fragment>
  );
};

export default Tag;
