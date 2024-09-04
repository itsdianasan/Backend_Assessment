import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'backend-accessment-key';
const expiresIn = '1h'; // Token expiry time

export const signToken = (userId: string) => {
    return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};
