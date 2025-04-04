import badgeService from "../services/badgeServices";
import flightPlanTaskService from "../services/flightPlanTaskServices";
import userBadgesServices from "../services/userBadgesServices";

async function checkBadgeCompletion(studentInfoId) {
  try {
    var allCount = 0;
    var earnedBages = (await userBadgesServices.getByStudentId(studentInfoId)).data;
    var userCompletedTasks = (await flightPlanTaskService.getFlightPlanTaskByUserId(studentInfoId)).data;
    var userCompletedExperiences = (await flightPlanTaskService.getFlightPlanExperiencesByUserId(studentInfoId)).data;
    var badges = (await badgeService.getAllBadges()).data;
  } catch (error) {
    console.log(error)
  }
  if (earnedBages)
    badges = badges.filter((item) =>
      earnedBages.some((item2) => item.id === item2.badgeId)
    );
if(userCompletedTasks){
    userCompletedTasks = userCompletedTasks.filter((item) => item.completed === 1).length
    allCount += userCompletedTasks
}
if(userCompletedExperiences){
    userCompletedExperiences = userCompletedExperiences.filter((item) => item.completed === 1).length
    allCount += userCompletedExperiences
}
  badges.forEach((badge) => {
    if (badge.allCount) badgeAllCountCheck(badge, studentInfoId, allCount);
    if (badge.experiencesCount)
      checkExperienceCount(
        badge,
        studentInfoId,
        userCompletedExperiences.data.length
      );
    if (badge.tasksCount)
      checkTaskCount(badge, studentInfoId, userCompletedTasks.data.length);
  });
}
  const allCount = 
  badges.forEach((badge) => {
    if (badge.allCount) badgeAllCountCheck(badge, studentInfoId, allCount);
    if (badge.experiencesCount)
      checkExperienceCount(
        badge,
        studentInfoId,
        userCompletedExperiences.data.length
      );
    if (badge.tasksCount)
      checkTaskCount(badge, studentInfoId, userCompletedTasks.data.length);
  });

function badgeAllCountCheck(badge, studentInfoId, allCount) {
  if (badge.allCount <= allCount) {
    userBadgesServices.createStudentBadge({
      studentInfoId: studentInfoId,
      badgeId: badge.id,
      createStudentBadge: new Date(),
    });
  }
}
function checkTaskCount(badge, studentInfoId, tasksCount) {
  if (badge.tasksCount <= tasksCount) {
    userBadgesServices.createStudentBadge({
      studentInfoId: studentInfoId,
      badgeId: badge.id,
      createStudentBadge: new Date(),
    });
  }
}
function checkExperienceCount(badge, studentInfoId, experiencesCount) {
  if (badge.experiencesCount <= experiencesCount) {
    userBadgesServices.createStudentBadge({
      studentInfoId: studentInfoId,
      badgeId: badge.id,
      createStudentBadge: new Date(),
    });
  }
}

export default checkBadgeCompletion;
