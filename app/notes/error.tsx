"use client";

export default function Error({ error }: { error: Error }) {
  return <p>Something went wrong: {error.message}</p>;
}
