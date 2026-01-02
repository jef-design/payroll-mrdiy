export const calculateDays = (from: Date, to: Date) => {
  if (!from || !to) return 0;

  // normalize time to avoid timezone issues
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= 0 ? diffDays + 1 : 0; // +1 to include both dates
};
