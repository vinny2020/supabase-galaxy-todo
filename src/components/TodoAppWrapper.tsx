"use client";

import dynamic from "next/dynamic";

const TodoApp = dynamic(() => import("@/components/TodoApp"), { ssr: false });

export default function TodoAppWrapper() {
  return <TodoApp />;
}
