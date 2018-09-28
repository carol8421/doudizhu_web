import React, {Component} from 'react';
import axios from 'axios';
import './UserLogin.css';
import {RandomJoinRoomUrl} from '../url';
import qs from 'qs';

class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            input_uid:''
        }
    }
    login() {
        if (this.state.input_uid) {
            axios.post(RandomJoinRoomUrl, qs.stringify({
                'uid':this.state.input_uid,
            }))
            .then( resp => {
                if(resp.data.rcode == 0) {
                    this.props.onLoginSuccess(this.state.input_uid, resp.data.data);
                }
            })
            .catch ( error => {
                console.error(error);
                alert(error);
            });
        }
    }
    valueChanged(evt) {
        this.setState({
            input_uid:evt.target.value,
        });
    }
    render() {
        return ( <div>
            <label>uid:
            <input type="number" id="my_uid" 
                value={this.state.input_uid} 
                onChange={this.valueChanged.bind(this)}/>
                </label>
            <button onClick={this.login.bind(this)}>Login</button>
            </div>)
    }
}

export default UserLogin;