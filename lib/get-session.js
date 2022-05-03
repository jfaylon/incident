// ./lib/get-session.js
import nextSession from 'next-session';
export const getSession = nextSession({ secret: process.env.SESSION_SECRET, maxAge: null });
