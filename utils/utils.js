export function convertViToEn(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function convertViToEnRemoveSpace(text) {
  return text
    .toLowerCase()
    .normalize("NFD") //return the Unicode Normalization
    .trim()
    .replace(/đ/g, "d") // Replace đ with d
    .replace(/\s+/g, "") // Remove all space
    .replace(/[^\w-!/]+/g, ""); // Remove all non-word chars except /
}
