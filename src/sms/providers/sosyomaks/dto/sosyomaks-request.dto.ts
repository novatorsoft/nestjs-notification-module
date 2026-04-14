export class SosyomaksRequest {
  UserName: string;
  PassWord: string;
  Action: string;
  Mesgbody: string;
  Numbers: string;
  Originator: string;
  SDate: string;
  ExDate: string;

  constructor(
    message: string,
    phoneNumber: string,
    username: string,
    password: string,
    originator: string,
    action = '0',
    sdate = '',
    exdate = '',
  ) {
    this.UserName = username;
    this.PassWord = password;
    this.Action = action;
    this.Mesgbody = message;
    this.Numbers = phoneNumber;
    this.Originator = originator;
    this.SDate = sdate;
    this.ExDate = exdate;
  }
}
