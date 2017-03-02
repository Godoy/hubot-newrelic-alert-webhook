// Description
//   A hubot script to get google analytics reports
//
// Configuration:
//   NR_ALERT_ROOM - The default room to which message should go (optional)
//
// Commands:
//   None
//
// Notes:
//   <optional notes required for the script>
//
// URLS:
//   POST /hubot/nr-alert-webhook?room=<room>
//
// Author:
//   Adriano Godoy

var inspect, querystring, url, room;

inspect = (require('util')).inspect;
url = require('url');
querystring = require('querystring');

module.exports = function(robot) {
  return robot.router.post("/hubot/nr-alert-webhook", function(req, res) {
    var data, query, room;
    query = querystring.parse(url.parse(req.url).query);
    data = req.body;

    robot.logger.debug("Received New Relic POST: " + (inspect(data)));
    console.log("Received New Relic POST: " + (inspect(data)));

    room = query.room || process.env["NR_ALERT_ROOM"];
    if (data.alert) {
      var alert = JSON.parse(data.alert);

      try {
        console.log("New relic report: " + (inspect(data)))
        msg = "@all *Attention - alert in " + alert.application_name + "* \n" + alert.short_description
        robot.messageRoom(room, msg);
      } catch (_error) {
        error = _error;
        robot.messageRoom(room, "NR Alert error: " + error);
        console.log("NR Alert error: " + error + ". Request: " + req.body);
      }
    }

    return res.end("");
  });
};
