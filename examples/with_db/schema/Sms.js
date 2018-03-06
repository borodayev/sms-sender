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
      type: Number,
      description: 'Message ID given by transporter',
    },

    message: {
      type: String,
      description: 'Текст сообщения',
    },

    phones: {
      type: [String],
      description: 'Номера получателей',
    },

    sender: {
      type: String,
      default: 'SALON.KZ',
      description: 'Имя отправителя',
    },

    cost: {
      type: Number,
      description: 'Стоимость текущей рассылки',
    },

    status: {
      type: Number, // TODO ENUM
      description: 'Статус сообщения',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'sms',
  }
);

export class SmsDoc /* :: extends Mongoose$Document */ {
  // $FlowFixMe

  // TODO
  // message: string;
  // phones: Array<string>;
  // sender: string;
  // status: number;

  static async upsert(data: $Shape<SmsDoc>): Promise<SmsDoc> {
    return (this.findOneAndUpdate(
      { id: data.id },
      { ...data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec(): any);
  }
}

SmsSchema.loadClass(SmsDoc);

export const Sms = DB.data.model('Sms', SmsSchema);
