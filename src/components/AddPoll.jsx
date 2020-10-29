import React, { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import firebase from './FirebaseSDK'
import deleteKey from './deleteKey.png'
import addBtn from './addBtn.png'
import submitBtn from './submitBtn.png'
import toastr from 'toastr'

function AddPoll(e) {
    let history = useHistory();
    let firebaseRef = firebase.database().ref("Poler/Polls");

    const optionsRef = useRef();
    let opl = 3;

    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    function addOptions() {
        const option = document.createElement("div");
        const input = document.createElement("input");
        const deleteBtn = document.createElement("img");

        option.className = "option op" + parseInt(opl);
        input.className = "input-option";
        input.placeholder = "Edit Option ";
        deleteBtn.className = "deleteKey";
        deleteBtn.src = deleteKey;
        deleteBtn.addEventListener('click', elem => {
            deleteOption(elem);
        });

        optionsRef.current.appendChild(option);
        option.appendChild(deleteBtn);
        option.appendChild(input);
        opl++;
    }

    function deleteOption(elem) {
        if (document.getElementsByClassName("input-option").length > 2) {
            let deleteOpt = elem.target.parentElement.className;
            document.getElementsByClassName(deleteOpt)[0].parentNode.removeChild(document.getElementsByClassName(deleteOpt)[0]);
        } else {
            toastr.warning("Minimum 2 options needed!!!")
        }
    }

    function submitPoll() {
        let pollsArray = [], c = 0;
        for (let i = 0; i < document.getElementsByClassName("input-option").length; i++) {
            if (document.getElementsByClassName("input-option")[i].value.trim() !== "") {
                pollsArray[document.getElementsByClassName("input-option")[i].value] = 0;
                c++;
            }
        }
        console.log(pollsArray, pollsArray.length)
        if (document.querySelector(".input-question").value.trim() !== "" && c > 1) {
            firebaseRef.push({
                question: document.querySelector(".input-question").value.trim(),
                options: pollsArray,
                totalVotes: 0
            }).then(snap => {
                console.log(snap.key)
                history.push("/Poll/" + snap.key)
            })
        }

    }

    return (
        <div>
            <div className="container">
                <center>
                    <div className="AddPollPage">
                        <div className="branding-name">POLER</div>
                        <input type="text" className="input-question" placeholder="Type Question..." />
                        <div ref={optionsRef} className="options">
                            <div className="option op0">
                                <input className="input-option" placeholder="Edit Option" />
                                <img src={deleteKey} className="deleteKey" onClick={(elem) => { deleteOption(elem) }} />
                            </div>
                            <div className="option op1">
                                <input className="input-option" placeholder="Edit Option" />
                                <img src={deleteKey} className="deleteKey" onClick={(elem) => { deleteOption(elem) }} />
                            </div>
                        </div>
                        <div className="functional-btns">
                            <img src={addBtn} className="addBtn" onClick={addOptions} />
                            <img src={submitBtn} className="submitBtn" onClick={submitPoll} />
                        </div>
                    </div>
                </center>
            </div>
        </div>
    )
}

export default AddPoll;
