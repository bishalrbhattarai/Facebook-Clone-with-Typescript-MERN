const Flex = () => {
  function addValue(a: number | string, b: number | string) {
    if (typeof a === "number" && typeof b === "number") return a + b;
    else return "" + a + b;
  }
  let result: number = Number(addValue(20, 11));
  return <>hello</>;
};

export default Flex;
