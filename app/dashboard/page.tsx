import { KanbanBoard } from "./_components/kanban-board";

export default function Dashboard() {
  return (
    <div className="mt-16 flex h-screen w-fit items-start justify-center px-4">
      <KanbanBoard />
    </div>
  );
}
