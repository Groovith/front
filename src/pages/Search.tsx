import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { SearchIcon } from "lucide-react";
import { SearchResults } from "../components/SearchResults";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-10 px-20 py-10">
      <form
        className="relative flex w-fit items-center"
        onSubmit={handleSearch}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="노래, 채팅방, 사용자 검색"
          className="w-[500px] rounded-lg border border-neutral-300 bg-neutral-200 py-2.5 pl-12 pr-3 placeholder:text-neutral-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant={"ghost"}
          onClick={() => inputRef.current?.focus()}
          className="absolute left-1 text-neutral-500 hover:bg-transparent hover:text-black"
        >
          <SearchIcon />
        </Button>
      </form>
      <SearchResults />
    </div>
  );
}
