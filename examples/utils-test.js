// // @flow
//
// import { preparePhones, writeToDB } from '../utils';
//
// jest.mock('../schema/db');
//
// describe('Utils', () => {
//   describe('preparePhones', () => {
//     it('if just string', () => {
//       const phones = '+77718637484';
//       const preparedPhones = preparePhones(phones);
//       expect(preparedPhones).toBe('+77718637484');
//     });
//
//     it('if array of string', () => {
//       const phones = ['+77718637484', '+77718637485', '+77718637486', '+77718637487'];
//       const preparedPhones = preparePhones(phones);
//       expect(preparedPhones).toBe('+77718637484,+77718637485,+77718637486,+77718637487');
//     });
//   });
//
//   describe('writeToDB', () => {
//     it.skip('with error from smsc', async () => {
//       const res = { id: 1, balance: 84.2, cost: 12, error: 'oooops', error_code: 1 };
//       const phones = '+77718637484';
//       const message = 'hello';
//       await writeToDB(res, message, phones);
//       expect(writeToDB).toThrowError('Cannot send sms: oooops, error_code: 1');
//     });
//
//     it('without error', async () => {
//       const res = { id: 1, balance: 84.2, cost: 12 };
//       const phones = '+77718637484,+77718637485';
//       const message = 'hello';
//
//       const fromDB = await writeToDB(res, message, phones);
//       expect(fromDB.balance).toBe(84.2);
//       expect(fromDB.cost).toBe(12);
//       expect(Array.isArray(fromDB.phones)).toBeTruthy();
//       expect(fromDB.phones[0]).toBe('+77718637484');
//       expect(fromDB.phones[1]).toBe('+77718637485');
//     });
//   });
// });
