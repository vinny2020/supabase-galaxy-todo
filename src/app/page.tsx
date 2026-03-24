import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-galaxy-silver)" }}
          >
            ✦ Galaxy Todo
          </h1>
          <p className="text-sm" style={{ color: "var(--color-galaxy-lavender)" }}>
            Organize your universe, one task at a time
          </p>
        </header>
        <TodoApp />
      </div>
    </main>
  );
}
