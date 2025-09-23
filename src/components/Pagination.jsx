import React from "react";

export default function Pagination({ page, setPage, totalPages, totalItems }) {
  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(totalPages, page + 1));

  // show small window of pages
  const visible = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) visible.push(i);

  return (
    <div className="pagination">
      <div className="left">
        <button className="btn" onClick={() => setPage(1)} disabled={page === 1}>First</button>
        <button className="btn" onClick={prev} disabled={page === 1}>Prev</button>
      </div>

      <div className="pages">
        {visible.map((p) => (
          <button key={p} className={`btn page ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
        ))}
        {end < totalPages && <span className="dots">…</span>}
      </div>

      <div className="right">
        <button className="btn" onClick={next} disabled={page === totalPages}>Next</button>
        <button className="btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
      </div>

      <div className="meta">Total: {totalItems}</div>
    </div>
  );
}
