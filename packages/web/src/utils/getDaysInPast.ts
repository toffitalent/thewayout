export const getDaysInPast = (date: Date) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const dateToCompare = new Date(date).setHours(0, 0, 0, 0);

  const dateDiff = today - dateToCompare;
  const days = Math.ceil(dateDiff / (24 * 60 * 60 * 1000));

  switch (days) {
    case 0:
      return 'today';
    case 1:
      return '1 day ago';
    case 2:
      return '2d ago';
    default:
      return `${days} days ago`;
  }
};
