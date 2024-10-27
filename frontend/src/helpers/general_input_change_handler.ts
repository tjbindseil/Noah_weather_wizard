export const generalInputChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  setter: (s: string) => void,
) => {
  setter(event.target.value);
};
