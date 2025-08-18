import { KanbanBoard } from "./_components/kanban-board";

export default function Dashboard() {
  return (
    <div className="mt-20 flex h-screen w-full items-start justify-center">
      <KanbanBoard />
    </div>
  );
}
