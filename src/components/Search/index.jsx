import React, {useState} from 'react';
import { useInputValue } from '../../Hooks/useInputValue';
import axios from 'axios';
 
const URL = 'http://hn.algolia.com/api/v1/search';

export const Search = ()=> {

  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [value, changeValue] = useInputValue("")

  const handleFetch = async ()=> {
    let result;
    try {
      result = await axios.get(`${URL}?query=${value}`);
      setStories(result.data.hits);
    } catch (error) {
      setError(error);
    }
  }
 
  return (
    <div>
      <h2>Cari Cerita</h2>
      <input value={value} onChange={e => changeValue(e.target.value)} type="text" placeholder="Tulis Cerita" />
      <button type="button" onClick={handleFetch}>
        Cari Cerita
      </button> <br />
 
      {error && <span>Ada yang error ...</span>}

      {stories.length > 0 && "Daftar Cerita"}
      <ul>
        {stories.map((story) => (
          <li key={story.objectID}>
            {story.title} <button href={story.url}>Baca Selengkapnya</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
