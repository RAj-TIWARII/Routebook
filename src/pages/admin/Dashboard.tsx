import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useJourneys } from '@/hooks/useJourneys';
import { deleteJourney } from '@/lib/journeysRepo';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { GlassCard } from '@/components/shared/GlassCard';
import { formatMonthYear } from '@/lib/utils';

export function AdminDashboard() {
  const { data: journeys, isLoading } = useJourneys();
  const queryClient = useQueryClient();

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      await deleteJourney(id);
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-[24px] font-semibold">Journeys</h1>
        <Link
          to="/admin/journeys/new"
          className="flex items-center gap-1.5 rounded-[12px] bg-accent px-4 py-2 text-[13px] font-medium text-black hover:opacity-90"
        >
          <Plus size={15} /> New journey
        </Link>
      </div>

      {isLoading && <p className="text-secondary">Loading…</p>}

      <div className="flex flex-col gap-3">
        {(journeys ?? []).map((journey) => (
          <GlassCard key={journey.id} className="flex items-center gap-4 p-4">
            <img
              src={journey.cover_image}
              alt=""
              className="h-14 w-14 shrink-0 rounded-[10px] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14px] font-medium text-primary">
                {journey.title}
              </p>
              <p className="text-[12px] text-secondary">
                {journey.city}, {journey.country} · {formatMonthYear(journey.date_start)}
              </p>
            </div>
            <Link
              to={`/admin/journeys/${journey.id}`}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-secondary hover:bg-white/5 hover:text-primary"
              aria-label={`Edit ${journey.title}`}
            >
              <Pencil size={15} />
            </Link>
            <button
              onClick={() => handleDelete(journey.id, journey.title)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-secondary hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Delete ${journey.title}`}
            >
              <Trash2 size={15} />
            </button>
          </GlassCard>
        ))}
      </div>
    </AdminLayout>
  );
}
