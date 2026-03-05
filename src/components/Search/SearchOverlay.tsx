import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

type CommentType = {
  id: number;
  name: string;
  email: string;
  body: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const listRef = useRef<HTMLUListElement>(null);

  // ✅ Fetch comments when overlay opens
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/comments", {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Failed to load comments.");
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [isOpen]);

  // ✅ Debounce (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ Filter comments (client-side search)
  const filteredComments = useMemo(() => {
    if (!debouncedQuery) return [];

    return comments.filter((comment) =>
      comment.body
        .toLowerCase()
        .includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery, comments]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  // ✅ Highlight text without dangerouslySetInnerHTML
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  // ✅ Keyboard Navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredComments.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === filteredComments.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev === 0 ? filteredComments.length - 1 : prev - 1
        );
      }

      if (e.key === "Enter") {
        const selected = filteredComments[activeIndex];
        if (selected) {
          setExpandedId((prev) =>
            prev === selected.id ? null : selected.id
          );
        }
      }

      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [filteredComments, activeIndex, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-overlay__content">
        <div className="search-header">
          <h2>Search Comments</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          type="text"
          placeholder="Search in comment body..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {loading && <p>Loading comments...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && debouncedQuery && (
          <ul ref={listRef} className="results-list">
            {filteredComments.length === 0 && (
              <p>No results found.</p>
            )}

            {filteredComments.map((comment, index) => (
              <li
                key={comment.id}
                className={
                  index === activeIndex ? "active" : ""
                }
              >
                <h4>{highlightText(comment.name, debouncedQuery)}</h4>
                <p>{highlightText(comment.body, debouncedQuery)}</p>

                {expandedId === comment.id && (
                  <div className="expanded">
                    <small>Email: {comment.email}</small>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};