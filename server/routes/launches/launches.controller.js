const {
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchbyId,
    scheduleNewLaunch
} = require('../../src/models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target) {
        return res.status(400).json({
            error: "Missing required launch properties"
        })
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid launch Date"
        })
    }

    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    const existsLaunch = await existsLaunchWithId(launchId);

    if (!existsLaunch) {
        return res.status(404).json({
            error: "Launch not found"
        })
    }

    const aborted = await abortLaunchbyId(launchId)

    if (!aborted) {
        return res.status(404).json({
            error: "Launch not aborted"
        })
    }
    return res.status(200).json({
        acknowledged : true
    })
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};