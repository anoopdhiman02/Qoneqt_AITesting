import moment from "moment";

export const formatTime = (dateString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(dateString)
  //@ts-ignore
    .toLocaleTimeString("en-US", options)
    .toUpperCase();
};

export const checkIsExistTime = (dateString) => {
  const timestamp = new Date(dateString);

// Get current UTC time
const now = new Date();

// Calculate 30 minutes ago
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

// Check if timestamp is greater than 30 minutes ago
const isWithinLast30Minutes = timestamp > thirtyMinutesAgo;
return isWithinLast30Minutes;
};

export const formatNotificationDate = (dateString) => {
  const now: any = new Date();
  const targetDate: any = new Date(dateString);

  // Remove time for comparison
  now.setHours(0,0,0,0);
  targetDate.setHours(0,0,0,0);

  const diffDays = Math.floor((targetDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return moment.utc(dateString).utcOffset("+05:30").format("h:mm A");
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays === -1) {
    return "Yesterday";
  } else if (diffDays > 1 && diffDays < 7) {
    // Show day of the week (e.g., Monday, Tuesday)
    return targetDate.toLocaleDateString(undefined, { weekday: 'long' });
  } else {
    // Show the date in your preferred format
    return targetDate.toLocaleDateString();
  }
}

