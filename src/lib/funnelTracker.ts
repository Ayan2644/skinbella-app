/**
 * Funnel Tracker — granular event tracking for quiz funnel
 * 
 * Events: quiz_started, question_answered, quiz_completed, result_viewed, cta_clicked
 * All events include session_id and preset_id for per-preset analytics.
 */
import { supabase } from '@/lib/supabase';

let _sessionId: string | null = null;
let _presetId: string = 'main';

/** Generate a unique session ID per quiz attempt */
function getSessionId(): string {
  if (!_sessionId) {
    _sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
  return _sessionId;
}

/** Reset session (call when user restarts quiz) */
export function resetFunnelSession() {
  _sessionId = null;
}

/** Set the active preset for this session */
export function setFunnelPreset(presetId: string) {
  _presetId = presetId;
}

/** Track a funnel event (fire-and-forget, never blocks UI) */
export function trackFunnelEvent(
  eventType:
    | 'quiz_started'
    | 'question_answered'
    | 'quiz_completed'
    | 'result_viewed'
    | 'cta_clicked'
    | 'products_page_viewed'
    | 'product_section_scrolled'
    | 'combo_cta_clicked'
    | 'combo_cta_sticky_clicked',
  extra?: { questionIndex?: number; questionId?: string; metadata?: Record<string, any> }
) {
  const payload = {
    session_id: getSessionId(),
    event_type: eventType,
    preset_id: _presetId,
    question_index: extra?.questionIndex ?? null,
    question_id: extra?.questionId ?? null,
    metadata: extra?.metadata ?? {},
  };

  // Fire and forget — never await, never block
  supabase.from('quiz_events').insert(payload).then(({ error }) => {
    if (error) console.warn('[FunnelTracker]', eventType, error.message);
    else console.debug('[FunnelTracker]', eventType, payload.session_id);
  });
}
