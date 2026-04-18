"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./page.module.css";
import { useState } from "react";
import Modal from "@/app/components/Modal/Modal";
import NoteForm from "@/app/components/NoteForm/NoteForm";
import NoteList from "@/app/components/NoteList/NoteList";
import { fetchNotes } from "@/app/lib/api";
import Pagination from "@/app/components/Pagination/Pagination";
import SearchBox from "@/app/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

export function NotesClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(page, 12, search),
    placeholderData: keepPreviousData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onEnd={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
