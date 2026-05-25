let adminToken: string | null = null

export function setAdminToken(t: string | null) {
  adminToken = t
}

function makeHeaders(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (adminToken) h['Authorization'] = `Bearer ${adminToken}`
  if (extra) Object.assign(h, extra)
  return h
}

async function safeJson(res: Response) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { error: `Server error (${res.status})` }
  }
}

export async function apiGet(path: string) {
  return safeJson(await fetch(path, { headers: makeHeaders() }))
}

export async function apiPost(
  path: string,
  body: unknown,
  extra?: Record<string, string>,
) {
  return safeJson(
    await fetch(path, {
      method: 'POST',
      headers: makeHeaders(extra),
      body: JSON.stringify(body),
    }),
  )
}

export async function apiPatch(path: string, body: unknown) {
  return safeJson(
    await fetch(path, {
      method: 'PATCH',
      headers: makeHeaders(),
      body: JSON.stringify(body),
    }),
  )
}

export async function apiDelete(path: string, body: unknown) {
  return safeJson(
    await fetch(path, {
      method: 'DELETE',
      headers: makeHeaders(),
      body: JSON.stringify(body),
    }),
  )
}
