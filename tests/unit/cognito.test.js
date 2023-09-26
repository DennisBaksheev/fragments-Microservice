const { mock } = require('jest-mock');
const mockCognitoJwtVerifier = {
  create: mock.fn(() => ({
    hydrate: mock.fn(() => Promise.resolve()),
    verify: mock.fn(() => Promise.resolve({ email: 'test@example.com' })),
  })),
};
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: mockCognitoJwtVerifier,
}));

// Import the module you're testing
const cognito = require('../../../src/auth/cognito');

describe('Cognito Functionality', () => {
  beforeEach(() => {
    // Reset the mock state and the module cache before each test to ensure a fresh start
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('throws an error if environment variables are missing', () => {
    // Temporarily delete the env vars
    const originalPoolId = process.env.AWS_COGNITO_POOL_ID;
    const originalClientId = process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;

    // Try to require the module again, expecting an error to be thrown
    expect(() => require('../../../src/auth/cognito')).toThrow(
      'missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID'
    );

    // Restore the original env vars
    process.env.AWS_COGNITO_POOL_ID = originalPoolId;
    process.env.AWS_COGNITO_CLIENT_ID = originalClientId;
  });

  it('calls jwtVerifier.hydrate on startup', () => {
    expect(mockCognitoJwtVerifier.create().hydrate).toHaveBeenCalled();
  });

  it('returns a strategy function', () => {
    expect(typeof cognito.strategy).toBe('function');
  });

  it('strategy calls jwtVerifier.verify and handles success', async () => {
    const strategy = cognito.strategy();
    const doneMock = jest.fn();
    await strategy._verify('someToken', doneMock); // _verify is the internal method used by the BearerStrategy
    expect(mockCognitoJwtVerifier.create().verify).toHaveBeenCalledWith('someToken');
    expect(doneMock).toHaveBeenCalledWith(null, 'test@example.com');
  });

  it('strategy calls jwtVerifier.verify and handles error', async () => {
    // Override the verify mock to reject with an error
    mockCognitoJwtVerifier.create().verify.mockRejectedValueOnce(new Error('Verification failed'));

    const strategy = cognito.strategy();
    const doneMock = jest.fn();
    await strategy._verify('someToken', doneMock);
    expect(mockCognitoJwtVerifier.create().verify).toHaveBeenCalledWith('someToken');
    expect(doneMock).toHaveBeenCalledWith(null, false);
  });
});
