export const userOptionsStore = $state({
  format: "basic",
})


export const changeUserFormat = (needed) => {
  userOptionsStore.format = needed;
}
