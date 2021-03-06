import React, { Component } from 'react';
import fetchMock from 'fetch-mock';
import mockResponse from '../../mockResponse';
import '../../styles/TopChart.css';
import ChartsWrapper from './ChartsWrapper';

class TopChart extends Component {
  constructor() {
    super();
    this.state = {
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
      from : "2016-12-10T00:56:11.000Z",
      to: "2017-01-05T00:56:11.000Z",
      formWarning: "",
      status: 'initial', //initial loading success fail
      response: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.mockGet(this.state.id, this.state.from, this.state.to);
  }

  mockGet(id, from, to) {
    fetchMock.get(/server_stat\/.*?.*/i, mockResponse.get);

    this.setState({status: 'loading'});
    return fetch(`/server_stat/${id}?from=${from}&to=${to}`)
      .then((response) => {
        return response.json()
      })
      .then((data)=>{
        console.log(data)
        this.setState({response: data, status: 'success'});
      })
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.id==="" || this.state.from==="" ||this.state.to===""){
      this.setState({formWarning: "all input required"});
      return;
    }
    else if(new Date(this.state.from) > new Date(this.state.to)){
      this.setState({formWarning: "FROM date can't be earlier than TO date"});
      return;
    }
    else {
        this.setState({formWarning: ""});
        this.mockGet(this.state.id, this.state.from, this.state.to);
    }
  }

  handleChange(e) {
    if(e.target.id === 'id'){
        this.setState({id: e.target.value});
    }
    if(e.target.id === 'from' || e.target.id === 'to'){
        this.setState({ [e.target.id]: e.target.value+'Z'});
    }

    this.setState({formWarning: ""});
  }

  render() {
    return (
      <div id="TopChart">
        <section id="getFormWrapper">
          <h3>SEARCH</h3>
          <form id="getForm" onSubmit={this.handleSubmit}>
            <label>
              SERVER ID:
              <input type="text" id="id" value={this.state.id} onChange={this.handleChange} required/>
            </label>
            <label>
              FROM:
              <input type="datetime-local" id="from" value={this.state.from.substring(0,this.state.from.length-1)} onChange={this.handleChange} />
            </label>
            <label>
              TO:
              <input type="datetime-local"  id="to" value={this.state.to.substring(0,this.state.to.length-1)} onChange={this.handleChange}  />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div id="formWarning">{this.state.formWarning}</div>
        </section>
        <section>
          <ChartsWrapper status={this.state.status} response={this.state.response} />
        </section>
      </div>
    );
  }
}

export default TopChart;
