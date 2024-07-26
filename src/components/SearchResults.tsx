import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { search } from "../utils/apis/serverAPI";

export function SearchResults() {
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<{} | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get("query");
    if (searchQuery) {
      setQuery(searchQuery);
      // 검색 로직
      //fetchSearchResults(searchQuery);
    }
  }, [location.search]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["SearchResults", query],
    queryFn: () => search(query || ""),
    enabled: !!query,
  });

  if (!query) {
    return <p className="text-gray-500">검색어를 입력하여 원하는 컨텐츠를 찾아보세요</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>검색 중 에러가 발생하였습니다: {(error as Error).message}</p>;
  }

  return <div>{JSON.stringify(data.tracks.items)}</div>;
}
