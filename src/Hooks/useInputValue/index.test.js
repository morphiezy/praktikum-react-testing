import { useInputValue } from ".";
import { act, renderHook } from "@testing-library/react-hooks";

describe("when rendered", () => {
  it("change to value", () => {
    const { result } = renderHook(() => useInputValue("Yardan"));
    act(() => result.current.updateValue("Yardan"));
    expect(result.current.value).toEqual("Yardan");
  });
});

describe("when called updateValue", () => {
  it("update the value", () => {
    const { result } = renderHook(() => useInputValue("Meta"));
    act(() => result.current.updateValue("Meta Verse"));
    expect(result.current.value).toEqual("Meta Verse");
  });
});

