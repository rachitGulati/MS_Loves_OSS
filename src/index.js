import "babel-polyfill";
import style from "./style.css";
import React from "react";
import ReactDom from "react-dom";
import axios from "axios";
import users from "!../users.json";
import Loader from "./loader";
import _ from "lodash";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

class CamperTable extends React.Component {
  renderList(campers) {
    var count = 0;
    const githubUrl = "https://github.com/";

    return campers.map(camper => {
      count++;
      return (
        <tr id="results" key={camper.username}>
          <td className="number_results">{count}</td>
          <td className="camper_results">
            <a
              href={githubUrl + camper.username}
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <img src={camper.img} className="imagethumbnail" />
              {camper.username}
            </a>
          </td>
          <td className="recent_results">{camper.prCount}</td>
        </tr>
      );
    });
  }
  render() {
    const campers = _.orderBy(this.props.campers, ["prCount"], ["desc"]);
    return <tbody>{this.renderList(campers)}</tbody>;
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.getPRdata = this.getPRdata.bind(this);
    this.state = {
      campers: [],
      loading: true
    };
  }

  async getPRdata(username) {
    const date = new Date();
    const firstDate = formatDate(date);
    const lastDate = formatDate(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
    const url = `https://api.github.com/search/issues?q=type:pr+author:${username}+created:`;
    let authToken = `token 66a4478485ec7978eb11e`;
    authToken += `9258f1f09b9e2532ec1`;
    const tillTheStartOfThisMonth = await axios.get(`${url}<${firstDate}`, {
      headers: { Authorization: authToken }
    });
    const tillTheEndOfThisMonth = await axios.get(`${url}<${lastDate}`, {
      headers: { Authorization: authToken }
    });
    let userData = {};
    userData.username = username;
    userData.prCount =
      _.get(tillTheEndOfThisMonth, "data.total_count", "N/A") -
      _.get(tillTheStartOfThisMonth, "data.total_count", "N/A");
    userData.img = _.get(
      tillTheEndOfThisMonth,
      "data.items[0].user.avatar_url",
      "https://cdn3.iconfinder.com/data/icons/avatars-9/145/Avatar_Penguin-512.png"
    );
    return userData;
  }

  async fetchUsernames() {
    const usernames = Object.keys(users);
    const finalUsersPromise = [];
    usernames.map(username => {
      finalUsersPromise.push(this.getPRdata(username));
    });
    const finalUsers = await Promise.all(finalUsersPromise);
    console.log(finalUsers);
    this.setState({
      users: finalUsers,
      loading: false
    });
  }

  componentDidMount() {
    // first time Component loads
    this.fetchUsernames();
  }

  currentMonth() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const date = new Date();
    return months[date.getMonth()];
  }

  daysLeft() {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const lastDate = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth() + 1,
      0
    );

    const diffDays = Math.round(
      Math.abs((firstDate.getTime() - lastDate.getTime()) / oneDay)
    );
    return diffDays;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <div id="header">
              <h1 className="title">
                Leaderboard{" "}
                <span style={{ marginRight: 20, float: "right" }}>
                  {" "}
                  {this.daysLeft()} days remaining in {this.currentMonth()}
                  {` !!`}
                </span>
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <table className="table">
              <thead>
                <tr id="labels">
                  <th id="number_label">#</th>
                  <th id="camper_label">Champion:</th>
                  <th id="recent_label"> Pull Requests </th>
                </tr>
              </thead>
              {this.state.loading ? (
                ""
              ) : (
                <CamperTable campers={this.state.users} />
              )}
            </table>
            {this.state.loading ? (
              <div className="col-lg-12 Loader__Body">
                {" "}
                <Loader />{" "}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("app"));
