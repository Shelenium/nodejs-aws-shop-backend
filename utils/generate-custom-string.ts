export function generateCustomString(length: number, includeNumbers: boolean = false): string {
  const alphabet = 'AB CDE FGH IJKLMN OPQRST UVWXYZ abcde fghijk lmnop qrstu vwxyzc ';
  const numbers = '0123456789';
  const validChars = alphabet + (includeNumbers ? numbers : '');

  let customString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      customString += validChars[randomIndex];
  }

  return customString;
}
