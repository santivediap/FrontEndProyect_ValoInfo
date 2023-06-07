if(document.getElementById("main-container") != undefined) {
  let basicUserDataSection = document.createElement("section")
  basicUserDataSection.className = "basicuserdata-container"

  getSearchedUserData(JSON.parse(localStorage.search))
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

  document.getElementById("main-container").appendChild(basicUserDataSection)
}

if(document.getElementById("search-button") != undefined) {
  document.getElementById("search-button")
  .addEventListener("click", (ev) => {
      ev.preventDefault()
  
      let submitButton = document.getElementById("player-search")
  
      // Search validation
  
      if(/^([a-zA-Z0-9]+)#([A-Z0-9]+)_(eu|na|ap|kr)$/gm.test(submitButton.value)) {
          let arraySearch = [.../^([a-zA-Z0-9]+)#([A-Z0-9]+)_(eu|na|ap|kr)$/gm.exec(submitButton.value)]
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

async function getSearchedUserData(user) {
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