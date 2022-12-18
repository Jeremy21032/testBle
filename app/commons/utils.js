const DATE_SEPARATOR = "/";
const STARTING_UII_KEY = "A000";

export function to2Decimals(value) {
  return (Math.round(value * 100) / 100).toFixed(2);
}
export function generateUIDD(start_key) {
  return (
    STARTING_UII_KEY + Math.random().toString(30).substring(6).toUpperCase()
  );
}
export function getActualDate() {
  const date = new Date();
  return (
    String(date.getDate()).padStart(2, "0") +
    DATE_SEPARATOR +
    String(date.getMonth() + 1).padStart(2, "0") +
    DATE_SEPARATOR +
    date.getFullYear()
  );
}
