
import React, { Component, useState } from 'react';
import socketIOClient, { managers } from 'socket.io-client'
import axios from 'axios'
// import ReactDOM from 'react-dom';

var randernumber = Math.floor((Math.random() * 100) + 1)

// const [massages, setMassages] = useState('');
// const [personid, setPersonid] = useState('');


class Chat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            input: '',
            userid: [],
            useridinput: '',
            timesend: [],
            message: [],
            endpoint: "http://localhost:9000" // เชื่อมต่อไปยัง url ของ realtime server
        }
    }

    componentDidMount = () => {
        this.response();
    }

    // เมื่อมีการส่งข้อมูลไปยัง server

    send = (message) => {
        message.preventDefault();
        const { endpoint, input, useridinput } = this.state
        const socket = socketIOClient(endpoint)
        socket.emit('sent-message', input, useridinput)
        axios.post('http://localhost:3004/massages', {
            "id": 6,
            "first_name": "Roger",
            "last_name": "Bacon",
            "email": "rogerbacon12@yahoo.com"
        })
        // fetch("http://localhost:3000/massages")
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //     this.setState({
        //         input: input, userid: useridinput
        //     });
        //     },
        //     // Note: it's important to handle errors here
        //     // instead of a catch() block so that we don't swallow
        //     // exceptions from actual bugs in components.
        //     (error) => {
        //     this.setState({
        //         isLoaded: true,
        //         error
        //     });
        //     }
        // )
        this.setState(
            {
                input: '', userid: ''
            }
        )
        // console.log(this.state)
    }

    setStateUseridAndTimesend = () => {
        this.setState({ userid: randernumber, timesend: new Date() })
    }
    // รอรับข้อมูลเมื่อ server มีการ update
    response = () => {
        const { endpoint, message, userid, timesend } = this.state
        const temp = message
        const d = userid
        const t = timesend
        // console.log(d)
        const socket = socketIOClient(endpoint)
        socket.on('new-message', (messageNew, useridServer, timeSend) => {
            temp.push(messageNew)
            // alert(timeSend)
            d.push(useridServer)
            t.push(timeSend)
            this.setState({ message: temp, userid: d, timesend: t })
        })
    }
    /////////////////////////////////

    

    changeInput = (e) => {
        // var curr = new Date();
        // // curr.setDate(curr.getDate() + 3);
        // var dateNow = curr.toISOString().substr(0,10);
        // console.log(e);
        // var curr = 11.00;
        this.setState({ input: e.target.value, useridinput: randernumber })
        // console.log(this.state)
    }

    localTime = (e) => {
        var d = new Date(e);
        var n = d.toLocaleTimeString();
        var m = d.toLocaleDateString();
        return n + ' ' + m;
    }

    render() {
        // this.state = { input, message, userid, timesend };
        const { input, message, userid, timesend } = this.state
        return (
            <div className="col-lg-6">
                <div className="">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title box-title">Live Chat</h4>
                            <div className="card-content">
                                <div className="messenger-box scroll">
                                    <ul>
                                        {
                                            this.state.message.map((data, i) =>
                                                <li key={i} >
                                                    {userid[i] != randernumber ?
                                                        <view>
                                                            <div className="msg-received msg-container">
                                                                <div className="avatar">
                                                                    <img src="images/avatar/64-1.jpg" alt />
                                                                    <div className="send-time">{this.localTime(this.state.timesend[i])}</div>
                                                                </div>
                                                                <div className="msg-box">
                                                                    <div className="inner-box">
                                                                        <div className="name">
                                                                            <i>user: </i>{userid[i]}
                                                                        </div>
                                                                        <div className="meg">
                                                                            {message[i]}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>{/* /.msg-received */}
                                                        </view>
                                                        :
                                                        <view>
                                                            <div className="msg-sent msg-container">
                                                                <div className="avatar">
                                                                    <img src="images/avatar/64-2.jpg" alt />
                                                                    <div className="send-time">{this.localTime(this.state.timesend[i])}</div>
                                                                </div>
                                                                <div className="msg-box">
                                                                    <div className="inner-box">
                                                                        <div className="name">
                                                                            ฉัน
                                                                        </div>
                                                                        <div className="meg">
                                                                            {data}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </view>
                                                    }
                                                </li>
                                            )
                                        }
                                    </ul>
                                    <div className="send-mgs">
                                        <form onSubmit={this.send}>
                                            <div className="yourmsg">
                                                <input autoFocus className="form-control" type="text" value={input} onChange={this.changeInput} />
                                            </div>
                                            <button className="btn msg-send-btn">
                                                <i className="pe-7s-paper-plane" />
                                            </button>
                                        </form>
                                    </div>
                                </div>{/* /.messenger-box */}
                            </div>
                        </div> {/* /.card-body */}
                    </div>{/* /.card */}
                </div>
            </div>
        )
    }
}

export default Chat;