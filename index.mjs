// :: functor f -> (a -> f a) -> a -> fix f
const ana = f => coalg => {
  const rec = x => f.map(rec)(coalg(x));
  return rec;
};

const record = {
  // :: (a -> b) -> record a -> record b
  map: f => o => Object.keys(o).reduce((p, k) => ({ ...p, [k]: f(o[k]) }), {})
};

// :: list (list string) -> record (list (list string))
export const unprefix = xs =>
  xs.reduce(
    (p, [prefix, ...suffix]) => ({
      ...p,
      [prefix]: [...(p[prefix] || []), ...(suffix.length ? [suffix] : [])]
    }),
    {}
  );

// :: list (list string) -> fix record
export const nest = ana(record)(unprefix);

export const test = () => {
  // :: list (list string)
  const input = [
    ["1", "1.1", "1.1.1"],
    ["1", "1.2", "1.2.1"],
    ["1", "1.2", "1.2.2"],
    ["2", "2.1"],
    ["3"]
  ];

  console.log(nest(input));
  /*
  {
    '1': {
      '1.1': {
        '1.1.1': {}
      },
      '1.2': {
        '1.2.1': {},
        '1.2.2': {}
      }
    },
    '2': {
      '2.1': {}
    },
    '3': {}
  }
  */
};
