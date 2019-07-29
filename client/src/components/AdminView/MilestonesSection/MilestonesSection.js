import React from "react";
import MilestonesSelector from "./MilestoneSelector";
import MilestonesDetail from "./MilestoneDetails";
import { get } from "../../../utils";

class MilestonesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      team: {},
      milestones: [],
      selectedMilestone: {},
    };
  }

  componentDidMount() {
    this.getStuff();
  }

  getStuff = () => {
    Promise.all([get(`/api/teams/${this.props.team}`), get("/api/milestones/")])
      .then((data) => {
        this.setState({
          loading: false,
          team: data[0][0],
          milestones: data[1],
          selectedMilestone: !!data[1].length ? data[1][0] : {},
        });
      })
      .catch((err) => console.log(err));
  };

  selectMilestone = (milestone) => {
    this.setState({ selectedMilestone: milestone });
  };

  render() {
    const styles = {
      display: "flex",
    };

    if (this.state.loading) {
      return <div>Loading!</div>;
    }

    return (
      <div style={styles}>
        <MilestonesSelector
          hideMilestonesSection={this.props.hideMilestonesSection}
          selectMilestone={this.selectMilestone}
          team={this.state.team}
          milestones={this.state.milestones}
        />
        <MilestonesDetail
          team={this.state.team}
          milestone={this.state.selectedMilestone}
        />
      </div>
    );
  }
}

export default MilestonesSection;
