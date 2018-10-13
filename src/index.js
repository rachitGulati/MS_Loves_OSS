import style from "./style.scss";
import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import users from '!../users.json';

class CamperTable extends React.Component {
	
	renderList() {
		var count = 0;
		const githubUrl = "https://github.com/";
		
		return this.props.campers.map( (camper) => {
			count++
			return (
				<tr id="results" key={camper.username}>
					<td className="number_results">{count}</td>
					<td className="camper_results">
						<a href={githubUrl+ camper.username} target="_blank" style={{ textDecoration: 'none' }}>
							<img src={camper.img} className="imagethumbnail"/>{camper.username}
						</a>
					</td>
					<td className="recent_results">{camper.prCount}</td>           
				</tr> 
			)			
		})
	}	
	render() {
		return (
			<tbody>
				{this.renderList()}
			</tbody>								
		)
	}
}

class App extends React.Component{
  constructor() {
		super();
		this.getPRdata = this.getPRdata.bind(this);
    this.state = { 
      campers: []
		}
  }	
	
	getPRdata(username){
		const url = `https://api.github.com/search/issues?q=type:pr+author:${username}+created:>2018-10-01`;
		const that = this;
		let authToken = `token 6c880907c198cd85`
		authToken += `4b1020a84699354e5c4f1e22`
		axios.get(url, { headers: { Authorization: authToken }})
		.then(function(response) {
		 let userData = {};
		 userData.username = username;
		 userData.prCount = response.data.total_count;
		 let campers = that.state.campers;
		 campers.push(userData);
		 that.setState({
			 campers: campers
		 })
		});
	}

	fetchUsernames () {
			const usernames = Object.keys(users);
			usernames.map( (username) => {
				this.getPRdata(username);
			})
	}
	
	componentDidMount () { // first time Component loads
		this.fetchUsernames();
	}

	daysLeft(){
        const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date();
        const secondDate = new Date("2018-10-31");

        const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        return diffDays;
    }
	render () {
		return (
			<div>
        <div className="row">
          <div className="col-lg-12">
        	  <div id="header">
        		  <h1 className="title">Leaderboard <span style={{marginRight: 20, float:"right"}}> {this.daysLeft() } days remaining! </span></h1>
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
								<CamperTable campers={this.state.campers} />
						</table>	
					</div>
				</div>
			</div>
		);
	}	
};

ReactDom.render(<App />, document.getElementById("app"));