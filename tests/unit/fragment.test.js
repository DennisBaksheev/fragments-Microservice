const Fragment = require('../../src/Model/fragment');

describe('Fragment Class Operations', () => {
  const testId = 'testFragmentId';
  const testData = { content: 'This is a test fragment.' };
  const testDataContent = 'Test fragment content';

  // Test for getFragment and setFragment methods
  it('should set and get a fragment', async () => {
    await Fragment.setFragment(testId, testData);
    const retrievedData = await Fragment.getFragment(testId);
    expect(retrievedData).toEqual(testData);
  });

  // Test for getFragmentData and setFragmentData methods
  it('should set and get fragment data', async () => {
    await Fragment.setFragmentData(testId, testDataContent);
    const retrievedDataContent = await Fragment.getFragmentData(testId);
    expect(retrievedDataContent).toEqual(testDataContent);
  });

  // Test for isSupportedType method
  it('should correctly identify supported content types', () => {
    const supportedType1 = 'text/plain';
    const supportedType2 = 'application/json';
    const unsupportedType = 'text/html';

    expect(Fragment.isSupportedType(supportedType1)).toBe(true);
    expect(Fragment.isSupportedType(supportedType2)).toBe(true);
    expect(Fragment.isSupportedType(unsupportedType)).toBe(false);
  });

  // Additional test to ensure non-existent fragment returns undefined
  it('should return undefined for non-existent fragment', async () => {
    const nonExistentId = 'nonExistentId';
    const retrievedData = await Fragment.getFragment(nonExistentId);
    expect(retrievedData).toBeUndefined();
  });
});
