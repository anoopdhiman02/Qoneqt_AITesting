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
