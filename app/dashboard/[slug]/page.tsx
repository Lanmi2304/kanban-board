import { KanbanBoard } from "./_components/kanban-board";
import { getCardsByProjectId } from "./_repositories/get-cards-by-project-id";
import { getProjectById } from "./_repositories/get-project-by-id";

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [cards, project] = await Promise.all([
    getCardsByProjectId(slug),
    getProjectById(slug),
  ]);

  return (
    <div className="mt-20 w-full">
      <KanbanBoard cards={cards} project={project} />
    </div>
  );
}
