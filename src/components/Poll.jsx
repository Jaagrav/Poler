import React, { useState, useEffect, useRef } from 'react'
import { useHistory, Link } from 'react-router-dom'
import firebase from './FirebaseSDK'
import ShareBtn from './ShareBtn.png'
import CopyBtn from './CopyBtn.png'
import AddPollBtn from './AddPollBtn.png'
import toastr from 'toastr'


function Poll(props) {
    const pollID = props.match.params.id;
    let history = useHistory();
    const firebaseRef = firebase.database().ref("Poler/Polls/" + pollID);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([]);
    let shareData = useRef();

    useEffect(() => {
        firebaseRef.child("question").once("value").then(snap => {
            shareData.current = {
                title: 'Poler - ' + snap.val(),
                text: snap.val(),
                url: 'https://poler.netlify.app/Poll/' + pollID,
            }
            setQuestion(snap.val());
        })
        firebaseRef.child("options").on("child_added", snap => {
            setOptions(prevOptions => [...prevOptions, snap.key])
        })
    }, []);

    function castVote(e) {
        let option = e.target.textContent;
        document.querySelector(".container").style.display = "none";
        firebaseRef.child("options").child(option).once("value").then(snap => {
            firebaseRef.child("options").child(option).set(parseInt(snap.val() + 1));
            firebaseRef.child("totalVotes").once("value").then(snap => {
                firebaseRef.child("totalVotes").set(parseInt(snap.val() + 1)).then(() => {
                    history.push("/Results/" + pollID)
                });
            })
        })
    }

    function copyLink(e) {
        console.log("Copy Link")
        toastr.success('Link Copied!')
        const copyTxt = document.createElement("input");
        copyTxt.value = "https://poler.netlify.app/Poll/" + pollID;
        document.body.parentNode.appendChild(copyTxt);
        copyTxt.select();
        document.execCommand("copy")
        document.body.parentNode.removeChild(copyTxt);
    }

    function sharePoll() {
        navigator.share(shareData.current)
    }
    return (
        <div>
            <div className="container">
                <center>
                    <div className="PollPage">
                        <div className="branding-name">POLER</div>
                        <div className="input-question">{question}</div>
                        <div className="options">
                            {
                                options.map(option => (
                                    <div className="option" key={option} onClick={castVote}>
                                        <div>
                                            {option}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="functional-btns-ex">
                            <div className="addBtn">
                                <img src={ShareBtn} onClick={sharePoll} />
                                <div className="tooltip">Share Poll</div>
                            </div>
                            <div className="submitBtn">
                                <img src={CopyBtn} onClick={copyLink} />
                                <div className="tooltip">Copy Poll Link</div>
                            </div>
                            <Link to="/AddPoll">
                                <div className="addPollBtn">
                                    <img src={AddPollBtn} />
                                    <div className="tooltip">Create New Poll</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </center>
            </div>
        </div>
    )
}

export default Poll;
