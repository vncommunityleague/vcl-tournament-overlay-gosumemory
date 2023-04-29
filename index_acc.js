// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);

let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let mapid = document.getElementById("mapid");
let axios = window.axios;
let user = {};

// NOW PLAYING
let nowPlayingContainer = document.getElementById("nowPlayingContainer");
let stats = document.getElementById("mapStat");

// TEAM OVERALL SCORE
let teamLeftName = document.getElementById("teamLeftName");
let teamRightName = document.getElementById("teamRightName");

// TEAM PLAYING SCORE
let playingScoreContainer = document.getElementById("playingScoreContainer");
let playScoreLeft = document.getElementById("playScoreLeft");
let playScoreRight = document.getElementById("playScoreRight");
let deltaBarL = document.getElementById("deltaBarL");
let deltaBarR = document.getElementById("deltaBarR");

// Chats
let chats = document.getElementById("chats");

// Avatar
let avaLeft = document.getElementById("avatarLeft");
let avaRight = document.getElementById("avatarRight");
let avaSet = 0;

// State Toggler
let toGameplay = document.getElementById("toGameplay");
let toPool = document.getElementById("toPool");
// let toPoolB = document.getElementById("toPoolB");
let refresh = document.getElementById("refreshiFrame");
let overlayState = 0; // 0 = Gameplay, 1 = BanPick
let tempOverlayState = 0;

// Main
let main = document.getElementById("main");

socket.onopen = () => {
    console.log("Successfully Connected");
};

let animation = {
    playScoreLeft: new CountUp("playScoreLeft", 0, 0, 0, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
    }),
    playScoreRight: new CountUp("playScoreRight", 0, 0, 0, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
    }),
    accLeft: new CountUp("playScoreLeft", 0, 0, 2, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "%",
    }),
    accRight: new CountUp("playScoreRight", 0, 0, 2, 0.2, {
        useEasing: true,
        useGrouping: true,
        separator: " ",
        decimal: ".",
        suffix: "%",
    }),
};

socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
};

socket.onerror = (error) => {
    console.log("Socket Error: ", error);
};

let bestOfTemp;
let scoreVisibleTemp;
let starsVisibleTemp;

let tempMapID, tempImg, tempMapArtist, tempMapTitle, tempMapDiff, tempMapper;
let tempSR, tempCS, tempAR, tempOD, tempHP, tempLength, tempBPM;

let scoreLeftTemp, scoreRightTemp;

let playScoreLeftTemp, playScoreRightTemp, leftOffset, rightOffset, deltaScore;

let teamNameLeftTemp, teamNameRightTemp, team1, team2;

let gameState;

let chatLen = 0;
let tempClass = "unknown";

let scoreLeft = [];
let scoreRight = [];

let mappoolSetup = 0;

let tournamentDebugger = 0;
let tempTournamentDebugger;

let teamSize;
let maximumDelta;

let leftScoreWidth, rightScoreWidth;

let integratedMappool = 0;
let tempIntegratedMappool;

