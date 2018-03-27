// @flow

import fetchMock from 'fetch-mock';
import Smsc from '../Smsc';

describe('Smsc', () => {
  const login = 'test_dev_kz';
  const password = 'test_dev_kz123';
  const smsc = new Smsc({ login, password });

  beforeEach(() => {
    fetchMock.reset();
  });

  // send message
  it('sendSms', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz123&phones=77718637484&mes=%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D0%B8%D1%82&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { cnt: 1, id: 50 },
    });

    const res = await smsc.sendSms('77718637484', 'транслит');
    expect(res).toEqual({ messageId: '50-77718637484', rawResponse: { cnt: 1, id: 50 } });
  });

  // get cost of message sending
  it('getCost', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz123&cost=1&phones=77718637484&mes=hello&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { cnt: 1, cost: '0' },
    });

    const res = await smsc.getCost('77718637484', 'hello');
    expect(res).toEqual({ cost: '0', rawResponse: { cnt: 1, cost: '0' } });
  });

  // get status of message with full information
  it('getStatus', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz123&id=40&phone=77718637484&all=2&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: {
        cost: '0.00',
        country: 'Казахстан',
        last_date: '13.03.2018 15:50:50',
        last_timestamp: 1520934650,
        message: 'hello',
        operator: 'Beeline',
        phone: '77718637484',
        region: '',
        send_date: '13.03.2018 15:50:46',
        send_timestamp: 1520934646,
        sender_id: 'SMS-CENTRE',
        status: 1,
        status_name: 'Доставлено',
        type: 0,
      },
    });

    const messageId = `40-77718637484`;
    const res = await smsc.getStatus(messageId);
    expect(res).toEqual({
      rawResponse: {
        cost: '0.00',
        country: 'Казахстан',
        last_date: '13.03.2018 15:50:50',
        last_timestamp: 1520934650,
        message: 'hello',
        operator: 'Beeline',
        phone: '77718637484',
        region: '',
        send_date: '13.03.2018 15:50:46',
        send_timestamp: 1520934646,
        sender_id: 'SMS-CENTRE',
        status: 1,
        status_name: 'Доставлено',
        type: 0,
      },
      status: 'ok',
    });
  });

  // get current balance
  it('getBalance', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/balance.php?login=test_dev_kz&psw=test_dev_kz123&cur=1&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { balance: '84.75', currency: 'KZT' },
    });

    const res = await smsc.getBalance();
    expect(res).toEqual({ balance: '84.75', rawResponse: { balance: '84.75', currency: 'KZT' } });
  });
});
