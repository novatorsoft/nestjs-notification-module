export class SosyomaksRequest {
  UserName: string;
  PassWord: string;
  Action: string;
  Mesgbody: string;
  Numbers: string;
  Originator: string;
  SDate?: string;
  ExDate?: string;

  constructor(
    message: string,
    phoneNumber: string,
    username: string,
    password: string,
    originator: string,
    action = '0',
    sdate?: string,
    exdate?: string,
  ) {
    this.UserName = username;
    this.PassWord = password;
    this.Action = action;
    this.Mesgbody = message;
    this.Numbers = phoneNumber;
    this.Originator = originator;
    if (sdate) this.SDate = sdate;
    if (exdate) this.ExDate = exdate;
  }
}
