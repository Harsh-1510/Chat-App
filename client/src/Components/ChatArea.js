import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

var socket, chat;

function ChatArea() {
    const lightTheme = useSelector((state) => state.themeKey);
    const [messageContent, setMessageContent] = useState("");
    const messagesEndRef = useRef(null);

    const dyParams = useParams();
    const { id } = dyParams;
    const [ chat_id, chat_user ] = id.split("&");

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [allMessages, setAllMessages] = useState([]);
    const [allMessagesCopy, setAllMessagesCopy] = useState([]);
    // console.log("Chat area id : ", chat_id._id);
    // const refresh = useSelector((state) => state.refreshKey);
    const { refresh, setRefresh } = useContext(myContext);
    const [loaded, setloaded] = useState(false);
    const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);


    const sendMessage = () => {
        // console.log("SendMessage Fired to", chat_id._id);
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`,
            },
        };
        axios
            .post(
                "http://localhost:5000/message/",
                {
                    content: messageContent,
                    chatId: chat_id,
                },
                config
            )
            .then(({ data }) => {
                console.log("Message Fired");
                socket.emit("newMessage", data);
            });
    };
    // const scrollToBottom = () => {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // connect to socket
    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup", userData);
        socket.on("connection", ()=>{
            setSocketConnectionStatus(!socketConnectionStatus);
        });
    }, []);

    // new message received
    useEffect(()=>{
        socket.on("message recieved", (newMessage) => {
            // if(!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {

            // } else {
            //     setAllMessages([...allMessages], newMessage);
            // }
            if (!allMessages.some(message => message._id === newMessage._id)) {
                setAllMessages([...allMessages, newMessage]);
            }
        });
    }, [allMessages]);
    
    // fetch Chats
    useEffect(() => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`,
            },
        };
        axios
            .get("http://localhost:5000/message/" + chat_id, config)
            .then(({ data }) => {
                setAllMessages(data);
                setloaded(true);
                socket.emit("join chat", chat_id);
                // console.log("Data from Acess Chat API ", data);
            });
        setAllMessagesCopy(allMessages);
        // scrollToBottom();
    }, [refresh, chat_id, userData.data.token, allMessages]);

    if (!loaded) {
        return (
            <div
                style={{
                    border: "20px",
                    padding: "10px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60}
                />
                <Skeleton
                    variant="rectangular"
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        flexGrow: "1",
                    }}
                />
                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60}
                />
            </div>
        );
    } else {
        return (
            <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
                <div
                    className={"chatArea-header" + (lightTheme ? "" : " dark")}
                >
                    <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                        {chat_user[0]}
                    </p>
                    <div
                        className={"header-text" + (lightTheme ? "" : " dark")}
                    >
                        <p
                            className={
                                "con-title" + (lightTheme ? "" : " dark")
                            }
                        >
                            {chat_user}
                        </p>
                        {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
            {props.timeStamp}
            </p> */}
                    </div>
                    <IconButton
                        className={"icon" + (lightTheme ? "" : " dark")}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
                <div
                    className={
                        "messages-container" + (lightTheme ? "" : " dark")
                    }
                >
                    {allMessages
                        .slice(0)
                        .reverse()
                        .map((message, index) => {
                            const sender = message.sender;
                            const self_id = userData.data._id;
                            if (sender._id === self_id) {
                                // console.log("I sent it ");
                                return (
                                    <MessageSelf props={message} key={index} />
                                );
                            } else {
                                // console.log("Someone Sent it");
                                return (
                                    <MessageOthers
                                        props={message}
                                        key={index}
                                    />
                                );
                            }
                        })}
                </div>
                <div ref={messagesEndRef} className="BOTTOM" />
                <div
                    className={"text-input-area" + (lightTheme ? "" : " dark")}
                >
                    <input
                        placeholder="Type a Message"
                        className={"search-box" + (lightTheme ? "" : " dark")}
                        value={messageContent}
                        onChange={(e) => {
                            setMessageContent(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.code == "Enter") {
                                // console.log(event);
                                sendMessage();
                                setMessageContent("");
                                setRefresh(!refresh);
                            }
                        }}
                    />
                    <IconButton
                        className={"icon" + (lightTheme ? "" : " dark")}
                        onClick={() => {
                            sendMessage();
                            setRefresh(!refresh);
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default ChatArea;
