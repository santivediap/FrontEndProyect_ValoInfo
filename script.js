if(document.getElementById("main-container") != undefined) {
  let basicUserDataSection = document.createElement("section")
  basicUserDataSection.className = "basicuserdata-container"

  getSearchedBasicUserData(JSON.parse(localStorage.search))
  .then(res => {
    basicUserDataSection.innerHTML = `
    <h2>${res[1]}#${res[2]}</h2>
    <article class="basicuserdata">
        <div class="playerimg">
            <img src="${res[4]}" alt="${res[1]}#${res[2]}-img">
        </div>
        
        <div class="basicinfo">
            <p>Region: ${res[0]}</p>
            <p>Level: ${res[3]}</p>
            <p>Rank: ${res[5]}</p>
            <p>Elo: ${res[7]}</p>
            <p>Last MMR: ${res[6]}</p>
        </div>
    </article>`
  })

  let matchesUserDataSection = document.createElement("section")
  matchesUserDataSection.className = "match-history-general-container"

  getSearchedMatchesUserData(JSON.parse(localStorage.search))
  .then(res => {
    matchesUserDataSection.innerHTML = `
    <article class="match-history-title-container">
        <h2>MATCH HISTORY</h2>
    </article>

    <article class="match-history-container">
        <div class="match">
            <h2>${res[1]}</h2>
            <div class="match-history-map-container">
                <div class="map">
                    <img src=${res[5]} alt="map">
                </div>
                
                <div class="map-info">
                    <h2>Map: ${res[0]}</h2>
                    <p>Mode: ${res[2]}</p>
                    <p>Rounds: ${res[3]}</p>
                    <p>Server: ${res[4]}</p>
                </div>
            </div>

            <div class="match-players-container">
                <div class="player-card">
                        <div class="player-img">
                            <img src="https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png" alt="agent-image">
                        </div>

                        <div class="player-name">
                            <span class="header-text"></span>
                            <span class="content-text">TTVSantiLMAOOO#9084</span>
                        </div>

                        <div class="player-kills">
                            <span class="header-text">K</span>
                            <span class="content-text">15</span>
                        </div>

                        <div class="player-deaths">
                            <span class="header-text">D</span>
                            <span class="content-text">20</span>
                        </div>

                        <div class="player-assists">
                            <span class="header-text">A</span>
                            <span class="content-text">5</span>
                        </div>

                        <div class="player-points">
                            <span class="header-text">PTS</span>
                            <span class="content-text">1200</span>
                        </div>

                        <div class="player-total-economy">
                            <span class="header-text">ECO</span>
                            <span class="content-text">2000</span>
                        </div>
                </div>
            </div>
            <hr style="width: 100%;">
        </div>
    </article>`
  })

  document.getElementById("main-container").appendChild(basicUserDataSection)
  document.getElementById("main-container").appendChild(matchesUserDataSection)
}

if(document.getElementById("search-button") != undefined) {
  document.getElementById("search-button")
  .addEventListener("click", (ev) => {
      ev.preventDefault()
  
      let submitButton = document.getElementById("player-search")
  
      // Search validation
  
      if(/^([\sa-zA-Z0-9]+)#([a-zA-Z0-9]+)_(eu|na|ap|kr)$/gm.test(submitButton.value)) {
          let arraySearch = [.../^([\sa-zA-Z0-9]+)#([a-zA-Z0-9]+)_(eu|na|ap|kr)$/gm.exec(submitButton.value)]
          arraySearch.shift()
  
          localStorage.search = JSON.stringify(arraySearch)
          window.location.assign("../pages/search.html");
  
      } else {
          let errorMessage = document.getElementById("search-error")
          errorMessage.className = "search-error"
          errorMessage.innerHTML = "Invalid search"
      }
  })
}

async function getSearchedBasicUserData(user) {
  try {
    let userData = [];
  
    let basicUserDataFetch = await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${user[0]}/${user[1]}`)
    let basicUserData = basicUserDataFetch.json()
    let extraUserDataFetch = await fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${user[2]}/${user[0]}/${user[1]}`)

    return basicUserData.then(res => {
      userData.push(res.data.region)
      userData.push(res.data.name)
      userData.push(res.data.tag)
      userData.push(res.data.account_level)
      userData.push(res.data.card.large)
      return extraUserDataFetch
    }).then(data => data.json())
    .then(res => {
      userData.push(res.data.currenttierpatched)
      userData.push(res.data.mmr_change_to_last_game)
      userData.push(res.data.elo)
      return userData
    })
  
  } catch(error) {
    console.log(error);
  }
}

