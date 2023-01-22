import React from "react";
import { API } from "./src/api/API.js";
import { NavigationRoot } from "./src/components/Navigation/NavigationRoot";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }
  componentDidMount() {
    API.get().then((response) => this.setState({ message: response.message }));
  }

  render() {
    return (
        <NavigationRoot />
    );
  }
}

export default App;
