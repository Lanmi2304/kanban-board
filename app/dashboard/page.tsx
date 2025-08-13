import { KanbanBoard } from "./_components/kanban-board";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>

      <KanbanBoard />
    </div>
  );
}
