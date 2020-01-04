import React from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { get, post } from "../../utils";
import { addMember } from "../../js/teams";

import Back from "../ui/Back";

import "./JoinTeam.css";

class JoinTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamNameIdMap: {},
      teamName: "",
      msg: "",
      loading: true,
    };
  }

  componentDidMount() {
    document.getElementById("teamnameInput").focus();
    get("/api/teams/names").then((res) => {
      this.setState({ loading: false, teamNameIdMap: res });
    });
  }

  handleSubmit = (event) => {
    const { teamName, teamNameIdMap } = this.state;
    event.preventDefault();
    addMember(teamNameIdMap[teamName], this.props.user._id);
  };

  handleChange = (event) => {
    const inputNode = event.target;
    const cleanedSpaces = inputNode.value.replace(/ /g, "_");
    this.setState({
      [inputNode.name]: cleanedSpaces,
    });
  };

  render() {
    const { teamName } = this.state;
    return (
      <div className="u-positionRelative">
        <Back absolute trigger={this.props.hideJoinTeamView} />
        <form className="u-flex" onSubmit={this.handleSubmit}>
          <label className="JoinTeam-label">join team</label>
          <input
            id="teamnameInput"
            className="JoinTeam-textInput"
            type="text"
            name="teamName"
            value={teamName}
            onChange={this.handleChange}
            placeholder="team name"
            maxLength="50"
          />
          <span
            className={classnames("JoinTeam-submit", {
              disabled: this.state.loading || !this.state.teamNameIdMap[this.state.teamName],
            })}
            onClick={this.handleSubmit}
          >
            <FontAwesomeIcon icon={["fas", "check"]} size="1x" />
            <input
              type="submit"
              disabled={this.state.loading || !this.state.teamNameIdMap[this.state.teamName]}
              value=""
            />
          </span>
        </form>
      </div>
    );
  }
}

export default JoinTeam;
