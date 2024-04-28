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

export function getScreenDimensions() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 640) {
    return "xs";
  } else if (screenWidth >= 640 && screenWidth < 768) {
    return "sm";
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    return "md";
  } else if (screenWidth >= 1024) {
    return "lg";
  } else {
    return "xl";
  }
}

export function hasMinLength(s, minLength) {
  return s.trim().length >= minLength;
}

const titles = [
  "Appalling",
  "Horrible",
  "Very Bad",
  "Bad",
  "Average",
  "Fine",
  "Good",
  "Very Good",
  "Great",
  "Masterpiece",
];

export function getTitleFromRating(rating) {
  return titles[Number.parseInt(rating * 2) - 1];
}
