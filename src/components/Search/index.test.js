import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { act } from "react-dom/test-utils";

import { Search } from ".";

jest.mock('axios');


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


test('fetch stories and display to screen', async ()=>{

  const stories = [
    { objectID:1, title:'Superman' },
    { objectID:2, title:'Batman' }
  ]

  axios.get.mockImplementationOnce(()=> 
    Promise.resolve({ data: { hits: stories }})
  )
  
  await act( async ()=>{
    const {buttonSearch} = setup();
    await userEvent.click(buttonSearch);
  })

  const items = await screen.findAllByRole('listitem')
  expect(items).toHaveLength(2);

})


test('fetch stories but fail', async ()=>{

  axios.get.mockImplementationOnce(()=> 
    Promise.reject(new Error())
  )

  await act( async ()=>{
    const {buttonSearch} = setup();
    await userEvent.click(buttonSearch);
  })

  const message = await screen.findByText(/Ada yang error .../)
  expect(message).toBeInTheDocument();

})


test('Fill search input', async()=>{
    const {inputSearch} = setup();
    await userEvent.type(inputSearch,"Aladin");
    expect(inputSearch.value).toBe('Aladin')
})