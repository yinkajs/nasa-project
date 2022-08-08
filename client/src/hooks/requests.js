
const API_URL = 'http://localhost:5000';

// TODO: Once API is ready.
async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${API_URL}/launches`)
  const launchedFlight = await response.json()
  return launchedFlight.sort((a, b) => {
    return a.flightNumber - b.flightNumber // 101 - 105 ===> negative (ascending)
  })
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      //Launch defaults to Object, so convert to valid JSON string
      body: JSON.stringify(launch),
    })
  } catch (err) {
    return {
      ok: false
    }
  }

}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    })
  } catch (err) {
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};