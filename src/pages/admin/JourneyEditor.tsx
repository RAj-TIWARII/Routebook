import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useJourney } from '@/hooks/useJourneys';
import { createJourney, updateJourney } from '@/lib/journeysRepo';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { GlassCard } from '@/components/shared/GlassCard';
import type { Journey } from '@/types';

const emptyForm = {
  title: '',
  slug: '',
  city: '',
  country: '',
  country_code: '',
  location: '',
  date_start: '',
  date_end: '',
  story: '',
  distance_km: 0,
  lat: 0,
  lng: 0,
  cover_image: '',
  hero_image: '',
};

function inputCls() {
  return 'w-full rounded-[12px] border border-border bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-primary outline-none focus:border-accent';
}

export function JourneyEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: existing } = useJourney(isNew ? undefined : id);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        city: existing.city,
        country: existing.country,
        country_code: existing.country_code,
        location: existing.location,
        date_start: existing.date_start,
        date_end: existing.date_end,
        story: existing.story,
        distance_km: existing.distance_km,
        lat: existing.lat,
        lng: existing.lng,
        cover_image: existing.cover_image,
        hero_image: existing.hero_image,
      });
    }
  }, [existing]);

  function set<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit() {
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createJourney(form as Partial<Journey>);
        queryClient.invalidateQueries({ queryKey: ['journeys'] });
        navigate(`/admin/journeys/${created.id}`);
      } else {
        await updateJourney(id!, form as Partial<Journey>);
        queryClient.invalidateQueries({ queryKey: ['journeys'] });
        queryClient.invalidateQueries({ queryKey: ['journey', existing?.slug] });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="mb-8 font-display text-[24px] font-semibold">
        {isNew ? 'New journey' : `Edit "${existing?.title ?? ''}"`}
      </h1>

      {error && (
        <div className="mb-6 rounded-[12px] border border-red-400/30 bg-red-400/10 p-3 text-[13px] text-red-300">
          {error}
        </div>
      )}

      <GlassCard className="flex flex-col gap-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input className={inputCls()} value={form.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Slug">
            <input className={inputCls()} value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </Field>
          <Field label="City">
            <input className={inputCls()} value={form.city} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="Country">
            <input className={inputCls()} value={form.country} onChange={(e) => set('country', e.target.value)} />
          </Field>
          <Field label="Start date">
            <input
              type="date"
              className={inputCls()}
              value={form.date_start}
              onChange={(e) => set('date_start', e.target.value)}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              className={inputCls()}
              value={form.date_end}
              onChange={(e) => set('date_end', e.target.value)}
            />
          </Field>
          <Field label="Latitude">
            <input
              type="number"
              className={inputCls()}
              value={form.lat}
              onChange={(e) => set('lat', Number(e.target.value))}
            />
          </Field>
          <Field label="Longitude">
            <input
              type="number"
              className={inputCls()}
              value={form.lng}
              onChange={(e) => set('lng', Number(e.target.value))}
            />
          </Field>
        </div>

        <Field label="Story">
          <textarea
            rows={5}
            className={inputCls()}
            value={form.story}
            onChange={(e) => set('story', e.target.value)}
          />
        </Field>

        <div>
          <label className="mb-2 block text-[12px] text-secondary">Photos & videos</label>
          <MediaUploader onUploaded={() => setUploadedCount((c) => c + 1)} />
          {uploadedCount > 0 && (
            <p className="mt-2 text-[12px] text-accent">
              {uploadedCount} file{uploadedCount > 1 ? 's' : ''} uploaded — attach them to this journey's
              photos/videos tables on save.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onSubmit}
            disabled={saving}
            className="rounded-[12px] bg-accent px-5 py-2.5 text-[14px] font-medium text-black hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : isNew ? 'Create journey' : 'Save changes'}
          </button>
        </div>
      </GlassCard>
    </AdminLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] text-secondary">{label}</label>
      {children}
    </div>
  );
}
