import * as js2xmlparser from 'js2xmlparser';

import { SOSYOMAKS_CONFIG_KEY, SosyomaksConfig } from './sosyomaks.config';
import {
  SosyomaksConfigFixture,
  SendSmsArgsFixture,
} from '../../../../test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';

import { MockFactory } from 'mockingbird';
import { SosyomaksService } from './sosyomaks.service';
import { SendSmsArgs } from '../../dto';
import faker from 'faker';

jest.mock('js2xmlparser', () => ({
  parse: jest.fn(),
}));

describe('SosyomaksService', () => {
  let service: SosyomaksService;
  let mockConfig: SosyomaksConfig;
  let mockFetch: jest.Mock;
  const defaultApiUrl = 'https://www.sosyomaks.com/api/send/post';

  beforeEach(async () => {
    mockFetch = jest.fn();
    global.fetch = mockFetch as unknown as typeof fetch;

    const fixture = MockFactory(SosyomaksConfigFixture).one().withProvider();
    mockConfig = fixture as unknown as SosyomaksConfig;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SosyomaksService,
        {
          provide: SOSYOMAKS_CONFIG_KEY,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<SosyomaksService>(SosyomaksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendAsync', () => {
    const sendSmsArgs: SendSmsArgs = MockFactory(SendSmsArgsFixture).one();

    it('should send SMS successfully and return true', async () => {
      const mockXml = '<SingleTextSMS><test>mock</test></SingleTextSMS>';
      (js2xmlparser.parse as jest.Mock).mockReturnValue(mockXml);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      const result = await service.sendAsync(sendSmsArgs);

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        defaultApiUrl,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
          },
        }),
      );
    });


    it('should use custom apiUrl when provided in config', async () => {
      mockConfig.apiUrl = faker.internet.url();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await service.sendAsync(sendSmsArgs);

      expect(mockFetch).toHaveBeenCalledWith(
        mockConfig.apiUrl,
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should use default apiUrl when not provided in config', async () => {
      delete mockConfig.apiUrl;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await service.sendAsync(sendSmsArgs);

      expect(mockFetch).toHaveBeenCalledWith(defaultApiUrl, expect.anything());
    });

    it('should return false when fetch throws an error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.sendAsync(sendSmsArgs);

      expect(result).toBe(false);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', async () => {
      const emptyMessageArgs = MockFactory(SendSmsArgsFixture)
        .one()
        .withEmptyMessage();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await expect(service.sendAsync(emptyMessageArgs)).rejects.toThrow(
        'Message cannot be empty',
      );
    });

    it('should handle error and log it', async () => {
      const sendSmsArgs = MockFactory(SendSmsArgsFixture).one();
      const error = new Error('Sosyomaks Error');
      mockFetch.mockRejectedValueOnce(error);
      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.sendAsync(sendSmsArgs);

      expect(loggerSpy).toHaveBeenCalledWith(error);
    });


    it('should remove leading zeros from phone number', async () => {
      const mockXml = '<SingleTextSMS><test>mock</test></SingleTextSMS>';
      (js2xmlparser.parse as jest.Mock).mockReturnValue(mockXml);

      const argsWithLeadingZero = {
        ...sendSmsArgs,
        phoneNumber: '05321234567',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await service.sendAsync(argsWithLeadingZero);

      expect(js2xmlparser.parse).toHaveBeenCalledWith(
        'SingleTextSMS',
        expect.objectContaining({
          Numbers: '5321234567',
        }),
        expect.anything(),
      );
    });

    it('should use Action=0 for non-Turkish messages', async () => {
      const mockXml = '<SingleTextSMS><test>mock</test></SingleTextSMS>';
      (js2xmlparser.parse as jest.Mock).mockReturnValue(mockXml);

      const englishMessage = {
        ...sendSmsArgs,
        message: 'Hello World',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await service.sendAsync(englishMessage);

      expect(js2xmlparser.parse).toHaveBeenCalledWith(
        'SingleTextSMS',
        expect.objectContaining({
          Action: '0',
        }),
        expect.anything(),
      );
    });

    it('should use Action=12 for Turkish messages', async () => {
      const mockXml = '<SingleTextSMS><test>mock</test></SingleTextSMS>';
      (js2xmlparser.parse as jest.Mock).mockReturnValue(mockXml);

      const turkishMessage = {
        ...sendSmsArgs,
        message: 'Merhaba dünya, şifreniz: 1234',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await service.sendAsync(turkishMessage);

      expect(js2xmlparser.parse).toHaveBeenCalledWith(
        'SingleTextSMS',
        expect.objectContaining({
          Action: '12',
        }),
        expect.anything(),
      );
    });
  });
});
