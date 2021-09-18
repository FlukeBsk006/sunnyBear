
import React, { Component, useEffect, useState } from 'react';
import socketIOClient, { managers } from 'socket.io-client'
import axios from 'axios'
import { Card, Image } from 'react-bootstrap';
// import ReactDOM from 'react-dom';

function Chat() {
    
    const endpoint = 'http://localhost:9000'
    
    const [contentList, setContentList] = useState([]);
    const [emidList, setEmidList] = useState();
    const [timesList, setTimeList] = useState();

    const userid = localStorage.getItem("userid");

    useEffect(() => {
        document.getElementById("scroll").scrollTo(0,document.body.scrollHeight);
        response();
    })

    useEffect(() => {
        axios.get('http://localhost:3004/massages').then((response) => {
            setContentList(response.data);
            // console.log(response.data)
        });        
    }, [send])

    var send = (message) => {
        message.preventDefault();
        // messages => message.target[0].value;
        // console.log(messages);
        // console.log(contentList);
        var msg = message.target[0].value;
        const socket = socketIOClient(endpoint)
        socket.emit('sent-message', msg, userid)
        axios.post('http://localhost:3004/massages', {
            // "id": 2,
            content: msg,
            em_id: userid,
            times: new Date()
        })
        .then(() => {
            setContentList([
                ...contentList,
                {
                    content: msg,
                    em_id: userid,
                    times: new Date()

                    // datetimes: datetimes
                }
            ])
        })
        
        // console.log(this.state)
    }

    var response = () => {
        const temp = contentList
        const d = emidList
        const t = timesList
        const socket = socketIOClient(endpoint)
        socket.on('new-message', (messageNew, useridServer, timeSend) => {
            console.log(useridServer)
            // temp.push(messageNew)
            // d.push(useridServer)
            // t.push(timeSend)
            setContentList([
                ...contentList,
                {
                    content: messageNew,
                    em_id: useridServer,
                    times: timeSend
                }
            ])
        })
    }
    
    const localTime = (e) => {
        var d = new Date(e);
        var n = d.toLocaleTimeString();
        var m = d.toLocaleDateString();
        return n + ' ' + m;
    }
        return (
            <div className="col-lg-6">
                <div className="">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title box-title">Live User 
                            </h4>
                            <div className="card-content">
                                <div className="messenger-box scroll" id="scroll">
                                    <ul>
                                        {
                                            contentList.map((val, i) =>
                                                <li key={i} >
                                                    {val.em_id == userid ?
                                                        <view>
                                                            <div className="msg-sent msg-container">
                                                                <div className="avatar">
                                                                    <img src="images/avatar/64-2.jpg" width="50%" alt />
                                                                    <div className="send-time">{localTime(val.times)}</div>
                                                                </div>
                                                                <div className="msg-box ">
                                                                    <div className="inner-box">
                                                                        <div className="name">
                                                                            ฉัน {userid}
                                                                        </div>
                                                                        <div className="meg">
                                                                            {val.content}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </view> 
                                                        :
                                                        <view>
                                                            <div className="msg-received msg-container">
                                                                <div className="avatar">
                                                                    <img src="images/avatar/64-1.jpg" width="50%" alt />
                                                                    <div className="send-time">{localTime((val.times))}</div>
                                                                </div>
                                                                <div className="msg-box">
                                                                    <div className="inner-box">
                                                                        <div className="name">
                                                                            <i>user: </i>{val.em_id}
                                                                        </div>
                                                                        <div className="meg">
                                                                            {val.content}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>{/* /.msg-received */}
                                                        </view>
                                                    }
                                                </li>
                                            )
                                        }
                                    </ul>
                                </div>{/* /.messenger-box */}
                                <div className="messenger-box">
                                    <div className="send-mgs">
                                        <form onSubmit={send}>
                                            <div className="yourmsg">
                                                <input autoFocus className="form-control" type="text" />
                                            </div>
                                            <button className="btn msg-send-btn">
                                                <i className="pe-7s-paper-plane" />
                                            </button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div> {/* /.card-body */}
                    </div>{/* /.card */}
                </div>
            </div>
        )
}

export default Chat;