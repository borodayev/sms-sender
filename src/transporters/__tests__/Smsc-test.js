// @flow

import fetchMock from 'fetch-mock';
import Smsc from '../Smsc';

describe('Smsc', () => {
  const login = 'test_dev_kz';
  const password = 'test_dev_kz';
  const smsc = new Smsc({ login, password });

  beforeEach(() => {
    fetchMock.reset();
  });

  it('sendSms', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz&phones=77718637484&mes=hello&fmt=3&cost=3`,
      response: { balance: '84.75', cnt: 1, cost: '0', id: 24 },
    });

    const params = { phones: '77718637484', mes: 'hello', fmt: 3, cost: 3 };
    const res = await smsc.sendSms(params);
    expect(res).toEqual({
      messageId: '24-77718637484',
      response: { balance: '84.75', cnt: 1, cost: '0', id: 24 },
    });
  });

  it('getCost', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz&cost=1&phones=77718637484&mes=hello&fmt=3`,
      response: { cnt: 1, cost: '0' },
    });

    const res = await smsc.getCost({ phones: '77718637484', mes: 'hello', fmt: 3 });
    expect(res).toEqual({ cost: '0', response: { cnt: 1, cost: '0' } });
  });

  it('getStatus', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz&id=37&phone=77718637484&fmt=3`,
      response: { last_date: '03.03.2018 15:47:14', last_timestamp: 1520070434, status: 1 },
    });

    const messageId = `37-77718637484`;
    const res = await smsc.getStatus(messageId);
    expect(res).toEqual({
      response: { last_date: '03.03.2018 15:47:14', last_timestamp: 1520070434, status: 1 },
      status: 1,
    });
  });

  it('getBalance', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/balance.php?login=test_dev_kz&psw=test_dev_kz&fmt=3`,
      response: { balance: '84.75' },
    });

    const res = await smsc.getBalance({ fmt: 3 });
    expect(res).toEqual({ balance: '84.75' });
  });
});
