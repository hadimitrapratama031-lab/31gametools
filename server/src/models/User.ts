import mongoose, { Schema, Document } from 'mongoose'

export type UserRole = 'public' | 'gold' | 'platinum' | 'admin'

export interface IUser extends Document {
  discordId:     string
  username:      string
  avatar:        string
  email?:        string
  role:          UserRole
  downloadCount: number
  downloadLimit: number
  expiresAt?:    Date
  guildMember:   boolean
  banned:        boolean
  createdAt:     Date
  updatedAt:     Date
}

const UserSchema = new Schema<IUser>({
  discordId:     { type: String, required: true, unique: true },
  username:      { type: String, required: true },
  avatar:        { type: String, default: '' },
  email:         { type: String },
  role:          { type: String, enum: ['public','gold','platinum','admin'], default: 'public' },
  downloadCount: { type: Number, default: 0 },
  downloadLimit: { type: Number, default: 3 },
  expiresAt:     { type: Date },
  guildMember:   { type: Boolean, default: false },
  banned:        { type: Boolean, default: false },
}, { timestamps: true })

// Auto-reset download count daily
UserSchema.methods.canDownload = function(): boolean {
  if (this.role === 'platinum' || this.role === 'admin') return true
  return this.downloadCount < this.downloadLimit
}

export default mongoose.model<IUser>('User', UserSchema)
