const { faker } = require('@faker-js/faker');
const { DateTime } = require("luxon");
const fs = require('fs')

const BE_BRIEF = (process.env.BE_BRIEF == 'true')

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const TEAM_MEMBER_COUNT = 3
const teamMembers = [...Array(TEAM_MEMBER_COUNT).keys()].map((id) => {
  return {
    id: id+1,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    description: faker.lorem.paragraph(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    avatar: faker.image.avatar()
  }
})

const teamMemberIds = [...Array(TEAM_MEMBER_COUNT).keys()].map(idx => idx+1)

const DAY_HISTORY_COUNT = (BE_BRIEF) ? 5 : 35
let datestamp = DateTime.now().minus({days:DAY_HISTORY_COUNT})
const prayerHistory = [...Array(DAY_HISTORY_COUNT).keys()].map((id) => {

  let _datestamp = datestamp.toFormat('yyyy-MM-dd')
  datestamp = datestamp.plus({days:1})
  const teamMemberId = Math.floor(Math.random() * teamMemberIds.length) + 1;

  return {
    id: id+1,
    date: _datestamp,
    teamMemberId,
  }
})

const activitiesCounts = (BE_BRIEF) ? [1, 2] : [1, 2, 2, 3, 4]
const activitiesCount = () => { Math.floor(Math.random() * activitiesCounts.length) + 1; };

datestamp = DateTime.now().minus({days:DAY_HISTORY_COUNT})
const statusReportHistory = [...Array(DAY_HISTORY_COUNT).keys()].map((id) => {

  let _datestamp = datestamp.toFormat('yyyy-MM-dd')
  datestamp = datestamp.plus({days:1})

  let activityId = 1;
  const teamActivities = [...Array(TEAM_MEMBER_COUNT).keys()].map((id) => {
    // const ACTIVITIES_COUNT = 4;
    
    const activities = {
      yesterday: [...Array(activitiesCount()).keys()].map((id) => {
        return {
          id: activityId++,
          description: faker.lorem.lines(1),
          scope: 'yesterday',
          hoursWorked: 1,
        }
      }),
      today: [...Array(activitiesCount()).keys()].map((id) => {
        return {
          id: activityId++,
          description: faker.lorem.lines(1),
          scope: 'today',
          hoursEstimated: 1,
        }
      }),
    }

    return {
      id: id+1,
      teamMemberId: id+1,
      activities: [...activities.yesterday, ...activities.today],
    }
  })

  return {
    id: id+1,
    date: _datestamp,
    teamActivities, 
  }
})

const vacationDays = (BE_BRIEF) ? shuffle([1, 2]) : shuffle([1, 1, 2, 2, 3, 3, 4, 4, 13, 9, 7])
let vacationPlanId = 1
let _datestamp = DateTime.now()
let _vacationDays = JSON.parse(JSON.stringify(vacationDays))

VACATION_DAYS_COUNT = (BE_BRIEF) ? 3 : 12
const vacationPlans = [...Array(VACATION_DAYS_COUNT).keys()].map((id) => {
  const teamMemberId = Math.floor(Math.random() * teamMemberIds.length) + 1;
  if (_vacationDays.length === 0) _vacationDays = JSON.parse(JSON.stringify(vacationDays))
  return {
    id: vacationPlanId++,
    teamMemberId,
    date: _datestamp.plus({days:_vacationDays.pop(),}).toFormat('yyyy-MM-dd')
  }
})

if (BE_BRIEF) {
  const db = {teamMembers, prayerHistory, statusReportHistory, vacationPlans};
  console.log(JSON.stringify(db, null, 2))
  fs.writeFileSync(`./db.json`, JSON.stringify(db, null, 2))

} else {
  fs.writeFileSync(`./teamMembers.json`, JSON.stringify(teamMembers, null, 2))
  fs.writeFileSync(`./prayerHistory.json`, JSON.stringify(prayerHistory, null, 2))
  fs.writeFileSync(`./statusReportHistory.json`, JSON.stringify(statusReportHistory, null, 2))
  fs.writeFileSync(`./vacationPlans.json`, JSON.stringify(vacationPlans, null, 2))
}

/*
https://raw.githubusercontent.com/dcvezzani-church/prayer-scheduler/main/teamMembers.json
https://raw.githubusercontent.com/dcvezzani-church/prayer-scheduler/main/prayerHistory.json
https://raw.githubusercontent.com/dcvezzani-church/prayer-scheduler/main/statusReportHistory.json
https://raw.githubusercontent.com/dcvezzani-church/prayer-scheduler/main/vacationPlans.json
 * */
