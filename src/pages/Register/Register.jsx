import { useContext, useEffect, useState } from "react";
import FormRow from "../../components/FormRow/FormRow";
import "./Register.scss";
import { AppContext } from "../../context";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmation: "",
  isMember: true,
};

export default function Register() {
  const [values, setValues] = useState(initialState);

  const { user, loginUser, registerUser, isLoading } = useContext(AppContext);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmation, isMember } = values;

    if (!email || !password || (!isMember && !name)) {
      alert("Please enter a valid value.");
      return;
    }

    if (!isMember && password !== confirmation) {
      alert("Passwords do not match.");
      return;
    }

    const url = isMember ? "/login" : "/register";

    if (isMember) {
      loginUser({ email: email, password: password }, url);
    } else {
      registerUser(
        {
          name: name,
          email: email,
          password: password,
          confirmation: confirmation,
        },
        url
      );
    }
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // redirect to dashboard
      navigate("/");
    }
  }, [user]);

  return (
    <div className="form_container">
      <form className="register" onSubmit={onSubmit}>
        <h1>Draw App</h1>
        <h3>{values.isMember ? "Login" : "Register"}</h3>

        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
            placeholder={"enter your name"}
          />
        )}

        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
          placeholder={"enter your email"}
        />

        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
          placeholder={
            !values.isMember ? "choose a password" : "enter your password"
          }
        />
        {!values.isMember && (
          <FormRow
            type="password"
            name="confirmation"
            value={values.confirmation}
            handleChange={handleChange}
            placeholder={"Password(again)"}
          />
        )}

        <button type="submit" className="btn_black submit" disabled={isLoading}>
          Submit
        </button>
        <p className="isMember_text">
          {values.isMember ? "Not a member yet?" : "Already a member?"}

          <button type="button" onClick={toggleMember} className="btn_member">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
