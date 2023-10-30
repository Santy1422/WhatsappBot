import crypto from 'crypto';

export default function (): string {
    return crypto.randomBytes(16).toString('hex');
}
