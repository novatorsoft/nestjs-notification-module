import * as Nodemailer from 'nodemailer';

import { SMTP_CONFIG_KEY, SmtpConfig } from './smtp.config';
import {
  SendEmailArgsFixture,
  SmtpConfigFixture,
} from '../../../../test/fixtures/email';
import { Test, TestingModule } from '@nestjs/testing';

import { EmailProvider } from '../../../email/enum';
import { MockFactory } from 'mockingbird';
import { SmtpService } from './smtp.service';
import faker from 'faker';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('SmtpService', () => {
  let service: SmtpService;
  let mockSmtpConfig: SmtpConfig;
  let mockTransporter: {
    sendMail: jest.Mock;
  };

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn(),
    };

    (Nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    mockSmtpConfig = MockFactory(SmtpConfigFixture).one();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmtpService,
        {
          provide: SMTP_CONFIG_KEY,
          useValue: mockSmtpConfig,
        },
      ],
    }).compile();

    service = module.get<SmtpService>(SmtpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transporter with correct config', () => {
    expect(Nodemailer.createTransport).toHaveBeenCalledWith({
      host: mockSmtpConfig.host,
      auth: {
        user: mockSmtpConfig.auth.user,
        pass: mockSmtpConfig.auth.password,
      },
      port: mockSmtpConfig.port,
      secure: mockSmtpConfig.secure,
      requireTLS: mockSmtpConfig.requireTLS,
    });
  });

  it('should use default values when config options are missing', async () => {
    const configWithoutDefaults: SmtpConfig = {
      provider: EmailProvider.SMTP,
      host: faker.internet.url(),
      auth: {
        user: faker.internet.email(),
        password: faker.internet.password(),
      },
    };

    await Test.createTestingModule({
      providers: [
        SmtpService,
        {
          provide: SMTP_CONFIG_KEY,
          useValue: configWithoutDefaults,
        },
      ],
    }).compile();

    expect(Nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 465,
        secure: true,
        requireTLS: false,
      }),
    );
  });

  describe('sendAsync', () => {
    const sendEmailArgs = MockFactory(SendEmailArgsFixture).one();

    it('should send email successfully and return true', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({
        messageId: 'test-message-id',
      });

      const result = await service.sendAsync(sendEmailArgs);

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: mockSmtpConfig.defaultFromAddress,
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
      mockTransporter.sendMail.mockResolvedValueOnce({
        messageId: 'test-message-id',
      });

      await service.sendAsync(sendEmailArgs);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
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

      mockTransporter.sendMail.mockResolvedValueOnce({
        messageId: 'test-message-id',
      });

      await service.sendAsync(sendEmailArgs);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
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

      mockTransporter.sendMail.mockResolvedValueOnce({
        messageId: 'test-message-id',
      });

      await service.sendAsync(argsWithAttachments);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
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

      mockTransporter.sendMail.mockResolvedValueOnce({
        messageId: 'test-message-id',
      });

      await service.sendAsync(argsWithMultipleRecipients);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: argsWithMultipleRecipients.to,
        }),
      );
    });

    it('should return false when sendMail throws an error', async () => {
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockRejectedValueOnce(error);

      const result = await service.sendAsync(sendEmailArgs);

      expect(result).toBe(false);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
    });

    it('should handle error and log it', async () => {
      const error = new Error('SMTP Error');
      mockTransporter.sendMail.mockRejectedValueOnce(error);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.sendAsync(sendEmailArgs);

      expect(loggerSpy).toHaveBeenCalledWith(error);
    });

    it('should throw an error when "from" is missing', async () => {
      delete mockSmtpConfig.defaultFromAddress;
      const sendEmailArgs = MockFactory(SendEmailArgsFixture).one();

      await expect(service.sendAsync(sendEmailArgs)).rejects.toThrow(
        'From address is required',
      );
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });
  });
});
