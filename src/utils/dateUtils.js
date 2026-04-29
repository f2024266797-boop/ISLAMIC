import { format, subDays, parseISO, isYesterday, isToday } from 'date-fns';

export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export const getYesterdayKey = () => format(subDays(new Date(), 1), 'yyyy-MM-dd');

export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'EEEE, d MMMM yyyy');
};

export const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
