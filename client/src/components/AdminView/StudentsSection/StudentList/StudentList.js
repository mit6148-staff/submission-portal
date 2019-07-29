import React from "react";
import StudentListHeader from "./StudentListHeader";
import StudentEntry from "./StudentEntry";
import StudentInfoModal from "./StudentInfoModal";
import { get } from "../../../../utils";

class StudentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      students: null,
      activeSort: null,
      sortOrder: "NONE",
      modalInfo: null,
      modalActive: false,
    };
  }

  componentDidMount() {
    this.getStudents();
  }

  getStudents = () => {
    get("/api/users/", { populate: true })
      .then((data) => {
        if (data) {
          let newModalInfo = null;
          if (this.state.modalInfo) {
            newModalInfo = data.filter(
              (el) => el._id === this.state.modalInfo._id
            )[0];
          }
          this.setState({
            loading: false,
            students: data,
            modalInfo: newModalInfo,
          });
        } else {
          this.setState({
            loading: false,
            students: null,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  genSortFunction(param, sortOrder) {
    // This is probably too overcomplicated but im bad
    if (sortOrder === "ASC") {
      if (param === "for_credit") {
        return (a, b) => a[param] - b[param];
      }
      if (param === "team_name") {
        return (a, b) => {
          const aTeam = a.team ? a.team.team_name : "???";
          const bTeam = b.team ? b.team.team_name : "???";
          return aTeam.localeCompare(bTeam);
        };
      }

      return (a, b) => a[param].localeCompare(b[param]);
    } else {
      if (param === "for_credit") {
        return (a, b) => b[param] - a[param];
      }
      if (param === "team_name") {
        return (a, b) => {
          const aTeam = a.team ? a.team.team_name : "???";
          const bTeam = b.team ? b.team.team_name : "???";
          return bTeam.localeCompare(aTeam);
        };
      }

      return (a, b) => b[param].localeCompare(a[param]);
    }
  }

  handleSort = (param) => {
    let sortOrder = "ASC";
    if (this.state.activeSort === param && this.state.sortOrder === "ASC") {
      sortOrder = "DES";
    }

    let sortedStudents = [...this.state.students];
    sortedStudents.sort(this.genSortFunction(param, sortOrder));

    this.setState({
      students: sortedStudents,
      activeSort: param,
      sortOrder,
    });
  };

  showInfoModal = (info) => {
    this.setState({ modalActive: true, modalInfo: info });
  };

  hideInfoModal = () => {
    this.setState({ modalActive: false });
  };

  isSelected = (student) => {
    return this.props.selectedStudents.includes(student);
  };

  render() {
    const {
      loading,
      students,
      activeSort,
      sortOrder,
      modalInfo,
      modalActive,
    } = this.state;

    if (loading) {
      return <div>Loading!</div>;
    }

    let list = <div>No students!</div>;

    if (students && students.length > 0) {
      list = students.map((el, index) => (
        <StudentEntry
          key={index}
          info={el}
          selected={this.isSelected(el)}
          selectStudent={this.props.selectStudent}
          deselectStudent={this.props.deselectStudent}
          showInfoModal={this.showInfoModal}
          refresh={this.getStudents}
          showMilestonesSection={this.props.showMilestonesSection}
        />
      ));
    }

    return (
      <div>
        {modalActive && (
          <StudentInfoModal
            info={modalInfo}
            hideInfoModal={this.hideInfoModal}
            refresh={this.getStudents}
          />
        )}
        <StudentListHeader
          activeSort={activeSort}
          sortOrder={sortOrder}
          handleSort={this.handleSort}
          selectedStudents={this.props.selectedStudents}
          selectAll={() => this.props.selectAll(students)}
          deselectAll={this.props.deselectAll}
        />
        {list}
      </div>
    );
  }
}

export default StudentList;
