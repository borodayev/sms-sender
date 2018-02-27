// @flow

// import fetchMock from 'fetch-mock';
import Smsc from '../Smsc';

describe('Smsc', () => {
  const login = 'test_dev_kz';
  const password = 'test_dev_kz';
  const smsc = new Smsc({ login, password });

  it('send', async () => {
    const phones = ['+77081949582'];
    const message = 'hello';

    // fetchMock.mock({
    //   matcher: `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}`,
    //   response: () => {
    //     return 'ok';
    //   },
    // });

    // smsc.send = jest.fn();
    const res = await smsc.send({ phones, message });
    expect(res).toBe();
    // expect(smsc.send).toBeCalledWith({ message: 'hello', phones: '+77081949582' });
  });
});
