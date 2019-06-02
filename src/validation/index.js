export const ok = x => Promise.resolve(x);

export const bad = message => Promise.reject({ statusCode: 400, message });

export const conflict = message => Promise.reject({ statusCode: 409, message });
