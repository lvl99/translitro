/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
interface POJO {
  [key: string]: any;
}

/**
 * Get around TS error
 */
export const get = (obj: POJO, key: string): any =>
  obj.hasOwnProperty(key) ? obj[key] : undefined;

/**
 * Checks if input is a plain old JavaScript object (POJO).
 */
export const isPojo = (obj: any): boolean => {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
};

/**
 * Applies a function to the input.
 *
 * If the input is an array or a POJO (plain old JavaScript object) then
 * it will apply the function to its child values/properties, going as
 * deep until it hits a primitive non-object type.
 */
export const applyFnTo = (
  input: any,
  fn: (input: any, ...props: any[]) => any,
  ...props: any[]
): any => {
  if (input instanceof Array) {
    return input.map((i) => applyFnTo(i, fn, ...props));
  } else if (isPojo(input)) {
    const output: POJO = {};
    Object.entries<any>(input).forEach(([key, value]: [string, any]) => {
      output[key] = applyFnTo(value, fn, ...props);
    });
    return output;
  } else {
    return fn(input, ...props);
  }
};

/**
 * Same as applyFnTo, but handles asynchronise functions and returns as promises.
 */
export const asyncApplyFnTo = async (
  input: any,
  fn: (input: any, ...props: any[]) => any,
  ...props: any[]
): Promise<any> => {
  if (input instanceof Array) {
    return await Promise.all(
      input.map(async (i) => await asyncApplyFnTo(i, fn, ...props))
    );
  } else if (isPojo(input)) {
    const output: POJO = {};
    const awaitAll = Object.entries<any>(input).map(
      async ([key, value]: [string, any]) => {
        return await asyncApplyFnTo(value, fn, ...props).then((o) => {
          output[key] = o;
        });
      }
    );
    await Promise.all(awaitAll);
    return output;
  } else {
    return await fn(input, ...props);
  }
};

/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