toMins = (time) => {
    let minutes = time.getUTCMinutes() >= 10 ? time.getUTCMinutes() : "0" + time.getUTCMinutes();
    let seconds = time.getUTCSeconds() >= 10 ? time.getUTCSeconds() : "0" + time.getUTCSeconds();
    return minutes + ":" + seconds;
};

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    setTimeout(() => {
        if (!mappoolSetup) {
            mappoolSetup = 1;
            iFrameInitiate();
        }
    }, 1000);
    if (
        scoreVisibleTemp !== data.tourney.manager.bools.scoreVisible ||
        tempOverlayState !== overlayState ||
        tempTournamentDebugger !== tournamentDebugger
    ) {
        tempTournamentDebugger = tournamentDebugger;
        if (tournamentDebugger === 0) scoreVisibleTemp = data.tourney.manager.bools.scoreVisible;
        else scoreVisibleTemp = true;
        tempOverlayState = overlayState;
        if (scoreVisibleTemp === true) {
            // Score visible -> Set bg bottom to full
            chats.style.width = "0px";
            playingScoreContainer.style.opacity = 1;
            deltaBarL.style.opacity = 1;
            deltaBarR.style.opacity = 1;
            nowPlayingContainer.className = "nowPlayingInMatch";
        } else if (scoreVisibleTemp === false) {
            // Score invisible -> Set bg to show chats
            if (tempOverlayState === 0) {
                chats.style.width = "930px";
                chats.style.transform = `none`;
                playingScoreContainer.style.opacity = 0;
                deltaBarL.style.opacity = 0;
                deltaBarR.style.opacity = 0;
                nowPlayingContainer.className = "nowPlayingWaiting";
                stats.className = "shown";
                // main.style.backgroundImage = "var(--bg2)";
            } else if (tempOverlayState === 1) {
                chats.style.transform = `translateX(${(1920 - 930) / 2}px)`;
                nowPlayingContainer.className = "nowPlayingWaiting hidden";
                stats.className = "hidden";
                // main.style.backgroundImage = "var(--mp-bg2)";
            }
        }
    }
    if (starsVisibleTemp !== data.tourney.manager.bools.starsVisible) {
        starsVisibleTemp = data.tourney.manager.bools.starsVisible;
        if (starsVisibleTemp) {
            document.getElementById("scoreContainerLeft").style.opacity = "1";
            document.getElementById("scoreContainerRight").style.opacity = "1";
        } else {
            document.getElementById("scoreContainerLeft").style.opacity = "0";
            document.getElementById("scoreContainerRight").style.opacity = "0";
        }
    }
    if (tempImg !== data.menu.bm.path.full) {
        tempImg = data.menu.bm.path.full;
        data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27");
        nowPlayingContainer.style.backgroundImage = `url('http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}')`;
    }
    if (tempMapID !== data.menu.bm.id || tempSR !== data.menu.bm.stats.fullSR || tempLength !== data.menu.bm.time.full) {
        tempMapID = data.menu.bm.id;
        tempMapArtist = data.menu.bm.metadata.artist;
        tempMapTitle = data.menu.bm.metadata.title;
        tempMapDiff = data.menu.bm.metadata.difficulty;
        tempMapper = data.menu.bm.metadata.mapper;

        tempCS = data.menu.bm.stats.CS;
        tempAR = data.menu.bm.stats.AR;
        tempOD = data.menu.bm.stats.OD;
        tempHP = data.menu.bm.stats.HP;
        tempSR = data.menu.bm.stats.fullSR;
        tempLength = data.menu.bm.time.full;
        let convertedLength = new Date(tempLength);
        convertedLength = toMins(convertedLength);

        tempBPM = data.menu.bm.stats.BPM.max;
        if (data.menu.bm.stats.BPM.max !== data.menu.bm.stats.BPM.min) tempBPM = `${data.menu.bm.stats.BPM.min} - ${data.menu.bm.stats.BPM.max}`;

        mapName.innerHTML = tempMapArtist + " - " + tempMapTitle;
        mapDifficulty.innerHTML = `Difficulty: <span style="font-weight: 700">${tempMapDiff}</span>`;
        mapCreator.innerHTML = `Mapper: <span style="font-weight: 700">${tempMapper}</span>`;
        mapIndex.innerHTML = `CS: <span style="font-weight: 700">${tempCS}</span> / AR: <span style="font-weight: 700">${tempAR}</span> / OD: <span style="font-weight: 700">${tempOD}</span> / HP: <span style="font-weight: 700">${tempHP}</span></br>Star Rating: <span style="font-weight: 700">${tempSR}*</span>`;
        mapTime.innerHTML = `Length: <span style="font-weight: 700">${convertedLength}</span></br>BPM: <span style="font-weight: 700">${tempBPM}</span>`;

        setTimeout(() => {
            togglePool(false);
        }, 7270);
    }
    if (bestOfTemp !== data.tourney.manager.bestOF) {
        bestOfTemp = data.tourney.manager.bestOF;
        containerLeft = document.getElementById("scoreContainerLeft");
        containerRight = document.getElementById("scoreContainerRight");
        containerLeft.innerHTML = "";
        containerRight.innerHTML = "";
        for (var counter = 0; counter < Math.ceil(bestOfTemp / 2); counter++) {
            scoreLeft[counter] = document.createElement("div");
            scoreLeft[counter].id = `scoreLeft${counter}`;
            scoreLeft[counter].setAttribute("class", "scoreLeft");
            containerLeft.appendChild(scoreLeft[counter]);

            scoreRight[counter] = document.createElement("div");
            scoreRight[counter].id = `scoreRight${counter}`;
            scoreRight[counter].setAttribute("class", "scoreRight");
            containerRight.appendChild(scoreRight[counter]);
        }
    }
    if (scoreLeftTemp !== data.tourney.manager.stars.left) {
        scoreLeftTemp = data.tourney.manager.stars.left;
        for (var i = 0; i < Math.ceil(bestOfTemp / 2); i++) {
            if (i < scoreLeftTemp) {
                scoreLeft[i].style.backgroundColor = "#fff";
            } else if (i >= scoreLeftTemp) {
                scoreLeft[i].style.backgroundColor = "rgba(255 255 255 / .5)";
            }
        }
    }

    if (scoreRightTemp !== data.tourney.manager.stars.right) {
        scoreRightTemp = data.tourney.manager.stars.right;
        for (var i = 0; i < Math.ceil(bestOfTemp / 2); i++) {
            if (i < scoreRightTemp) {
                scoreRight[Math.ceil(bestOfTemp / 2) - 1 - i].style.backgroundColor = "#fff";
            } else if (i >= scoreRightTemp) {
                scoreRight[Math.ceil(bestOfTemp / 2) - 1 - i].style.backgroundColor = "rgba(255 255 255 / .5)";
            }
        }
    }

    if (team1 !== data.tourney.manager.teamName.left && team2 !== data.tourney.manager.teamName.right) {
        if (data.tourney.manager.teamName.left !== "" && data.tourney.manager.teamName.right !== "" && tournamentDebugger === 0) {
            team1 = data.tourney.manager.teamName.left;
            team2 = data.tourney.manager.teamName.right;
        } else {
            team1 = "";
            team2 = "";
        }
        avaSet = 0;
    }

    if (teamNameLeftTemp !== data.tourney.manager.teamName.left) {
        teamNameLeftTemp = data.tourney.manager.teamName.left;
        teamLeftName.innerHTML = teamNameLeftTemp;
    }
    if (teamNameRightTemp !== data.tourney.manager.teamName.right) {
        teamNameRightTemp = data.tourney.manager.teamName.right;
        teamRightName.innerHTML = teamNameRightTemp;
    }

    if (!avaSet && tournamentDebugger === 0) {
        avaSet = 1;
        // setAvatar(avaLeft, team1);
        // setAvatar(avaRight, team2);
    }

    if (scoreVisibleTemp) {
        let accLeft = 0.0;
        let accRight = 0.0;

        if (tournamentDebugger === 0) {
            teamSize = data.tourney.ipcClients.length / 2;

            data.tourney.ipcClients.forEach((client) => {
                switch (client.team) {
                    case "left":
                        accLeft += client.gameplay.accuracy;
                        break;
                    case "right":
                        accRight += client.gameplay.accuracy;
                        break;
                    default:
                        return;
                }
            });

            playScoreLeftTemp = accLeft / teamSize;
            playScoreRightTemp = accRight / teamSize;
            // maximumDelta = teamSize * 1000000;
            maximumDelta = 100;
        } else {
            teamSize = 1;
            maximumDelta = 100;
        }

        deltaScore = playScoreRightTemp - playScoreLeftTemp;

        animation.accLeft.update(playScoreLeftTemp);
        animation.accRight.update(playScoreRightTemp);

        leftScoreWidth = parseInt(getComputedStyle(playScoreLeft).width);
        rightScoreWidth = parseInt(getComputedStyle(playScoreRight).width);

        leftOffset = -Math.sqrt(Math.abs((deltaScore / maximumDelta) * (960 - leftScoreWidth) * (960 - leftScoreWidth)));
        rightOffset = Math.sqrt((deltaScore / maximumDelta) * (960 - rightScoreWidth) * (960 - rightScoreWidth));

        // console.log(rightOffset);

        if (playScoreLeftTemp > playScoreRightTemp) {
            // Left is Leading
            playScoreLeft.className = "leadingScore";
            playScoreRight.className = "normalScore";
            if (-leftOffset >= leftScoreWidth / 2) {
                if (-leftOffset < 960 - leftScoreWidth) playScoreLeft.style.transform = `translateX(${leftOffset + leftScoreWidth / 2}px)`;
                else playScoreLeft.style.transform = `translateX(-${960 - leftScoreWidth}px)`;
            } else playScoreLeft.style.transform = `translateX(0)`;
            playScoreRight.style.transform = `translateX(0)`;
            deltaBarL.style.width = `${-leftOffset}px`;
            deltaBarR.style.width = 0;
        } else if (playScoreLeftTemp === playScoreRightTemp) {
            // Tie
            playScoreLeft.className = "normalScore";
            playScoreRight.className = "normalScore";
            playScoreLeft.style.transform = `translateX(0)`;
            playScoreRight.style.transform = `translateX(0)`;
            deltaBarL.style.width = 0;
            deltaBarR.style.width = 0;
        } else {
            // Right is Leading
            playScoreRight.className = "leadingScore";
            playScoreLeft.className = "normalScore";
            playScoreLeft.style.transform = `translateX(0)`;
            if (rightOffset >= rightScoreWidth / 2)
                if (rightOffset < 960 - rightScoreWidth) playScoreRight.style.transform = `translateX(${rightOffset - rightScoreWidth / 2}px)`;
                else playScoreRight.style.transform = `translateX(${960 - rightScoreWidth}px)`;
            else playScoreRight.style.transform = `translateX(0)`;
            deltaBarL.style.width = 0;
            deltaBarR.style.width = `${rightOffset}px`;
        }
    }

    if (data.tourney.manager.chat)
        if (chatLen != data.tourney.manager.chat.length) {
            // There's new chats that haven't been updated
            // console.log((data.tourney.manager.chat).length);
            if (chatLen == 0 || (chatLen > 0 && chatLen > data.tourney.manager.chat.length)) {
                // Starts from bottom
                chats.innerHTML = "";
                chatLen = 0;
            }

            // Add the chats
            for (var i = chatLen; i < data.tourney.manager.chat.length; i++) {
                tempClass = data.tourney.manager.chat[i].team;

                // Chat variables
                let chatParent = document.createElement("div");
                chatParent.setAttribute("class", "chat");

                let chatTime = document.createElement("div");
                chatTime.setAttribute("class", "chatTime");

                let chatName = document.createElement("div");
                chatName.setAttribute("class", "chatName");

                let chatText = document.createElement("div");
                chatText.setAttribute("class", "chatText");

                chatTime.innerText = data.tourney.manager.chat[i].time;
                chatName.innerText = data.tourney.manager.chat[i].name + ":\xa0";
                chatText.innerText = data.tourney.manager.chat[i].messageBody;

                if (data.tourney.manager.chat[i].messageBody.includes("Next Pick")) togglePool(true);

                chatName.classList.add(tempClass);

                chatParent.append(chatTime);
                chatParent.append(chatName);
                chatParent.append(chatText);
                chats.append(chatParent);
            }

            // Update the Length of chat
            chatLen = data.tourney.manager.chat.length;

            // Update the scroll so it's sticks at the bottom by default
            chats.scrollTop = chats.scrollHeight;
        }
};

