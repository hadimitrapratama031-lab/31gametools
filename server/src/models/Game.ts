import mongoose, { Schema, Document } from 'mongoose'
import type { UserRole } from './User'

export interface IGame extends Document {
  appId:        string
  name:         string
  coverUrl:     string
  gridUrl?:     string
  heroUrl?:     string
  logoUrl?:     string
  status:       'online' | 'offline' | 'maintenance'
  category:     string
  minRole:      UserRole
  bypassFile?:  string
  injectorFile?: string
  injectModes:  string[]
  featured:     boolean
  downloadCount: number
  createdAt:    Date
}

const GameSchema = new Schema<IGame>({
  appId:         { type: String, required: true, unique: true },
  name:          { type: String, required: true },
  coverUrl:      { type: String, default: '' },
  gridUrl:       { type: String },
  heroUrl:       { type: String },
  logoUrl:       { type: String },
  status:        { type: String, enum: ['online','offline','maintenance'], default: 'online' },
  category:      { type: String, default: 'Action' },
  minRole:       { type: String, enum: ['public','gold','platinum','admin'], default: 'public' },
  bypassFile:    { type: String },
  injectorFile:  { type: String },
  injectModes:   { type: [String], default: ['Story'] },
  featured:      { type: Boolean, default: false },
  downloadCount: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model<IGame>('Game', GameSchema)
