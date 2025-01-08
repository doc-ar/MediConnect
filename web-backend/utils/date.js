function currentDate() {
  const date = new Date();

  // Extract parts of the date
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" }); // Abbreviated month name
  const day = String(date.getDate()).padStart(2, "0"); // Ensures 2-digit day

  // Format as 'YYYY-Mon-DD'
  return `${year}-${month}-${day}`;
}

export { currentDate };
