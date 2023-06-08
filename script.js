if(localStorage.search) {
  getSearchedBasicUserData(JSON.parse(localStorage.search))
  .then(res => {
    if(res == "error") {
      if(document.getElementById("main-container") != undefined) {
        let errorSearchSection = document.createElement("section")
        errorSearchSection.className = "error-search-container"
  
        errorSearchSection.innerHTML = `
        <h2>PLAYER NOT FOUND</h2>
        <img src="https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_1280.png" alt="error-img">`
  
        document.getElementById("main-container")
        .appendChild(errorSearchSection)
      }
    } else {
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
          `
      
        let matchHistoryContainer = document.createElement("article")
        matchHistoryContainer.className = "match-history-container"
      
        document.querySelector(".match-history-general-container")
        .appendChild(matchHistoryContainer)
      
        for(let i = 0; i < res.length; i++) {
      
        const matchDiv = document.createElement("div")
        matchDiv.className = "match"
        matchDiv.setAttribute("id", i)
      
        matchDiv.innerHTML = `
        <h2>${res[i][1]}</h2>
        <div class="match-history-map-container">
            <div class="map">
                <img src=${res[i][6]} alt="map">
            </div>
            
            <div class="map-info">
                <h2>Map: ${res[i][0]}</h2>
                <p>Mode: ${res[i][2]}</p>
                <p>Rounds: ${res[i][3]}</p>
                <p>Server: ${res[i][4]}</p>
            </div>
        </div>`
      
        let matchPlayersContainer = document.createElement("div")
        matchPlayersContainer.className = "match-players-container"
        matchPlayersContainer.setAttribute("id", i)
      
        matchDiv.appendChild(matchPlayersContainer)
      
        matchHistoryContainer.appendChild(matchDiv)
      
        // const playersContainer = document.getElementById(i)
      
        let playersAgents = [];
        
        res[i][5].forEach(player => {
          playersAgents.push(player.character)
        })
      
        getAgentsImages(playersAgents)
        .then(agentsImages => {
          for(let a = 0; a < res[i][5].length; a++) {
            let player = document.createElement("div")
            player.className = "player-card";
      
            let iteration = res[i][5][a];
            
            player.innerHTML = `
                <div class="player-img">
                    <img src=${agentsImages[a]} alt="agent-image">
                </div>
        
                <div class="player-name">
                    <span class="content-text">${iteration.name}#${iteration.tag}</span>
                </div>
        
                <div class="player-kills">
                    <span class="header-text">K</span>
                    <span class="content-text">${iteration.stats.kills}</span>
                </div>
        
                <div class="player-deaths">
                    <span class="header-text">D</span>
                    <span class="content-text">${iteration.stats.deaths}</span>
                </div>
        
                <div class="player-assists">
                    <span class="header-text">A</span>
                    <span class="content-text">${iteration.stats.assists}</span>
                </div>
        
                <div class="player-points">
                    <span class="header-text">PTS</span>
                    <span class="content-text">${iteration.stats.score}</span>
                </div>
        
                <div class="player-total-economy">
                    <span class="header-text">ECO</span>
                    <span class="content-text">${iteration.economy.spent.average}</span>
                </div>`
        
                matchPlayersContainer.appendChild(player)
          }
        })
      
      
        }})
      
        document.getElementById("main-container").appendChild(basicUserDataSection)
        document.getElementById("main-container").appendChild(matchesUserDataSection)
      }
    }
  })
  .catch(err => console.log(err))
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

async function getAgentsImages(players) {
  try {
    let agentsImages = []
    let agentsImagesFetch = await fetch("https://valorant-api.com/v1/agents")
    let dataAgentsImagesFetch = agentsImagesFetch.json()

    return dataAgentsImagesFetch
    .then(player => {
      for(let i = 0; i < players.length; i++) {
        const filteredAgentImage = player.data.filter(val => val.displayName == players[i])
        agentsImages.push(filteredAgentImage[0].displayIcon)
      }
      return agentsImages
    })
  } catch(error) {
    console.log(error);
  }
}

async function getSearchedBasicUserData(user) {
    let userData = [];

    return await fetch(`https://api.henrikdev.xyz/valorant/v1/account/${user[0]}/${user[1]}`)
    .then(response => {
      if(response.status == 200) {
        return response.json().then(res => {
          userData.push(res.data.region)
          userData.push(res.data.name)
          userData.push(res.data.tag)
          userData.push(res.data.account_level)
          userData.push(res.data.card.large)
          return fetch(`https://api.henrikdev.xyz/valorant/v1/mmr/${user[2]}/${user[0]}/${user[1]}`)
        })
        .then(data => data.json())
        .then(res => {
          if(res.data.elo == null) {
            return "error"
          } else {
            userData.push(res.data.currenttierpatched)
            userData.push(res.data.mmr_change_to_last_game)
            userData.push(res.data.elo)
          }
          return userData
        })
      } else {
        return "error"
      }
    })
    .catch(err => console.log(err))
  }

async function getSearchedMatchesUserData(user) {
  try {
    let matchesData = [];
  
    let basicMatchesDataFetch = await fetch(`https://api.henrikdev.xyz/valorant/v3/matches/${user[2]}/${user[0]}/${user[1]}`)
    let basicMatchesData = basicMatchesDataFetch.json()
    let mapDataFetch = await fetch("https://valorant-api.com/v1/maps")

    return basicMatchesData.then(res => {

      for(let i = 0; i < res.data.length; i++) {
        let matchData = []
        matchesData.push(matchData)

        matchesData[i].push(res.data[i].metadata.map)
        matchesData[i].push(res.data[i].metadata.game_start_patched)
        matchesData[i].push(res.data[i].metadata.mode)
        matchesData[i].push(res.data[i].rounds.length)
        matchesData[i].push(res.data[i].metadata.cluster)
        matchesData[i].push(res.data[i].players.all_players)
      }
      return mapDataFetch
    }).then(data => data.json())
    .then(res => {
      for(let i = 0; i < matchesData.length; i++) {
        const filteredMap = res.data.filter(map => map.displayName == matchesData[i][0])
        matchesData[i].push(filteredMap[0].displayIcon)
      }
      return matchesData
    })
  
  } catch(error) {
    console.log(error);
  }
}

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
    console.log(`ERROR! -> ${error}`)
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