async function getSearchedMatchesUserData(user) {
  try {
    let userData = [];
  
    let basicUserDataFetch = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${user[2]}/${user[0]}/${user[1]}`)
    let basicUserData = basicUserDataFetch.json()
    let mapDataFetch = await fetch("https://valorant-api.com/v1/maps")

    return basicUserData.then(res => {
      // console.log(res.data[0].metadata);
      userData.push(res.data[0].metadata.map)
      userData.push(res.data[0].metadata.game_start_patched)
      userData.push(res.data[0].metadata.mode)
      userData.push(res.data[0].rounds.length)
      userData.push(res.data[0].metadata.cluster)
      return mapDataFetch
    }).then(data => data.json())
    .then(res => {
      const filteredMap = res.data.filter(map => map.displayName == userData[0])
      userData.push(filteredMap[0].displayIcon)
      // console.log(filteredMap[0].displayIcon);
      // userData.push(res.data.elo)
      return userData
    })
  
  } catch(error) {
    console.log(error);
  }
}

getSearchedMatchesUserData(JSON.parse(localStorage.search))
.then(res => {
  console.log(res);
})

function checkUserRegion() {

    let dataTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let region = /([a-zA-Z]+)\//gm.exec(dataTimeZone)[1]

    switch(region) {
        case "Europe":
            return "eu"
        case "America":
            return "na"
        case "Asia":
            return "ap"
        default:
            return "kr"
    }
}

async function getPlayersLeaderboard(region) {
  let result;

  try {
    await fetch(`https://api.henrikdev.xyz/valorant/v1/leaderboard/${region}`)
      .then(data => data.json())
      .then(res => {
        result = res
    })
  return result
  } catch (error) {
    alert(`ERROR! -> ${error}`)
  }
}

async function paintLeaderboard() {
  let players;

  if(document.getElementById('topplayers') != undefined) {
    const ctx = document.getElementById('topplayers')
    Chart.defaults.color = '#fff'
    Chart.defaults.borderColor = '#4b6875'
  
    await getPlayersLeaderboard("eu")
    .then(res => {
      let annonFilteredPlayers = res.filter(val => val.IsAnonymized == false)
      annonFilteredPlayers.splice(10, annonFilteredPlayers.length-10)
      let leaderboard = annonFilteredPlayers.map(val => [`${val.gameName}#${val.tagLine}`, val.numberOfWins])
      players = leaderboard
    })
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        
        labels: players.map(player => player[0]),
        datasets: [{
          label: 'Wins',
          data: players.map(player => player[1]),
          borderColor: '#FF004C',
          backgroundColor: 'rgba(255, 0, 76, 0.5)',
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}

function responsiveLeaderBoardText() {
  if(window.outerWidth < 246) {
    Chart.defaults.font.size = 2;
  }
  else if(window.outerWidth >= 246 && window.outerWidth < 340) {
    Chart.defaults.font.size = 5;
  }
  else if (window.outerWidth > 340 && window.outerWidth < 800) {
    Chart.defaults.font.size = 8;
  }
  else if (window.outerWidth > 800 && window.outerWidth < 1200) {
    Chart.defaults.font.size = 12;
  } else {
    Chart.defaults.font.size = 15;
  }
}

window.addEventListener("resize", () => {
  responsiveLeaderBoardText()
});

paintLeaderboard()