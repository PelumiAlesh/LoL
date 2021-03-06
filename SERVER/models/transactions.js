import moment from 'moment';
import Account from './accounts';
import db from './migrations/db';
import queries from './migrations/queries';

const {
  getTransactions,
  updateAccount,
  insertTransactions,
  getEmail,
} = queries;

/**
 * @class Transactions
 * @description Make debit or credit transaction on an account
 * @exports Transaction
 */
class Transactions {
  /**
   * @method transact
   * @description Make debit or credit transaction on an account
   * @param {object} req - The staff request Object
   * @param {object} res - The ReSPONSE Object
   * @param {string} type - Credit or Debit
   * @returns {object} Transaction details
   */
  static async transact(req, res, type) {
    const { accountNumber } = req.params;
    const accountDetails = await Account.checkAccount(accountNumber);
    const oldBalance = Number(accountDetails.rows[0].balance);
    const amount = Number(req.body.amount);

    const newBalance = type === 'credit' ? await oldBalance + amount : await oldBalance - amount;
    if (newBalance < 1) {
      return res.status(200).json({
        status: res.statusCode,
        message: 'Oops, this account has insufficient fund!',
      });
    }
    await db.query(updateAccount, [newBalance, accountNumber]);

    const values = [moment(new Date()), type, accountNumber, req.user.id, amount, oldBalance, newBalance];
    const response = await db.query(insertTransactions, values);

    return response;
  }

  static async getEmail(accountNumber) {
    const response = await db.query(getEmail, [accountNumber]);
    const { rows } = response;
    const { email } = rows[0];
    return email;
  }

  /**
  * @method getOne
  * @description Fetches a specific transaction
  * @param {object} req - The request object
  * @returns {object} Response
  */
  static getTransaction(req) {
    const values = [req.params.id, req.user.id];
    const response = db.query(getTransactions, values);
    return response;
  }
}


export default Transactions;
