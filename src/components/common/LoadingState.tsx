export function LoadingState() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl bg-white p-4 shadow-soft">
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton mt-4 h-5 w-2/3 rounded" />
          <div className="skeleton mt-3 h-4 w-full rounded" />
        </div>
      ))}
    </div>
  );
}
