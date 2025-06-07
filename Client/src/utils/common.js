export const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
export const getTodaysDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  return formattedDate
}

