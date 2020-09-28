addEventListener("load", () => {
  console.log("loaded 1");
});
addEventListener("unload", () => {
  console.log("unloaded 1");
});
addEventListener("load", () => {
  console.log("loaded 2");
});
addEventListener("unload", () => {
  console.log("unloaded 2");
});
console.log("Exiting...");
