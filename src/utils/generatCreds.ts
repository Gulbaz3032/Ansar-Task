// export const randomString = (length = 8) => {
//   const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let s = "";
//   for (let i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
//   return s;
// };

// export const generateEmail = (firstName: string, lastName: string) => {
//   const domain = process.env.DEFAULT_EMAIL_DOMAIN || "example.com";
//   const rand = Math.floor(1000 + Math.random() * 9000);
//   const clean = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
//   const email = `${clean(firstName)}.${clean(lastName)}.${rand}@${domain}`;
//   return email;
// };

// export const generateTempPassword = () => {
//   return randomString(10);
// };

export const generateCustomCredentials = (
  firstName: string,
  lastName: string,
  zipcode: string,
  age?: string
) => {
  const f = firstName.toLowerCase().slice(0, 3); // first 3 letters
  const l = lastName.toLowerCase().slice(0, 3);  // first 3 letters
  const z = zipcode.toString().slice(-3);        // last 3 digits of zip
  const a = age ? age.toString().slice(-2) : "00"; // last 2 digits of age

  const randomNum = Math.floor(Math.random() * 900 + 100); // 3-digit random

  const email = `${f}${l}${z}${a}${randomNum}@example.com`;
  const password = `${f}${l}@${z}${randomNum}${a}`;

  return { email, password };
};
