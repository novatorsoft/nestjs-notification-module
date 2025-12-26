import * as SendgridMail from '@sendgrid/mail';

import { SENDGRID_CONFIG_KEY, SendgridConfig } from './sendgrid.config';
import {
  SendEmailArgsFixture,
  SendgridConfigFixture,
} from '../../../../test/fixtures/email';
import { Test, TestingModule } from '@nestjs/testing';

import { MockFactory } from 'mockingbird';
import { SendgridService } from './sendgrid.service';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe('SendgridService', () => {
  let service: SendgridService;
  let mockSendgridConfig: SendgridConfig;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSendgridConfig = MockFactory(
      SendgridConfigFixture,
    ).one() as SendgridConfig;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendgridService,
        {
          provide: SENDGRID_CONFIG_KEY,
          useValue: mockSendgridConfig,
        },
      ],
    }).compile();

    service = module.get<SendgridService>(SendgridService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendAsync', () => {
    const sendEmailArgs = MockFactory(SendEmailArgsFixture).one();

    it('should send email successfully and return true', async () => {
      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      const result = await service.sendAsync(sendEmailArgs);

      expect(result).toBe(true);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        from: mockSendgridConfig.defaultFromAddress,
        to: sendEmailArgs.to,
        subject: sendEmailArgs.subject,
        html: sendEmailArgs.content,
        cc: [],
        bcc: [],
        attachments: [],
      });
    });

    it('should use from address from sendEmailArgs when provided', async () => {
      const sendEmailArgs = MockFactory(SendEmailArgsFixture).one().withFrom();
      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      await service.sendAsync(sendEmailArgs);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: sendEmailArgs.from,
        }),
      );
    });

    it('should include cc and bcc when provided', async () => {
      const sendEmailArgs = MockFactory(SendEmailArgsFixture)
        .one()
        .withCc()
        .withBcc();

      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      await service.sendAsync(sendEmailArgs);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: sendEmailArgs.cc,
          bcc: sendEmailArgs.bcc,
        }),
      );
    });

    it('should include attachments when provided', async () => {
      const argsWithAttachments = MockFactory(SendEmailArgsFixture)
        .one()
        .withAttachments();

      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      await service.sendAsync(argsWithAttachments);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: argsWithAttachments.attachments?.map((attachment) => ({
            ...attachment,
            disposition: attachment.disposition ?? 'attachment',
          })),
        }),
      );
    });

    it('should handle multiple recipients', async () => {
      const argsWithMultipleRecipients = MockFactory(SendEmailArgsFixture)
        .one()
        .withMultipleRecipients();

      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      await service.sendAsync(argsWithMultipleRecipients);

      expect(sendMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: argsWithMultipleRecipients.to,
        }),
      );
    });

    it('should return false when send throws an error', async () => {
      const error = new Error('Sendgrid Error');
      const sendMock = (SendgridMail.send as jest.Mock).mockRejectedValueOnce(
        error,
      );

      const result = await service.sendAsync(sendEmailArgs);

      expect(result).toBe(false);
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it('should handle error and log it', async () => {
      const error = new Error('Sendgrid Error');
      (SendgridMail.send as jest.Mock).mockRejectedValueOnce(error);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.sendAsync(sendEmailArgs);

      expect(loggerSpy).toHaveBeenCalledWith(error);
    });

    it('should throw an error when "from" is missing', async () => {
      delete mockSendgridConfig.defaultFromAddress;
      const sendEmailArgs = MockFactory(SendEmailArgsFixture).one();
      const sendMock = (SendgridMail.send as jest.Mock).mockResolvedValueOnce([
        {
          statusCode: 202,
        },
      ]);

      await expect(service.sendAsync(sendEmailArgs)).rejects.toThrow(
        'From address is required',
      );
      expect(sendMock).not.toHaveBeenCalled();
    });
  });
});
