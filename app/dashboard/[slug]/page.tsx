import { KanbanBoard } from "./_components/kanban-board";
import { getTasksByProjectId } from "./_repositories/get-tasks-by-project-id";
import { getCardsByProjectId } from "./_repositories/get-cards-by-project-id";

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tasks = await getTasksByProjectId(slug);
  const cards = await getCardsByProjectId(slug);
  return (
    <div className="mt-20 w-full">
      <KanbanBoard tasks={tasks} cards={cards} />
    </div>
  );
}
