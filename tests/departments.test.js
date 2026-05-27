const request = require("supertest");
const app = require("../server");
const { getDB } = require("../config/db");

// Mocking the DB config
jest.mock("../config/db", () => ({
  getDB: jest.fn(),
  connectDB: jest.fn()
}));

describe("Departments API Tests", () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([{ name: "Emergency", location: "Main Hall" }]),
      findOne: jest.fn().mockImplementation((query) => {
        if (query._id.toString() === "665399580000000000000000") {
          return Promise.resolve(null);
        }
        return Promise.resolve({ name: "Emergency", location: "Main Hall" });
      })
    };
    
    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection)
    };
    
    getDB.mockReturnValue(mockDb);
  });

  // Check if we can get all departments
  test("GET /departments should return 200 and a list", async () => {
    const res = await request(app).get("/departments");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Check for bad ID
  test("GET /departments/:id should return 400 if ID is wrong", async () => {
    const res = await request(app).get("/departments/not-a-real-id");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("ID format is not valid");
  });

  // Check for missing department
  test("GET /departments/:id should return 404 if missing", async () => {
    const res = await request(app).get("/departments/665399580000000000000000");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toContain("No department found");
  });

});
