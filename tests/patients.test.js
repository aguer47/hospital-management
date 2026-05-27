const request = require("supertest");
const app = require("../server");
const { getDB } = require("../config/db");

// We need to mock the database because we don't want to use the real one during tests
jest.mock("../config/db", () => ({
  getDB: jest.fn(),
  connectDB: jest.fn()
}));

describe("Patients API Tests", () => {
  let mockDb;
  let mockCollection;

  // Setup the mock database before each test
  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ firstName: "John", lastName: "Doe" }]),
      findOne: jest.fn().mockImplementation((query) => {
        // If the ID matches our "not found" test ID, return null
        if (query._id.toString() === "665399580000000000000000") {
          return Promise.resolve(null);
        }
        // Otherwise return a sample patient
        return Promise.resolve({ firstName: "John", lastName: "Doe" });
      })
    };
    
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    // Make getDB return our mock database
    getDB.mockReturnValue(mockDb);
  });

  // Test 1: Get all patients
  test("Should get all patients and return 200", async () => {
    const res = await request(app).get("/patients");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test 2: Invalid ID format
  test("Should return 400 if the ID is not a valid MongoDB ID", async () => {
    const res = await request(app).get("/patients/123-not-valid");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("valid patient ID format");
  });

  // Test 3: Patient not found
  test("Should return 404 if the patient does not exist", async () => {
    const res = await request(app).get("/patients/665399580000000000000000");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("couldn't find a patient");
  });

});
