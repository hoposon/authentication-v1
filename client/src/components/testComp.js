import React from 'react';

export default class TestAPI extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			output: 'NOT CALLED'
		};
		this.callGet = this.callGet.bind(this);
		this.callPostJSON = this.callPostJSON.bind(this);
		this.callPost = this.callPost.bind(this);
	}
	render() {
		return (
			<div>
				<p>{this.state.output}</p>
				<button onClick={this.callGet}>GET</button>
				<button onClick={this.callPostJSON}>callPostJSON</button>
				<button onClick={this.callPost}>POST</button>
			</div>
		)
	}

	callGet() {
		fetch('http://localhost:3000/test/test').then((data) => {
			console.log('response: ', data);
			return data.json();
		})
		.then((data) => {
			console.log('data:', data);
			this.setState({
				output: 'SUCCESSFULY CALLED'
			});
		})
		.catch((e) => {
			console.log('catch:', e.message);
			this.setState({
				output: 'CALL FAILED'
			});
		})
	}

	callGetJson() {
		fetch('http://localhost:3000/test/test', {
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				testString: 'this is a test string'
			}) 
		}).then((data) => {
			console.log('response: ', data);
			return data.json();
		})
		.then((data) => {
			console.log('data:', data);
			this.setState({
				output: 'SUCCESSFULY CALLED'
			});
		})
		.catch((e) => {
			console.log('catch:', e.message);
			this.setState({
				output: 'CALL FAILED'
			});
		})
	}

	callPost() {
		fetch('http://localhost:3000/v1/users/register', {
			method: "POST"
		}).then((data) => {
			console.log('response: ', data);
			return data.json();
		})
		.then((data) => {
			console.log('data:', data);
			this.setState({
				output: 'SUCCESSFULY CALLED'
			});
		})
		.catch((e) => {
			console.log('catch:', e.message);
			this.setState({
				output: 'CALL FAILED'
			});
		})
	}

	callPostJSON() {
		fetch('http://localhost:3000/v1/users/register', {
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				testString: 'this is a test string'
			})
		}).then((data) => {
			console.log('response: ', data);
			return data.json();
		})
		.then((data) => {
			console.log('data:', data);
			this.setState({
				output: 'SUCCESSFULY CALLED'
			});
		})
		.catch((e) => {
			console.log('catch:', e.message);
			this.setState({
				output: 'CALL FAILED'
			});
		})
	}
}