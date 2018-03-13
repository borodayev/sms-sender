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

  it('sendSms', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz123&phones=77718637484&mes=hello&fmt=3&cost=3`,
      response: { balance: '84.75', cnt: 1, cost: '0', id: 24 },
    });

    const params = { phones: '77718637484', mes: 'hello', fmt: 3, cost: 3 };
    const res = await smsc.sendSms(params);
    expect(res).toEqual({
      messageId: '24-77718637484',
      response: { balance: '84.75', cnt: 1, cost: '0', id: 24 },
    });
  });

  // delete already sended message
  it('deleteSms', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz123&id=29&phone=77718637484&del=1&fmt=3`,
      response: { result: 'OK' },
    });

    const messageId = `29-77718637484`;
    const res = await smsc.deleteSms(messageId, { fmt: 3 });
    expect(res).toEqual({ result: 'OK' });
  });

  it('getCost', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=test_dev_kz&psw=test_dev_kz123&cost=1&phones=77718637484&mes=hello&fmt=3`,
      response: { cnt: 1, cost: '0' },
    });

    const res = await smsc.getCost({ phones: '77718637484', mes: 'hello', fmt: 3 });
    expect(res).toEqual({ cost: '0', response: { cnt: 1, cost: '0' } });
  });

  describe('getStatus', () => {
    // get status
    it('just status', async () => {
      fetchMock.mock({
        matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz123&id=37&phone=77718637484&fmt=3`,
        response: { last_date: '03.03.2018 15:47:14', last_timestamp: 1520070434, status: 1 },
      });

      const messageId = `37-77718637484`;
      const res = await smsc.getStatus(messageId, { fmt: 3 });
      expect(res).toEqual({
        response: { last_date: '03.03.2018 15:47:14', last_timestamp: 1520070434, status: 1 },
        status: 1,
      });
    });

    // get status with full information about sended message
    it('with more details', async () => {
      fetchMock.mock({
        matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz123&id=37&phone=77718637484&fmt=3&all=1`,
        response: {
          cost: '0.00',
          last_date: '12.03.2018 12:01:04',
          last_timestamp: 1520834464,
          message: 'hello',
          phone: '77718637484',
          send_date: '12.03.2018 12:01:02',
          send_timestamp: 1520834462,
          sender_id: 'SMS-CENTRE',
          status: 1,
          status_name: '����������',
          type: 0,
        },
        status: 1,
      });

      const messageId = `37-77718637484`;
      const res = await smsc.getStatus(messageId, { fmt: 3, all: 1 });
      expect(res).toEqual({
        response: {
          cost: '0.00',
          last_date: '12.03.2018 12:01:04',
          last_timestamp: 1520834464,
          message: 'hello',
          phone: '77718637484',
          send_date: '12.03.2018 12:01:02',
          send_timestamp: 1520834462,
          sender_id: 'SMS-CENTRE',
          status: 1,
          status_name: '����������',
          type: 0,
        },
        status: 1,
      });
    });

    // get status with full information + country, operator, region
    it('full info', async () => {
      fetchMock.mock({
        matcher: `http://smsc.ru/sys/status.php?login=test_dev_kz&psw=test_dev_kz123&id=37&phone=77718637484&fmt=3&all=2`,
        response: {
          cost: '0.00',
          country: '���������',
          last_date: '12.03.2018 12:01:04',
          last_timestamp: 1520834464,
          message: 'hello',
          operator: 'Beeline',
          phone: '77718637484',
          region: '',
          send_date: '12.03.2018 12:01:02',
          send_timestamp: 1520834462,
          sender_id: 'SMS-CENTRE',
          status: 1,
          status_name: '����������',
          type: 0,
        },
        status: 1,
      });

      const messageId = `37-77718637484`;
      const res = await smsc.getStatus(messageId, { fmt: 3, all: 2 });
      expect(res).toEqual({
        response: {
          cost: '0.00',
          country: '���������',
          last_date: '12.03.2018 12:01:04',
          last_timestamp: 1520834464,
          message: 'hello',
          operator: 'Beeline',
          phone: '77718637484',
          region: '',
          send_date: '12.03.2018 12:01:02',
          send_timestamp: 1520834462,
          sender_id: 'SMS-CENTRE',
          status: 1,
          status_name: '����������',
          type: 0,
        },
        status: 1,
      });
    });
  });

  describe('getBalance', () => {
    it('without currency', async () => {
      fetchMock.mock({
        matcher: `http://smsc.ru/sys/balance.php?login=test_dev_kz&psw=test_dev_kz123&fmt=3`,
        response: { balance: '84.75' },
      });

      const res = await smsc.getBalance({ fmt: 3 });
      expect(res).toEqual({ balance: '84.75' });
    });

    it('with currency', async () => {
      fetchMock.mock({
        matcher: `http://smsc.ru/sys/balance.php?login=test_dev_kz&psw=test_dev_kz123&fmt=3&cur=1`,
        response: { balance: '84.75', currency: 'KZT' },
      });

      const res = await smsc.getBalance({ fmt: 3, cur: 1 });
      expect(res).toEqual({ balance: '84.75', currency: 'KZT' });
    });
  });
});
