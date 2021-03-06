import React from "react";
import SQuestionContainer from "./SQuestionContainer";
import SortResult from "./SortResult.js";

class SMainContainer extends React.Component {
  state = {
    onQuiz: true,
    houseCharacters: null,
  };

  finishQuiz = (house) => {
    if (house === "g") {
      house = "Gryffindor";
    } else if (house === "r") {
      house = "Ravenclaw";
    } else if (house === "h") {
      house = "Hufflepuff";
    } else if (house === "s") {
      house = "Slytherin";
    }

    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        house: house,
      }),
    };

    // Update house in database
    fetch(`http://localhost:3000/users/${this.props.currentUserId}`, configObj)
      .then((res) => res.json())
      .then((user) => {
        this.setState({
          onQuiz: false,
        });
        // Change state of current user house in App.js
        this.props.setUserHouse(house);
      });

    let houseLower = house.toLowerCase();

    let url = ""
    if (this.props.currentUser.is_student){
      url = `http://localhost:3000/${houseLower}_students`;
    }
    else {url = `http://localhost:3000/${houseLower}_teachers`;}
    

    // Fetch characters from that house
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((res) => res.json())
      .then((characters) => {
        this.setState({
          houseCharacters: characters,
        });
      });
  };

  render() {
    return (
      <div id="sorting-hat-main-container">
        
        {this.state.onQuiz ? (
          <SQuestionContainer finishQuiz={this.finishQuiz} />
        ) : (
          <SortResult
            currentUser={this.props.currentUser}
            routerProps={this.props.routerProps}
            houseCharacters={this.state.houseCharacters}
            house={this.props.userHouse}
            setAlterEgo={this.props.setAlterEgo}
          />
        )}
      </div>
    );
  }
}
export default SMainContainer;
