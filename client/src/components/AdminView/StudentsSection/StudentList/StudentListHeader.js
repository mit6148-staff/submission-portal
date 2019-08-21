import React from "react";
import SortableHeader from "./SortableHeader";

class StudentListHeader extends React.Component {
  areStudentsSelected = () => {
    return this.props.selectedStudents.length > 0;
  };

  toggleSelect = () => {
    if (this.areStudentsSelected()) {
      this.props.deselectAll();
    } else {
      this.props.selectAll();
    }
  };

  render() {
    const styles = {
      display: "flex",
      alignItems: "center",
      margin: "3px 40px",
      padding: "5px",
    };

    return (
      <div style={styles}>
        <div style={{ display: "flex", width: "3vw" }}>
          <input
            type="checkbox"
            checked={this.areStudentsSelected()}
            onChange={this.toggleSelect}
          />
        </div>
        <SortableHeader
          label="First Name"
          items={this.props.students}
          sortingFn={(a, b) => a.first_name.localeCompare(b.first_name)}
          afterSort={this.props.afterSort}
        />
        <SortableHeader
          label="Last Name"
          items={this.props.students}
          sortingFn={(a, b) => a.last_name.localeCompare(b.last_name)}
          afterSort={this.props.afterSort}
        />
        <SortableHeader
          label="Github Username"
          items={this.props.students}
          sortingFn={(a, b) =>
            a.github_username.localeCompare(b.github_username)
          }
          afterSort={this.props.afterSort}
        />
        <SortableHeader
          label="Team Name"
          items={this.props.students}
          sortingFn={(a, b) => {
            const aTeam = a.team ? a.team.team_name : "???";
            const bTeam = b.team ? b.team.team_name : "???";
            return aTeam.localeCompare(bTeam);
          }}
          afterSort={this.props.afterSort}
        />
        <SortableHeader
          label="For Credit?"
          items={this.props.students}
          sortingFn={(a, b) => a.for_credit - b.for_credit}
          afterSort={this.props.afterSort}
        />
        <div style={{ display: "flex", width: "15vw" }}>
          <div>Tags</div>
        </div>
      </div>
    );
  }
}

export default StudentListHeader;
