const REGEXP_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([-+]\d{2}:\d{2}|Z?)?)?$/;

export const isValidDateFormat = str => str.match(REGEXP_DATE);

export const enumToStr = arr => arr.map(s => `'${s}'`).join(', ');

export const zerarHora = m => {
  m.millisecond(0);
  m.second(0);
  m.minute(0);
  m.hour(0);
};

export const proximoDiaUtil = m => {
  //dia seguinte
  m.add(1, 'd');

  // procura um dia util
  while (m.day() === 0 || m.day() === 6) {
    m.add(1, 'd');
  }
};

export const handleErrors = (e, res, next) => {
  if (e.statusCode) {
    res.status(e.statusCode).json(e);
  } else {
    next(e);
  }
};
