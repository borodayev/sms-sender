// @flow

import mongoose from 'mongoose';
import DB from './db';

export const SmsSchema = new mongoose.Schema(
  {
    transporter: {
      type: String,
      description: 'Provider who send sms',
    },

    messageId: {
      type: String,
      description: 'Message ID given by transporter',
    },

    message: {
      type: String,
      description: 'Text of message',
    },

    phone: {
      type: String,
      description: 'Phone of recepient',
    },

    status: {
      type: Number, // TODO ENUM
      description: 'Status of message',
    },

    rawData: {
      type: mongoose.Schema.Types.Mixed,
      descriprion: 'Raw response from api',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'sms',
  }
);

export class SmsDoc /* :: extends Mongoose$Document */ {
  transporter: string;
  messageId: string;
  message: string;
  phone: string;
  status: number;
  rawData: mixed;

  static async upsert(data: $Shape<SmsDoc>): Promise<SmsDoc> {
    return (this.findOneAndUpdate(
      { messageId: data.messageId },
      { ...data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec(): any);
  }
}

SmsSchema.loadClass(SmsDoc);

export const Sms = DB.data.model('Sms', SmsSchema);
