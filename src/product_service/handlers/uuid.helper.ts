import { randomBytes } from 'crypto';

export function generateUUID(): string {
    const bytes: Buffer = randomBytes(16);  // Generate 16 random bytes
    // Adjust the 7th byte for 'version'
    bytes[6] &= 0x0f;  // Clear the top 4 bits (version) of the 7th byte
    bytes[6] |= 0x40;  // Set the top 4 bits (version) of the 7th byte to '0100'
    // Adjust the 9th byte for 'variant'
    bytes[8] &= 0x3f;  // Clear the top 2 bits (variant) of the 9th byte
    bytes[8] |= 0x80;  // Set the top 2 bits (variant) of the 9th byte to '10'
    // Convert bytes to hexadecimal string
    const hex: string = bytes.toString('hex');
    // Insert hyphens to make it a UUID format (8-4-4-4-12)
    const uuid: string = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;

    return uuid;
}
