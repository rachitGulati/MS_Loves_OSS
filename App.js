import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';

class CamperTable extends React.Component {
	
	renderList() {
		var count = 0;
		var fccUrl = 'https://www.freecodecamp.com/';
		
		return this.props.campers.map( (camper) => {
			count++
			return (
				<tr id="results" key={camper.username}>
					<td className="number_results">{count}</td>
					<td className="camper_results">
						<a href={fccUrl + camper.username}>
							<img src={camper.img} className="imagethumbnail"/>{camper.username}
						</a>
					</td>
					<td className="recent_results">{camper.recent}</td>
					<td className="recent_results">{camper.alltime}</td>             
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
    this.state = { 
      campers: []
    }
  }	
	
	fetchData (duration) {
		var url = "https://fcctop100.herokuapp.com/api/fccusers/top/" + duration;
		return axios.get(url)
			.then(function(response) {
				var campers = response.data;
				this.setState({campers:campers})
				}.bind(this));		
	}
	
	componentDidMount () { // first time Component loads
		this.fetchData("recent");
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