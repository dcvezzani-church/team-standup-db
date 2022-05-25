const { DateTime } = require("luxon");

console.log(DateTime.now().minus({days:1}).toFormat('yyyy-MM-dd'))

