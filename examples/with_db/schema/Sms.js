// @flow

import mongoose from 'mongoose';
import DB from './db';
import type { SmsStatusT, ProviderI } from '../../../src/definitions';

export const SmsSchema = new mongoose.Schema(
  {
    provider: {
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

type ProvidersT = {|
  [providerName: string]: ProviderI,
|};

export class SmsDoc /* :: extends Mongoose$Document */ {
  provider: string;
  messageId: string;
  message: string;
  phone: string;
  status: SmsStatusT;
  rawResponse: mixed;

  static _providers: ProvidersT;
  static _providerDefault: string = 'smsc';

  static setProviders(providers: ProvidersT, providerDefault: string) {
    this._providers = providers;
    this._providerDefault = providerDefault;
  }

  static async send(phone: string, message: string, providerName?: string): Promise<SmsDoc> {
    const { _providers, _providerDefault } = this || {};
    let provider;
    if (!providerName) {
      provider = _providers[_providerDefault];
      if (!provider)
        throw new Error(
          `Cannot find provider: ${_providerDefault} in providers!\n
           Please specify correct default provider.`
        );
    } else {
      provider = _providers[providerName];
      if (!provider) throw new Error(`Cannot find provider: ${providerName} in providers!`);
    }

    const sendRes = await provider.sendSms(phone, message);
    const { messageId, rawResponse } = sendRes || {};

    const statusRes = await provider.getStatus(messageId);
    const { status } = statusRes || {};

    const data = {
      messageId,
      provider: provider.getProviderName(),
      rawResponse,
      phone,
      message,
      status,
    };
    const doc = new this(data);
    return doc.save();
  }

  async requestStatus(): Promise<SmsStatusT> {
    const { messageId, status, provider: providerName } = this || {};
    const { _providers: providers } = this.constructor || {};

    const provider = providers[providerName];
    if (!provider) throw new Error(`Cannot find provider: ${providerName} in providers`);

    const newStatus = await provider.getStatus(messageId);
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
