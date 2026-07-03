import mongoose, { Schema, Document } from 'mongoose'
import type { UserRole } from './User'

// ── History ──────────────────────────────────────────────────
export interface IHistory extends Document {
  userId:    mongoose.Types.ObjectId
  type:      'inject' | 'bypass' | 'patch' | 'system' | 'uninstall'
  gameName:  string
  gameIcon?: string
  detail:    string
  status:    'success' | 'failed' | 'pending'
  errorMsg?: string
  createdAt: Date
}

export const HistorySchema = new Schema<IHistory>({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['inject','bypass','patch','system','uninstall'], required: true },
  gameName: { type: String, required: true },
  gameIcon: { type: String },
  detail:   { type: String, required: true },
  status:   { type: String, enum: ['success','failed','pending'], default: 'pending' },
  errorMsg: { type: String },
}, { timestamps: true })

export const History = mongoose.model<IHistory>('History', HistorySchema)

// ── Voucher ───────────────────────────────────────────────────
export interface IVoucher extends Document {
  code:       string
  role:       UserRole
  days:       number
  maxUse:     number
  usedCount:  number
  usedBy:     mongoose.Types.ObjectId[]
  expiresAt?: Date
  createdBy:  string
  active:     boolean
  createdAt:  Date
}

export const VoucherSchema = new Schema<IVoucher>({
  code:      { type: String, required: true, unique: true, uppercase: true },
  role:      { type: String, enum: ['gold','platinum'], required: true },
  days:      { type: Number, required: true },
  maxUse:    { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  usedBy:    [{ type: Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date },
  createdBy: { type: String, default: 'admin' },
  active:    { type: Boolean, default: true },
}, { timestamps: true })

export const Voucher = mongoose.model<IVoucher>('Voucher', VoucherSchema)
