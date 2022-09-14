import { serialize, parse, CookieSerializeOptions } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'src/types/user'

const SESSION_SECRET = 'this-is-a-secret-value-with-at-least-32-characters'
const SESSION_NAME = 'session'

export const MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) {
  const stringValue =
    typeof value === 'object' ? JSON.stringify(value) : String(value)

  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000)
  }

  console.log('setting stringValue: ', stringValue)

  const cookie = serialize(name, stringValue, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  })
  console.log('setting cookie: ', cookie)
  res.setHeader('Set-Cookie', cookie)
}

export function getCookie(req: NextApiRequest, name: string) {
  const cookies = parseCookies(req)
  return cookies[name]
}

export function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies

  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie
  return parse(cookie || '')
}

export function setSessionCookie(res: NextApiResponse, session: Session) {
  setCookie(res, SESSION_NAME, session)
}

export function getSessionCookie(req: NextApiRequest) {
  return getCookie(req, SESSION_NAME)
}
