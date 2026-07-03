import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret'

export interface AuthRequest extends Request {
  user?: IUser
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' })
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
  try {
    const { userId } = jwt.verify(header.slice(7), JWT_SECRET) as { userId: string }
    const user = await User.findById(userId)
    if (!user || user.banned) return res.status(401).json({ success: false, error: 'User not found or banned' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin only' })
  }
  next()
}
