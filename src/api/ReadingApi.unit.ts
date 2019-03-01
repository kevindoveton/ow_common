import 'mocha';
import * as assert from 'assert';
//@ts-ignore
import MockFirestore from 'mock-cloud-firestore';
import { admin } from '../test/TestFirebase';
import { DefaultReading } from '../model';
import { unsafeUnwrap } from '../utils';
import { ReadingApi } from './ReadingApi';
type Firestore = admin.firestore.Firestore;

const {
  orgId,
} = require('../test/testConfig.json');


describe('Reading Api', function () {
  this.timeout(5000);
  const firestore: Firestore = new MockFirestore({}).firestore();
  const readingApi = new ReadingApi(firestore, orgId);


  this.beforeAll(async () => {
    await readingApi.readingCol().doc("reading_001").set({...DefaultReading, resourceId: "00001", timeseriesId: 'default'})
    await readingApi.readingCol().doc("reading_002").set({...DefaultReading, resourceId: "00001", timeseriesId: 'default'})
    await readingApi.readingCol().doc("reading_003").set({...DefaultReading, resourceId: "00002", timeseriesId: 'default'})
    await readingApi.readingCol().doc("reading_004").set({...DefaultReading, resourceId: "00002", timeseriesId: 'default'})
    await readingApi.readingCol().doc("reading_005").set({...DefaultReading, resourceId: "00003", timeseriesId: 'default'})
    await readingApi.readingCol().doc("reading_006").set({...DefaultReading, resourceId: "00003", timeseriesId: 'default'})
  });


  it('gets a list of readings for a resourceId', async () => {
    //Arrange
    const resourceId = "00001";
    const params = {
      limit: 10,
    }

    //Act
    const readings = unsafeUnwrap(await readingApi.getReadingsForResourceId(resourceId, params));

    //Assert
    assert.equal(readings.readings.length, 2);
  });


  it('gets a list of readings for multiple resourceIds',  async () => {
    //Arrange
    const resourceIds = ["00001", "00003"];
    const params = {
      limit: 10,
    }

    //Act
    const readings = unsafeUnwrap(await readingApi.getReadingsForResources(resourceIds, params));

    //Assert
    assert.equal(readings.readings.length, 4);
  });


  it('obeys the limit for individual resourceIds', async () => {
    //Arrange
    const resourceId = "00001";
    const params = {
      limit: 1
    }

    //Act
    const readings = unsafeUnwrap(await readingApi.getReadingsForResourceId(resourceId, params));

    //Assert
    assert.equal(readings.readings.length, 1);
  });


  this.afterAll(async () => {
    await readingApi.readingCol().doc("reading_001").delete();
    await readingApi.readingCol().doc("reading_002").delete();
    await readingApi.readingCol().doc("reading_003").delete();
    await readingApi.readingCol().doc("reading_004").delete();
    await readingApi.readingCol().doc("reading_005").delete();
    await readingApi.readingCol().doc("reading_006").delete();
  });
});