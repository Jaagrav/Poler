import React, { useState, useEffect, useRef } from 'react'
import { useHistory, Link } from 'react-router-dom'
import firebase from './FirebaseSDK'
import ShareBtn from './ShareBtn.png'
import CopyBtn from './CopyBtn.png'
import AddPollBtn from './AddPollBtn.png'
import toastr from 'toastr'

function Result(props) {
    const pollID = props.match.params.id;
    let history = useHistory();
    let totalVotes = 0;
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
        firebaseRef.child("totalVotes").once("value").then(snap => {
            totalVotes = snap.val();
            firebaseRef.child("options").on("child_added", snap => {
                console.log(snap.val())
                setOptions(prevOptions => [...prevOptions, snap.key]);
                document.getElementsByName(snap.key)[0].style.width = snap.val() / totalVotes * 100 + "%";
                document.getElementsByName("span" + snap.key)[0].textContent = Math.round(snap.val() / totalVotes * 100) + "%";
            })
        })
        firebaseRef.on("child_changed", snap => {
            console.log(snap.key)
            if (snap.key === "totalVotes") {
                console.log("Change Detected")
                firebaseRef.child("options").once("value").then(tV => {
                    totalVotes = snap.val();
                    for (let i in tV.val()) {
                        try {
                            document.getElementsByName(i)[0].style.width = tV.val()[i] / totalVotes * 100 + "%";
                            document.getElementsByName("span" + i)[0].textContent = Math.round(tV.val()[i] / totalVotes * 100) + "%";
                        } catch (err) {
                            console.log(err);
                        };
                    }
                })
            }
        })
    }, []);

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
                    <div className="ResultPage">
                        <div className="branding-name">POLER</div>
                        <div className="input-question">{question}</div>
                        <div className="options">
                            {
                                options.map(option => (
                                    <div className="option" key={option}>
                                        <span className="option-name">
                                            {option}
                                        </span>
                                        <div className="progressBar" name={option}></div>
                                        <span className="option-percent" name={"span" + option}>%</span>
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
        </div >
    )
}

export default Result;