async function iFrameInitiate() {
    let mappoolPicker = document.createElement("iframe");
    mappoolPicker.setAttribute("src", `./mappool`);
    mappoolPicker.setAttribute("frameBorder", "0");
    mappoolPicker.setAttribute("name", `picker`);
    mappoolPicker.className = "mappoolPicker";

    document.body.appendChild(mappoolPicker);
}

toGameplay.addEventListener("click", () => {
    togglePool(false);
});

toPool.addEventListener("click", () => {
    togglePool(true);
});

// toPoolB.addEventListener("click", () => {
//     togglePool("2");
// });

refresh.addEventListener("click", () => {
    [].forEach.call(document.querySelectorAll("[name*=picker]"), (ifr) => {
        ifr.contentWindow.location.reload(true);
    });
    togglePool(true);
});

togglePool = (state) => {
    if (state) {
        overlayState = 1;

        let ifr = document.getElementsByName(`picker`)[0];
        ifr.style.opacity = 1;

        // [].forEach.call(document.querySelectorAll("[name*=picker]"), (ele) => {
        //     ele.style.clipPath = "inset(0px 0px 0px 1920px)";
        // });

        let playArea = document.getElementById("playArea");
        playArea.style.clipPath = "inset(0px 0px 0px 0px)";

        setTimeout(() => {
            ifr.style.clipPath = "inset(0px 0px 0px 0px)";
        }, 500);
    } else {
        overlayState = 0;

        let playArea = document.getElementById("playArea");
        playArea.style.clipPath = "inset(0px 0px 0px 1920px)";

        [].forEach.call(document.querySelectorAll("[name*=picker]"), (ele) => {
            ele.style.clipPath = "inset(0px 0px 0px 1920px)";
        });
    }
};
