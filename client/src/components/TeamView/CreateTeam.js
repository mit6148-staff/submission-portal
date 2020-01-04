import React from "react";
import { Redirect } from "react-router-dom";
import { get, post } from "../../utils";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Nav from "../StudentView/StudentNav";
import Back from "../ui/Back";

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: "",
      isCompeting: "",
      redirect: false,
      newTeam: "",
    };
  }

  handleChange = (event) => {
    const inputNode = event.target;
    this.setState({
      [inputNode.name]: inputNode.value,
    });
  };

  handleSubmit = (event) => {
    const { currentUser } = this.props.location.state;
    const { teamName, isCompeting } = this.state;
    event.preventDefault();
    post(`/api/teams/`, {
      team_name: teamName,
      is_competing: isCompeting,
      creator_id: currentUser._id,
    })
      .then((response) => {
        console.log(response);
        get(`/api/teams/${response._id}`)
          .then((teamObj) => {
            this.setState({
              redirect: true,
              newTeam: teamObj,
            });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { teamName, isCompeting, redirect, newTeam } = this.state;

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: "/team",
            state: {
              currentTeam: newTeam,
            },
          }}
        />
      );
    }
    return (
      <>
        <Nav loggedIn />
        <div className="StudentView-container">
          <h1 className="StudentView-greetingHeader u-positionRelative">
            <Back absolute to="/" />
            Create Team
          </h1>
          <Formik
            enableReinitialize={true}
            initialValues={{
              teamName,
              isCompeting,
            }}
            validate={(values) => {
              let errors = {};
              if (!values.teamName) {
                errors.teamName = "Required";
              }
              if (!values.isCompeting) {
                errors.isCompeting = "Required";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const { currentUser } = this.props.location.state;
              const { teamName, isCompeting } = values;
              console.log(teamName, isCompeting);
              event.preventDefault();
              post(`/api/teams/`, {
                team_name: teamName,
                is_competing: isCompeting,
                creator_id: currentUser._id,
              })
                .then((response) => {
                  console.log(response);
                  get(`/api/teams/${response._id}`)
                    .then((teamObj) => {
                      this.setState({
                        redirect: true,
                        newTeam: teamObj,
                      });
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="u-marginBottom-md">
                  <div className="Register-label">team name</div>
                  <Field className="formInput" type="text" name="teamName" />
                  <ErrorMessage className="formError" name="teamName" component="div" />
                </div>
                <div className="u-positionRelative u-marginBottom-md">
                  <label className="Register-label">is your team competing?</label>
                  <div className="formInput-select--arrow">
                    <Field
                      className="formInput-select"
                      component="select"
                      name="isCompeting"
                      defaultValue="filler"
                    >
                      <option disabled value="">
                        -- select an option --
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Field>
                    <ErrorMessage className="formError" name="isCompeting" component="div" />
                  </div>
                </div>
                <button className="Register-button" type="submit" disabled={isSubmitting}>
                  create
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  }
}

export default CreateTeam;
