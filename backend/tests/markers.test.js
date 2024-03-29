import request from 'supertest';
import { app } from '../index';
import { Marker } from '../models/markerModel';

describe('GET /marker', () => {
  it('should respond with status 200 and return all markers', async () => {
    const response = await request(app).get('/marker');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });



  it('should respond with status 500 if there is an error fetching markers', async () => {
    jest.spyOn(Marker, 'find').mockRejectedValueOnce(new Error('Mocked error'));

    const response = await request(app).get('/marker');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch markers' });
  });



  it('should respond with status 200 and include specific marker data', async () => {
    const specificMarker = await Marker.findOne({ building: "Beatty Hall" });
  
    const response = await request(app).get('/marker');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: specificMarker._id.toString(),
          building: specificMarker.building,
          lat: specificMarker.lat,
          lon: specificMarker.lon,
        })
      ])
    );
  });
  

  
});
