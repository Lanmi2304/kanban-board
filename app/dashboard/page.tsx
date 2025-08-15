import { KanbanBoard } from "./_components/kanban-board";

export default function Dashboard() {
  return (
    <div className="mt-24 flex h-screen w-fit items-start justify-center">
      <KanbanBoard />
    </div>
  );
}
