'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type WhatsAppSettingsFormProps = {
  initialNumber: string;
};

export function WhatsAppSettingsForm({
  initialNumber,
}: WhatsAppSettingsFormProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialNumber);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const cleaned = phone.replace(/\D/g, '');
    if (!cleaned) {
      setError('Escribe un número con código de país, sin + ni espacios');
      setSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: upsertError } = await supabase
        .from('store_settings')
        .upsert({
          id: 1,
          whatsapp_number: cleaned,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      setPhone(cleaned);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar el número',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Número de WhatsApp</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="591XXXXXXXX"
          inputMode="tel"
          required
        />
      </label>
      <p className="text-link" style={{ margin: 0 }}>
        Solo dígitos, con código de país. Ejemplo: 59171234567
      </p>
      {error ? <p className="form-error">{error}</p> : null}
      {saved ? (
        <p style={{ margin: 0, color: 'var(--accent)' }}>
          Guardado. Ya aplica en la tienda pública.
        </p>
      ) : null}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar número'}
        </button>
      </div>
    </form>
  );
}
