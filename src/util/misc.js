export function capitalize(s) {
  return s[0].toUpperCase() + s.substring(1);
}

export function formatAiredDate(value) {
  let formattedDateString = "";

  const date = new Date(value);

  const day = date.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  const month = date.toLocaleDateString("en-US", {
    month: "long",
  });

  const year = date.toLocaleDateString("en-US", {
    year: "numeric",
  });

  formattedDateString = `${day} ${month}, ${year}`;

  return formattedDateString;
}

export function applyWordLimit(text, wordLimit) {
  const textArray = text.split(" ");
  const wordLimitedText = textArray.slice(0, wordLimit).join(" ");

  return wordLimitedText + (textArray.length > wordLimit ? "..." : "");
}

export function applyCharacterLimit(text, charLimit) {
  return text.substring(0, charLimit) + (text.length > charLimit ? "..." : "");
}
