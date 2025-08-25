const re = /^Identity(?:_(\d+))?$/;

export function renameIdentityKeysNumber(obj: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => {
            const m = re.exec(k);
            if (!m) return null;               // skip non Identity keys
            const idx = Number(m[1] ?? 0);
            return [String(v), idx];           // "v_sequence_end" -> 0
          })
          .filter(Boolean)
      );
}