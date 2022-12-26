import { app } from '../app.mjs'

export const passReq = (req, res, next) => {
    res.locals.req = req;
    next();
};
