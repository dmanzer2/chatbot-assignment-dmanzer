
export default function Home() {
  return (
    // test tailwind here
    <main className="min-h-screen grid place-items-center bg-slate-50">
      <div className="rounded-2xl border p-8 shadow-sm bg-white">
        <h1 className="text-3xl font-bold tracking-tight">Next.js + Tailwind ✅</h1>
        <p className="mt-2 text-slate-600">
          Edit <code className="font-mono">src/app/page.tsx</code> and save to reload.
        </p>
        <button className="mt-4 rounded-lg px-4 py-2 text-sm font-medium border hover:bg-slate-100">
          Test Button
        </button>
      </div>
    </main>
  );
}
