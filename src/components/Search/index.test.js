import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from ".";

const setup = () => {
  const { container } = render(<Search />);
  const inputSearch = screen.getByPlaceholderText(/Tulis Cerita/);
  const buttonSearch = screen.getByRole('button',{name:'Cari Cerita'})

  return {
    inputSearch,
    buttonSearch,
    container,
  };
};


test('Fill search input', async()=>{
    const {inputSearch} = setup();
    await userEvent.type(inputSearch,"Aladin");
    expect(inputSearch.value).toBe('Aladin')
})


test('Button search click', async ()=>{
    const {buttonSearch} = setup();

    const jsdomAlert = window.alert; 
    window.alert = ()=>{};
  
    await userEvent.click(buttonSearch);
    window.alert = jsdomAlert;
})
