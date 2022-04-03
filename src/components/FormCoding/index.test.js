import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormCoding } from ".";

const setup = () => {
  const { container } = render(<FormCoding />);

  const fullnameInput = screen.getByLabelText(/Nama Lengkap:/);
  const emailInput = screen.getByLabelText(/Email:/);
  const phoneNumberInput = screen.getByLabelText(/No Handphone:/);

  const radioIT = screen.getByLabelText(/^IT$/i);
  const radioNonIT = screen.getByLabelText(/^Non IT$/i);

  const selectOptionProgram = screen.getByRole("combobox");

  const inputFileKesungguhan = screen.getByLabelText(/Foto Surat Kesungguhan:/);

  const textArea = screen.getByLabelText("Harapan Untuk Coding Bootcamp Ini:");

  const submitButton = screen.getByRole("button", { name: "Submit" });
  const resetButton = screen.getByRole("button", { name: "Reset" });

  return {
    fullnameInput,
    emailInput,
    phoneNumberInput,
    radioIT,
    radioNonIT,
    selectOptionProgram,
    inputFileKesungguhan,
    textArea,
    submitButton,
    resetButton,
    container,
  };
};



/* Simulate when user do correct input */

test("user input correct value", async () => {
  const { fullnameInput, emailInput, phoneNumberInput } = setup();

  await userEvent.type(fullnameInput, "Yardan");
  expect(fullnameInput.value).toMatch(/^[A-Za-z ]*$/);

  await userEvent.type(emailInput, "morphiezy@dev.id");
  expect(emailInput.value).toMatch(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  await userEvent.type(phoneNumberInput, "081234567890");
  expect(phoneNumberInput.value).toMatch(/^((628|08)[\d]{9,11})$/);
});



/* Simulate when user do incorrect input */

test("user input incorrect value & show error message", async () => {
  const { fullnameInput, emailInput, phoneNumberInput } = setup();

  await userEvent.type(fullnameInput, "Yardan12");
  expect(fullnameInput.value).not.toMatch(/^[A-Za-z ]*$/);
  expect(
    screen.getByText("Nama Lengkap Harus Berupa Huruf")
  ).toBeInTheDocument();

  await userEvent.type(emailInput, "morphiezy>.@.com");
  expect(emailInput.value).not.toMatch(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  expect(screen.getByText("Email Tidak Sesuai")).toBeInTheDocument();

  await userEvent.type(phoneNumberInput, "3321234567893123.0");
  expect(phoneNumberInput.value).not.toMatch(/^((628|08)[\d]{9,11})$/);
  expect(screen.getByText("No Handphone Tidak Sesuai")).toBeInTheDocument();
});



/* Simulate user re-input after error message is appear */

test("re-input form & error message dissapear", async () => {
  const { fullnameInput, emailInput, phoneNumberInput } = setup();

  await userEvent.type(fullnameInput, "Yardan");
  await userEvent.type(emailInput, "morphiezy@dev.id");
  await userEvent.type(phoneNumberInput, "081234567890");

  expect(fullnameInput.value).toMatch(/^[A-Za-z ]*$/);
  expect(emailInput.value).toMatch(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  expect(phoneNumberInput.value).toMatch(/^((628|08)[\d]{9,11})$/);

  expect(
    screen.queryByText("Nama Lengkap Harus Berupa Huruf")
  ).not.toBeInTheDocument();
  expect(screen.queryByText("Email Tidak Sesuai")).not.toBeInTheDocument();
  expect(
    screen.queryByText("No Handphone Tidak Sesuai")
  ).not.toBeInTheDocument();
});



test("Select pendidikan", () => {
  const { radioIT, radioNonIT } = setup();

  expect(radioIT).not.toBeChecked();
  expect(radioNonIT).not.toBeChecked();

  fireEvent.click(radioIT);
  expect(radioIT).toBeChecked();
  expect(radioNonIT).not.toBeChecked();

  fireEvent.click(radioNonIT);
  expect(radioNonIT).toBeChecked();
  expect(radioIT).not.toBeChecked();
});



test("Select option program coding", () => {
  const { selectOptionProgram } = setup();
  userEvent.selectOptions(selectOptionProgram, "golang");
  expect(
    screen.getByRole("option", { name: "Coding Backend with Golang" }).selected
  ).toBe(true);
});



test("Upload surat kesungguhan", async () => {
  const { inputFileKesungguhan } = setup();

  const file = new File(["surat-kesungguhan"], "surat-kesungguhan.pdf", {
    type: "application/pdf",
  });
  await userEvent.upload(inputFileKesungguhan, file);

  expect(inputFileKesungguhan.files[0]).toBe(file);
  expect(inputFileKesungguhan.files.item(0)).toBe(file);
  expect(inputFileKesungguhan.files).toHaveLength(1);
  expect(inputFileKesungguhan.files[0].type).toBe("application/pdf");
});



test("Fill text area", async () => {
  const { textArea } = setup();

  await userEvent.type(textArea, "Hello world!");
  expect(textArea.value).toBe("Hello world!");
});



test("user click the submit button but there is data that does not match", async () => {

  const {
    submitButton,
    fullnameInput,
    emailInput,
    phoneNumberInput,
    radioIT,
    radioNonIT,
    selectOptionProgram,
    inputFileKesungguhan,
  } = setup();
  const jsdomAlert = window.alert;
  window.alert = () => {};

  await userEvent.type(fullnameInput, "Yardan12");
  expect(fullnameInput.value).not.toMatch(/^[A-Za-z ]*$/);

  await userEvent.type(emailInput, "morphiezy@dev.id");
  expect(emailInput.value).toMatch(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );

  await userEvent.type(phoneNumberInput, "081234567890");
  expect(phoneNumberInput.value).toMatch(/^((628|08)[\d]{9,11})$/);

  expect(radioIT).not.toBeChecked();
  fireEvent.click(radioIT);
  expect(radioIT).toBeChecked();
  expect(radioNonIT).not.toBeChecked();

  userEvent.selectOptions(selectOptionProgram, "golang");
  expect(
    screen.getByRole("option", { name: "Coding Backend with Golang" }).selected
  ).toBe(true);

  const file = new File(["surat-kesungguhan"], "surat-kesungguhan.pdf", {
    type: "application/pdf",
  });

  await userEvent.upload(inputFileKesungguhan, file);

  expect(inputFileKesungguhan.files[0]).toBe(file);
  expect(inputFileKesungguhan.files[0].type).toBe("application/pdf");

  expect(
    screen.getByText("Nama Lengkap Harus Berupa Huruf")
  ).toBeInTheDocument();

  userEvent.click(submitButton);
  window.alert = jsdomAlert;
});



test("Reset button Click,", async () => {
  const {
    fullnameInput,
    emailInput,
    phoneNumberInput,
    resetButton,
    radioIT,
    radioNonIT,
    selectOptionProgram,
    inputFileKesungguhan,
    textArea,
    container,
  } = setup();

  const jsdomAlert = window.alert;
  window.alert = () => {};

  await userEvent.click(resetButton);
  window.alert = jsdomAlert;

  expect(fullnameInput.value).toBe("");
  expect(emailInput.value).toBe("");
  expect(phoneNumberInput.value).toBe("");
  expect(radioIT).not.toBeChecked();
  expect(radioNonIT).not.toBeChecked();
  expect(selectOptionProgram.value).toBe("");
  expect(inputFileKesungguhan.files).toHaveLength(0);
  expect(textArea.value).toBe("");
  expect(container.querySelector("li")).not.toBeInTheDocument();
});
