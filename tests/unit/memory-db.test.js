const MemoryDB = require('../../src/Model/data/memory/memory-db.js');
const dbInstance = new MemoryDB();

describe('Memory Database Fragment Operations', () => {
  const testId = 'testFragmentId';
  const testData = { content: 'This is a test fragment.' };

  it('should write and read a fragment', async () => {
    await dbInstance.put(testId, 'fragment', testData);
    const retrievedData = await dbInstance.get(testId, 'fragment');
    expect(retrievedData).toEqual(testData);
  });

  it('should write and read fragment data', async () => {
    const testDataContent = 'Test fragment content';
    await dbInstance.put(testId, 'fragmentData', testDataContent);
    const retrievedDataContent = await dbInstance.get(testId, 'fragmentData');
    expect(retrievedDataContent).toEqual(testDataContent);
  });

  it('should return null for non-existent fragment', async () => {
    const nonExistentId = 'nonExistentId';
    const retrievedData = await dbInstance.get(nonExistentId, 'fragment');
    expect(retrievedData).toBeUndefined();
  });

  it('should overwrite existing fragment data', async () => {
    const updatedData = { content: 'Updated test fragment.' };
    await dbInstance.put(testId, 'fragment', updatedData);
    const retrievedUpdatedData = await dbInstance.get(testId, 'fragment');
    expect(retrievedUpdatedData).toEqual(updatedData);
  });

  // Test for the del method
  it('should delete a fragment and ensure it no longer exists', async () => {
    await dbInstance.put(testId, 'fragment', testData);
    await dbInstance.del(testId, 'fragment');
    const retrievedDataAfterDelete = await dbInstance.get(testId, 'fragment');
    expect(retrievedDataAfterDelete).toBeUndefined();
  });
});
