import Account from '../models/accounts';
import accounts from '../models/mock_data/accounts';

/**
 * @class AccountController
 * @description class to create, change status, debit && credit an account.
 * @exports Accountcontroller
 */
class AccountController {
  /**
   * @method createAccount
   * @description Create a new account
   * @param {object} req - The user Request Object
   * @param {object} res - The user Response Object
   * @returns {object} API RESPONSE IN JSON FORMAT
   */
  static async createAccount(req, res) {
    try {
      const { rows } = await Account.createAccount(req.body, req);
      return res.status(201).json({
        status: res.statusCode,
        data: [{
          firstName: req.user.firstname,
          lastName: req.user.lastname,
          email: req.user.email,
          accountNumber: rows[0].accountNumber,
          type: rows[0].type,
          initialDeposit: rows[0].balance,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.detail,
      });
    }
  }

  /**
   * @method changeStatus
   * @description method to change user status
   * @param  {object} req - The User Request Object
   * @param  {object} res - The user Response Object
   * @returns {object} API RESPONSE IN JSON FORMAT
   */
  static async changeStatus(req, res) {
    try {
      const { accountNumber } = req.params;
      const { status } = req.body;

      const response = await Account.updateStatus(accountNumber, status);
      const acctDetails = response.rows[0];
      return res.status(200).json({
        status: res.statusCode,
        data: [{
          accountNumber: acctDetails.accountnumber,
          status: acctDetails.status,
        }],
      });
    } catch (error) {
      return res.status(400).json({
        status: res.statusCode,
        error: error.detail,
      });
    }
    // return res.status(200).json({
    //   status: res.statusCode,
    //   data: {
    //     accountNumber,
    //     status: req.body.status,
    //   },
    // });
  }

  // /**
  //  * @method deleteAccount
  //  * @description Deletes the account with the given account Number
  //  * @param  {object} req - The User Request Object
  //  * @param  {object} res - The user Response Object
  //  */
  // static deleteAccount(req, res) {
  //   const acctInfo = Account.checkAccount(req.params.accountNumber);

  //   const index = accounts.indexOf(acctInfo) + 1;
  //   Account.deleteAccount(index);

  //   res.status(200).json({
  //     status: res.statusCode,
  //     message: 'Account Successfully deleted',
  //   });
  // }
}

export default AccountController;
