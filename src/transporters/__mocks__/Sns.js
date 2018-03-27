// @flow

import type { SendSmsResponseT } from '../../definitions';

export default class Sns {
  // eslint-disable-next-line
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const res = {
      messageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
      rawResponse: {
        MessageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
        ResponseMetadata: { RequestId: '919bdf65-2969-5a03-ae88-8c56c48825ab' },
      },
    };
    return res;
  }
}
