// @flow

import Sns from '../Sns';

const sns = new Sns({ region: 'eu-west-1' });
sns.sendSms = jest.fn().mockImplementation(() => {
  return {
    messageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
    rawResponse: {
      MessageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
      ResponseMetadata: { RequestId: '919bdf65-2969-5a03-ae88-8c56c48825ab' },
    },
  };
});

describe('Sns', () => {
  // send message
  it('sendSms', async () => {
    const res = await sns.sendSms('+77081949582', 'Hi');
    expect(res).toEqual({
      messageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
      rawResponse: {
        MessageId: '8e1e071f-a27d-55db-8ba9-542c4f9c8a73',
        ResponseMetadata: { RequestId: '919bdf65-2969-5a03-ae88-8c56c48825ab' },
      },
    });
  });
});
