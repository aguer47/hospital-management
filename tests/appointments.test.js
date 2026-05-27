const request = require("supertest");
const app = require("../server");
const { getDB } = require("../config/db");

// Mocking the database for tests
jest.mock("../config/db", () => ({
  getDB: jest.fn(),
  connectDB: jest.fn()
}));

describe("Appointments API Tests", () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ patientId: "1", doctorId: "2", date: "2024-10-10" }]),
      findOne: jest.fn().mockImplementation((query) => {
        if (query._id.toString() === "665399580000000000000000") {
          return Promise.resolve(null);
        }
        return Promise.resolve({ patientId: "1", doctorId: "2", date: "2024-10-10" });
      })
    };
    
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    getDB.mockReturnValue(mockDb);
  });

  // Test getting all
  test("GET /appointments should return status 200", async () => {
    const res = await request(app).get("/appointments");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test with invalid ID
  test("GET /appointments/:id should return 400 for invalid ID", async () => {
    const res = await request(app).get("/appointments/bad-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid ID format");
  });

  // Test with missing appointment
  test("GET /appointments/:id should return 404 if not found", async () => {
    const res = await request(app).get("/appointments/665399580000000000000000");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("No appointment found");
  });

});
