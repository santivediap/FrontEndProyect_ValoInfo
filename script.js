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
          window.location.assign("./pages/search.html");
  
      } else {
          let errorMessage = document.getElementById("search-error")
          errorMessage.className = "search-error"
          errorMessage.innerHTML = "Invalid search"
      }
  })
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
    Chart.defaults.font.size = 10;
  
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

paintLeaderboard()