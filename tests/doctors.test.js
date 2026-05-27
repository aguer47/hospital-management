const request = require("supertest");
const app = require("../server");
const { getDB } = require("../config/db");

// Mocking the DB config so we don't need a real connection for testing
jest.mock("../config/db", () => ({
  getDB: jest.fn(),
  connectDB: jest.fn()
}));

describe("Doctors API Tests", () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ firstName: "Dr. Ham", specialization: "Cardiology" }]),
      findOne: jest.fn().mockImplementation((query) => {
        if (query._id.toString() === "665399580000000000000000") {
          return Promise.resolve(null);
        }
        return Promise.resolve({ firstName: "Dr. Ham", specialization: "Cardiology" });
      })
    };
    
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    getDB.mockReturnValue(mockDb);
  });

  // Check if we can get the full list
  test("GET /doctors should return the list of doctors", async () => {
    const res = await request(app).get("/doctors");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Check for bad ID format
  test("GET /doctors/:id should return 400 for bad ID", async () => {
    const res = await request(app).get("/doctors/invalid-id-123");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Invalid ID format");
  });

  // Check for non-existent doctor
  test("GET /doctors/:id should return 404 if not found", async () => {
    const res = await request(app).get("/doctors/665399580000000000000000");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("Doctor not found");
  });

});
