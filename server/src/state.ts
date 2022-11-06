const _state: { [key: string]: any } = {};

export const getState = (name: string) => {
  return _state[name];
};

export const setState = (name: string, value: any) => {
  _state[name] = value;
};
