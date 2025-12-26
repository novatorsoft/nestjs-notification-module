import * as js2xmlparser from 'js2xmlparser';

import {
  MutlucellConfigFixture,
  SendSmsArgsFixture,
} from '../../../../test/fixtures';
import { Test, TestingModule } from '@nestjs/testing';

import { MockFactory } from 'mockingbird';
import { MutlucellConfig } from './mutlucell.config';
import { MutlucellService } from './mutlucell.service';
import { SendSmsArgs } from '../../dto';
import faker from 'faker';

jest.mock('js2xmlparser', () => ({
  parse: jest.fn(),
}));

describe('MutlucellService', () => {
  let service: MutlucellService;
  let mockConfig: MutlucellConfig;
  let mockFetch: jest.Mock;
  const defaultApiUrl = 'https://smsgw.mutlucell.com/smsgw-ws/sndblkex';

  beforeEach(async () => {
    mockFetch = jest.fn();
    global.fetch = mockFetch as unknown as typeof fetch;

    mockConfig = MockFactory(MutlucellConfigFixture).one();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MutlucellService,
        {
          provide: 'MutlucellConfig',
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<MutlucellService>(MutlucellService);
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
      const mockXml = '<xml><test>mock</test></xml>';
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
          body: mockXml,
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
      const emptyMessageArgs: SendSmsArgs = {
        countryCode: '+90',
        phoneNumber: '5551234567',
        message: '',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      await expect(service.sendAsync(emptyMessageArgs)).rejects.toThrow(
        'Message cannot be empty',
      );
    });
  });
});
