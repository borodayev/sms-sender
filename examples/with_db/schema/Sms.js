// @flow

import mongoose from 'mongoose';
import DB from './db';
import { getTransport, type TransporterNamesT } from '../utils';
import type { SmsStatusT } from '../../../src/definitions';

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
      type: String,
      enum: ['ok', 'pending', 'error'],
      description: 'Status of message',
    },

    rawResponse: {
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
  status: SmsStatusT;
  rawResponse: mixed;

  static async send(
    phone: string,
    message: string,
    transporter?: TransporterNamesT = 'smsc'
  ): Promise<SmsDoc> {
    const transport = getTransport(transporter);
    const sendRes = await transport.sendSms(phone, message);
    const { messageId, rawResponse } = sendRes || {};

    const statusRes = await transport.getStatus(messageId);
    const { status } = statusRes || {};

    const data = {
      messageId,
      rawResponse,
      phone,
      message,
      status,
    };

    const doc = new this(data);
    return doc.save();
  }

  async requestStatus(): Promise<SmsStatusT> {
    const { messageId, status, transporter } = this || {};
    // TODO fix this issue
    // $FlowFixMe
    const transport = getTransport(transporter);

    const newStatus = await transport.getStatus(messageId);
    if (newStatus !== status) {
      await Sms.findOneAndUpdate(
        { messageId },
        { newStatus },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();
    }
    return status;
  }
}

SmsSchema.loadClass(SmsDoc);

export const Sms = DB.data.model('Sms', SmsSchema);
