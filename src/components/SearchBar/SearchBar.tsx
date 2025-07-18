import { useState } from "react";

const SearchBar = ({
  onFormSubmit,
}: {
  onFormSubmit: (term: string) => void;
}) => {
  const [term, setTerm] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onFormSubmit(term);
  };

  return (
    <div className="searchbar ui segment">
      <form action="" className="ui form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="video-search-input">Video Search</label>
          <input
            id="video-search-input"
            type="text"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
