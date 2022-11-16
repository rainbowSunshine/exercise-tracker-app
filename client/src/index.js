
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';

const rootUrl = 'http://localhost:3001';

class App extends React.Component{
constructor(props){
  super(props);
  this.state = {
    userId:0,
    action: '/'
  };
  this.handleChange = this.handleChange.bind(this);
}
handleChange(e) {
  console.log(e.target.value);
  this.setState({
    userId: e.target.value,
    action: '/api/users/'+e.target.value+'/exercises'
  });
  console.log("action"+this.state.action);
}

render(){
  return(
    <div className="container">
      <h1>Exercise tracker</h1>
      <form action={rootUrl +"/api/users"} method="post">
        <h3>Create a New User</h3>
        <p><code>POST /api/users</code></p>
        <input id="uname" type="text" name="username" placeholder="username" />
        <input type="submit" value="Submit" />
      </form>
      <Exerciseform userId = {this.state.userId} onChange={this.handleChange} action={this.state.action}/>
      <p>
        <strong>GET user's exercise log: </strong>
        <code>GET /api/users/:_id/logs?[from][&amp;to][&amp;limit]</code>
      </p>
      <p><strong>[ ]</strong> = optional</p>
      <p><strong>from, to</strong> = dates (yyyy-mm-dd); <strong>limit</strong> = number</p>
    </div>
  )
}

}
const Exerciseform =(props) =>{
  return(
    <form id="exercise-form" method="post" action={props.action}>
        <h3>Add exercises</h3>
        <p><code>POST /api/users/:_id/exercises</code></p>
        <input id="uid" type="text" name=":_id" placeholder=":_id" onChange={props.onChange} />
        <input id="desc" type="text" name="description" placeholder="description*" />
        <input id="dur" type="text" name="duration" placeholder="duration* (mins.)" />
        <input id="date" type="text" name="date" placeholder="date (yyyy-mm-dd)" />
        <input type="submit" value="Submit" />
      </form>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);
