// THIS FUNCTION IS INTENDED TO EXTRACT THE SESSIONS CREATED WITHIN THE CURRENT WEEK
// THE INPUT VARIABLE IS AN ARRAY, WHICH TAKES THE userSessions from useRealtimeDatabaseFunction.js hook
export function filterSessionsByCurrentWeek(userSessions) {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
    const diff = now.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1); // adjust when today is Sunday
  
    const startOfWeek = new Date(now);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
  
    return userSessions.filter(session => {
      const sessionStart = new Date(session.startDateTime);
      return sessionStart >= startOfWeek && sessionStart <= endOfWeek;
    });
  }