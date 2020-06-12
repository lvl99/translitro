import { get, isPojo, applyFnTo, asyncApplyFnTo } from "../../lib/utils";

describe("get", () => {
  it("should get an object property", () => {
    expect(get({ test: 1 }, "test")).toBe(1);
  });

  it("should return undefined if property not on object", () => {
    expect(get({ test: 1 }, "fail")).toBeUndefined();
  });
});

describe("isPojo", () => {
  it("should correctly identify POJOs", () => {
    expect(isPojo(undefined)).toBe(false);
    expect(isPojo(null)).toBe(false);
    expect(isPojo(NaN)).toBe(false);
    expect(isPojo("I'm not a POJO")).toBe(false);
    expect(isPojo(String("I'm not a POJO"))).toBe(false);
    expect(isPojo(1)).toBe(false);
    expect(isPojo(Number(1))).toBe(false);
    expect(isPojo({})).toBe(true);
  });
});

describe("applyFnTo", () => {
  it("should apply the function to non array/object values", () => {
    expect(applyFnTo(null, parseInt, 10)).toBeNaN();
    expect(applyFnTo(false, parseInt, 10)).toBeNaN();
    expect(applyFnTo(1, parseInt, 10)).toBe(1);
    expect(applyFnTo("2", parseInt, 10)).toBe(2);
  });

  it("should apply the function to array values", () => {
    const test = ["1", "2", "3"];
    const result = applyFnTo(test, parseInt, 10);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(3);
  });

  it("should apply the function to object values", () => {
    const test = {
      a: "1",
      b: "2",
      c: {
        d: "3",
      },
    };
    const result = applyFnTo(test, parseInt, 10);
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.c.d).toBe(3);
  });
});

describe("asyncApplyFnTo", () => {
  const asyncParseInt = async (input: any, ...props: any[]): Promise<number> =>
    Promise.resolve(parseInt(input, ...props));

  it("should apply the function to non array/object values", async () => {
    await asyncApplyFnTo(null, asyncParseInt, 10).then((output) =>
      expect(output).toBeNaN()
    );
    await asyncApplyFnTo(false, asyncParseInt, 10).then((output) =>
      expect(output).toBeNaN()
    );
    await asyncApplyFnTo(1, asyncParseInt, 10).then((output) =>
      expect(output).toBe(1)
    );
    await asyncApplyFnTo("2", asyncParseInt, 10).then((output) =>
      expect(output).toBe(2)
    );
  });

  it("should apply the function to array values", async () => {
    const test = ["1", "2", "3"];
    const result = await asyncApplyFnTo(test, asyncParseInt, 10);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(2);
    expect(result[2]).toBe(3);
  });

  it("should apply the function to object values", async () => {
    const test = {
      a: "1",
      b: "2",
      c: {
        d: "3",
      },
    };
    const result = await asyncApplyFnTo(test, asyncParseInt, 10);
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.c.d).toBe(3);
  });
});
